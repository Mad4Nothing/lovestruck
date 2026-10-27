import { useState, useRef, useCallback } from 'react';
import { ChevronLeft } from 'lucide-react';

interface SlideToUnlockProps {
	onUnlock: () => void;
	text?: string;
}

export function SlideToUnlock({ onUnlock, text = 'LOVE AT FIRST SWIPE' }: SlideToUnlockProps) {
	const [dragX, setDragX] = useState(0);
	const [isDragging, setIsDragging] = useState(false);
	const [unlocked, setUnlocked] = useState(false);
	const trackRef = useRef<HTMLDivElement | null>(null);
	const startX = useRef(0);
	const currentX = useRef(0);

	const getMaxDrag = useCallback(() => {
		if (!trackRef.current) return 220;
		// 54px thumb + 5px right + 5px left = 64px
		return Math.max(60, trackRef.current.clientWidth - 64);
	}, []);

	const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
		if (unlocked) return;
		setIsDragging(true);
		// Dragging to the left: delta = startX - clientX
		startX.current = e.clientX + currentX.current;
		e.currentTarget.setPointerCapture(e.pointerId);
	};

	const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
		if (!isDragging || unlocked) return;
		const max = getMaxDrag();
		const delta = startX.current - e.clientX;
		const nextX = Math.min(Math.max(0, delta), max);
		currentX.current = nextX;
		setDragX(nextX);
	};

	const handlePointerEnd = (e: React.PointerEvent<HTMLDivElement>) => {
		if (!isDragging || unlocked) return;
		setIsDragging(false);
		try {
			if (e.currentTarget.hasPointerCapture(e.pointerId)) {
				e.currentTarget.releasePointerCapture(e.pointerId);
			}
		} catch {
			// ignore pointer capture release error
		}

		const max = getMaxDrag();
		// If dragged 60% or more toward the left, complete unlock!
		if (currentX.current >= max * 0.6) {
			setUnlocked(true);
			setDragX(max);
			currentX.current = max;
			setTimeout(onUnlock, 80);
		} else {
			// Spring back to the right
			currentX.current = 0;
			setDragX(0);
		}
	};

	const triggerUnlock = () => {
		if (unlocked || isDragging) return;
		const max = getMaxDrag();
		setUnlocked(true);
		setDragX(max);
		setTimeout(onUnlock, 120);
	};

	const max = trackRef.current ? Math.max(60, trackRef.current.clientWidth - 64) : 220;
	const progress = max > 0 ? Math.min(1, dragX / max) : 0;
	const textOpacity = Math.max(0, 1 - progress * 1.5);

	return (
		<div
			ref={trackRef}
			className={`slide-unlock-track ${unlocked ? 'is-unlocked' : ''}`}
			role="button"
			tabIndex={0}
			aria-label={`Slide right to left to unlock: ${text}`}
			onClick={triggerUnlock}
			onKeyDown={(e) => {
				if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowLeft') {
					e.preventDefault();
					triggerUnlock();
				}
			}}
		>
			<span className="slide-unlock-text" style={{ opacity: textOpacity }}>
				{text}
			</span>

			<div
				className={`slide-unlock-thumb ${isDragging ? 'is-dragging' : ''} ${unlocked ? 'is-unlocked' : ''}`}
				style={{
					transform: `translateX(-${dragX}px)`,
					transition: isDragging ? 'none' : 'transform 0.35s cubic-bezier(0.2, 0.9, 0.3, 1)',
				}}
				onPointerDown={handlePointerDown}
				onPointerMove={handlePointerMove}
				onPointerUp={handlePointerEnd}
				onPointerCancel={handlePointerEnd}
			>
				<ChevronLeft size={24} className="slide-unlock-icon" />
			</div>
		</div>
	);
}
