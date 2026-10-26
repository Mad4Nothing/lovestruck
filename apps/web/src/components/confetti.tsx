import { useEffect, useRef } from 'react';

interface Particle {
	x: number;
	y: number;
	vx: number;
	vy: number;
	size: number;
	color: string;
	shape: 'circle' | 'rect' | 'heart';
	rotation: number;
	rotationSpeed: number;
	wobble: number;
	wobbleSpeed: number;
	opacity: number;
}

const COLORS = [
	'#922441', // berry
	'#d57287', // romantic rose
	'#b62e43', // passionate red
	'#cb6e8d', // pink
	'#ba7e81', // soft nude rose
	'#ffd166', // warm gold sparkle
	'#f3d5da', // petal pink
	'#ff4d6d', // vibrant blush
];

export function Confetti() {
	const canvasRef = useRef<HTMLCanvasElement | null>(null);

	useEffect(() => {
		if (typeof window === 'undefined') return;
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

		const canvas = canvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		let animId: number;
		let particles: Particle[] = [];
		const dpr = Math.min(window.devicePixelRatio || 1, 2);

		const resize = () => {
			const rect = canvas.getBoundingClientRect();
			canvas.width = rect.width * dpr;
			canvas.height = rect.height * dpr;
			ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
		};
		resize();

		const width = () => canvas.width / dpr;
		const height = () => canvas.height / dpr;

		// Spawn initial burst of particles from center-bottom shooting upwards
		const spawnBurst = (count: number) => {
			const w = width();
			const h = height();
			for (let i = 0; i < count; i++) {
				const originX = w * (0.3 + Math.random() * 0.4);
				const originY = h * 0.55;
				const angle = -Math.PI / 2 + (Math.random() - 0.5) * 1.5;
				const speed = 4 + Math.random() * 8;
				const shapes: ('circle' | 'rect' | 'heart')[] = ['rect', 'rect', 'circle', 'heart'];

				particles.push({
					x: originX,
					y: originY,
					vx: Math.cos(angle) * speed,
					vy: Math.sin(angle) * speed,
					size: 5 + Math.random() * 6,
					color: COLORS[Math.floor(Math.random() * COLORS.length)],
					shape: shapes[Math.floor(Math.random() * shapes.length)],
					rotation: Math.random() * Math.PI * 2,
					rotationSpeed: (Math.random() - 0.5) * 0.18,
					wobble: Math.random() * Math.PI * 2,
					wobbleSpeed: 0.05 + Math.random() * 0.08,
					opacity: 1,
				});
			}
		};

		// First big burst
		spawnBurst(70);

		// Secondary gentle bursts at 1s, 2s, and 3s
		const t1 = setTimeout(() => spawnBurst(45), 1000);
		const t2 = setTimeout(() => spawnBurst(35), 2200);
		const t3 = setTimeout(() => spawnBurst(30), 3300);

		function drawHeart(c: CanvasRenderingContext2D, size: number) {
			const s = size * 0.6;
			c.beginPath();
			c.moveTo(0, s * 0.3);
			c.bezierCurveTo(-s * 0.5, -s * 0.3, -s, s * 0.1, 0, s);
			c.bezierCurveTo(s, s * 0.1, s * 0.5, -s * 0.3, 0, s * 0.3);
			c.fill();
		}

		let lastTime = performance.now();

		const render = (time: number) => {
			const dt = Math.min((time - lastTime) / 16.66, 2);
			lastTime = time;

			const w = width();
			const h = height();
			ctx.clearRect(0, 0, w, h);

			for (let i = particles.length - 1; i >= 0; i--) {
				const p = particles[i];
				p.x += p.vx * dt;
				p.y += p.vy * dt;
				p.vy += 0.18 * dt; // gravity
				p.vx *= Math.pow(0.985, dt); // air resistance
				p.rotation += p.rotationSpeed * dt;
				p.wobble += p.wobbleSpeed * dt;

				// fade out when falling off screen or late in life
				if (p.y > h * 0.85) {
					p.opacity -= 0.02 * dt;
				}

				if (p.opacity <= 0 || p.y > h + 50) {
					particles.splice(i, 1);
					continue;
				}

				ctx.save();
				ctx.translate(p.x, p.y);
				ctx.rotate(p.rotation);
				ctx.scale(Math.cos(p.wobble), 1);
				ctx.globalAlpha = Math.max(0, p.opacity);
				ctx.fillStyle = p.color;

				if (p.shape === 'heart') {
					drawHeart(ctx, p.size);
				} else if (p.shape === 'circle') {
					ctx.beginPath();
					ctx.arc(0, 0, p.size * 0.45, 0, Math.PI * 2);
					ctx.fill();
				} else {
					ctx.fillRect(-p.size * 0.6, -p.size * 0.3, p.size * 1.2, p.size * 0.6);
				}

				ctx.restore();
			}

			animId = requestAnimationFrame(render);
		};

		animId = requestAnimationFrame(render);
		window.addEventListener('resize', resize);

		return () => {
			cancelAnimationFrame(animId);
			clearTimeout(t1);
			clearTimeout(t2);
			clearTimeout(t3);
			window.removeEventListener('resize', resize);
		};
	}, []);

	return (
		<canvas
			ref={canvasRef}
			aria-hidden="true"
			style={{
				position: 'absolute',
				inset: 0,
				width: '100%',
				height: '100%',
				pointerEvents: 'none',
				zIndex: 20,
			}}
		/>
	);
}
