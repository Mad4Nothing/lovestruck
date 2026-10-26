import { useState, useRef, useCallback } from 'react';
import { ChevronRight } from 'lucide-react';

interface SlideToUnlockProps {
	onUnlock: () => void;
	text?: string;
}

export function SlideToUnlock({ onUnlock, text = 'love at first swipe' }: SlideToUnlockProps) {
	const [dragX, setDragX] = useState(0);
	const [isDragging, setIsDragging] = useState(false);
	const [unlocked, setUnlocked] = useState(false);
	const trackRef = useRef<HTMLDivElement | null>(null);
	const startX = useRef(0);
	const currentX = useRef(0);

	const getMaxDrag = useCallback(() => {
		if (!trackRef.current) return 220;
		// 48px thumb + 4px left + 4px right = 56px
		return Math.max(60, trackRef.current.clientWidth - 56);
	}, []);

	const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
		if (unlocked) return;
		setIsDragging(true);
		startX.current = e.clientX - currentX.current;
		e.currentTarget.setPointerCapture(e.pointerId);
	};

	const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
		if (!isDragging || unlocked) return;
		const max = getMaxDrag();
		const nextX = Math.min(Math.max(0, e.clientX - startX.current), max);
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
			// ignore pointer capture release errors
		}

		const max = getMaxDrag();
		// If dragged past 65% of track, complete unlock!
		if (currentX.current >= max * 0.65) {
			setUnlocked(true);
			setDragX(max);
			currentX.current = max;
			onUnlock();
		} else {
			// Spring back
			currentX.current = 0;
			setDragX(0);
		}
	};

	const max = trackRef.current ? Math.max(60, trackRef.current.clientWidth - 56) : 220;
	const progress = max > 0 ? Math.min(1, dragX / max) : 0;
	const textOpacity = Math.max(0, 1 - progress * 1.5);

	return (
		<div
			ref={trackRef}
			className="slide-unlock-track"
			role="button"
			tabIndex={0}
			aria-label={`Slide to unlock: ${text}`}
			onClick={() => {
				// Also allow simple click to unlock for accessibility
				if (!unlocked && !isDragging && dragX === 0) {
					// only if not dragging
				}
			}}
			onKeyDown={(e) => {
				if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowRight') {
					e.preventDefault();
					setUnlocked(true);
					onUnlock();
				}
			}}
		>
			<span className="slide-unlock-text" style={{ opacity: textOpacity }}>
				{text}
			</span>

			<div
				className={`slide-unlock-thumb ${isDragging ? 'is-dragging' : ''}`}
				style={{
					transform: `translateX(${dragX}px)`,
					transition: isDragging ? 'none' : 'transform 0.3s cubic-bezier(0.2, 0.9, 0.3, 1)',
				}}
				onPointerDown={handlePointerDown}
				onPointerMove={handlePointerMove}
				onPointerUp={handlePointerEnd}
				onPointerCancel={handlePointerEnd}
			>
				<ChevronRight size={22} className="slide-unlock-icon" />
			</div>
		</div>
	);
}
