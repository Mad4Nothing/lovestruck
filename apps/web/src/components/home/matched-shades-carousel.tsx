import { useState, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Shade } from '@/data/quiz';

interface MatchedShadesCarouselProps {
	shades: Shade[];
	offline?: boolean;
}

export function MatchedShadesCarousel({ shades, offline = false }: MatchedShadesCarouselProps) {
	const [currentIndex, setCurrentIndex] = useState(0);
	const [dragX, setDragX] = useState(0);
	const [isDragging, setIsDragging] = useState(false);

	const stageRef = useRef<HTMLDivElement | null>(null);
	const touchStartPos = useRef<{ x: number; y: number } | null>(null);
	const isSwipingHorizontal = useRef<boolean | null>(null);
	const dragStartTime = useRef<number>(0);
	const currentDragX = useRef<number>(0);

	const N = shades.length;
	const activeIndex = ((currentIndex % N) + N) % N;

	// 270px card width with exactly 10px visual space between carousel cards
	const cardWidth = 270;
	const slideDist = 261;

	const goToNext = useCallback(() => {
		setCurrentIndex(c => c + 1);
	}, []);

	const goToPrev = useCallback(() => {
		setCurrentIndex(c => c - 1);
	}, []);

	const goToIndex = (targetIndex: number) => {
		let diff = targetIndex - activeIndex;
		if (diff > N / 2) diff -= N;
		if (diff < -N / 2) diff += N;
		setCurrentIndex(c => c + diff);
	};

	const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
		touchStartPos.current = { x: e.clientX, y: e.clientY };
		isSwipingHorizontal.current = null;
		setIsDragging(true);
		dragStartTime.current = Date.now();
		currentDragX.current = 0;
		try {
			e.currentTarget.setPointerCapture(e.pointerId);
		} catch { }
	};

	const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
		if (!touchStartPos.current) return;
		const dx = e.clientX - touchStartPos.current.x;
		const dy = e.clientY - touchStartPos.current.y;

		if (isSwipingHorizontal.current === null) {
			if (Math.abs(dx) > 7 || Math.abs(dy) > 7) {
				if (Math.abs(dx) > Math.abs(dy)) {
					isSwipingHorizontal.current = true;
				} else {
					isSwipingHorizontal.current = false;
					setIsDragging(false);
					return;
				}
			} else {
				return;
			}
		}

		if (isSwipingHorizontal.current) {
			currentDragX.current = dx;
			setDragX(dx);
		}
	};

	const handlePointerEnd = (e: React.PointerEvent<HTMLDivElement>) => {
		if (!touchStartPos.current) return;
		try {
			if (e.currentTarget.hasPointerCapture(e.pointerId)) {
				e.currentTarget.releasePointerCapture(e.pointerId);
			}
		} catch { }

		if (isSwipingHorizontal.current) {
			const elapsed = Date.now() - dragStartTime.current;
			const velocity = currentDragX.current / Math.max(1, elapsed);
			if (currentDragX.current < -45 || velocity < -0.35) {
				setCurrentIndex(c => c + 1);
			} else if (currentDragX.current > 45 || velocity > 0.35) {
				setCurrentIndex(c => c - 1);
			}
		}

		touchStartPos.current = null;
		isSwipingHorizontal.current = null;
		setIsDragging(false);
		currentDragX.current = 0;
		setDragX(0);
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === 'ArrowLeft') {
			e.preventDefault();
			goToPrev();
		} else if (e.key === 'ArrowRight') {
			e.preventDefault();
			goToNext();
		}
	};

	// 5 virtual slots around currentIndex: -2, -1, 0, 1, 2
	const slots = [-2, -1, 0, 1, 2];

	return (
		<div className="matched-carousel-section" role="region" aria-label="Your Lip Soulmate Carousel">
			<p className="matched-carousel-eyebrow">YOUR LIP SOULMATE</p>

			<div
				ref={stageRef}
				className={`matched-carousel-stage ${isDragging ? 'is-dragging' : ''}`}
				tabIndex={0}
				onKeyDown={handleKeyDown}
				onPointerDown={handlePointerDown}
				onPointerMove={handlePointerMove}
				onPointerUp={handlePointerEnd}
				onPointerCancel={handlePointerEnd}
				aria-roledescription="carousel"
			>
				{slots.map(offset => {
					const virtualIndex = currentIndex + offset;
					const shadeIndex = ((virtualIndex % N) + N) % N;
					const shade = shades[shadeIndex];

					// Position & smooth transition math
					const distPx = offset * slideDist + dragX;
					const normOffset = distPx / slideDist;
					const absNorm = Math.abs(normOffset);

					// Dynamic scaling: center is 1.0, sides shrink to 0.86
					const scale = Math.max(0.8, 1 - absNorm * 0.14);

					// Dynamic blur: center is 0px, sides blur up to 5px
					const blur = Math.min(6, Math.max(0, absNorm * 5));

					// Dynamic opacity: center is 1.0, sides fade to 0.65
					const opacity = Math.max(0, Math.min(1, 1 - (absNorm > 1 ? 0.35 + (absNorm - 1) * 0.45 : absNorm * 0.35)));

					const zIndex = Math.max(1, Math.round((2 - Math.min(2, absNorm)) * 10));
					const isCenter = offset === 0 && Math.abs(dragX) < 30;

					return (
						<article
							key={virtualIndex}
							className={`matched-carousel-card ${isCenter ? 'is-center' : ''}`}
							style={{
								transform: `translate3d(${distPx}px, 0, 0) scale(${scale})`,
								filter: `blur(${blur}px)`,
								opacity: opacity,
								zIndex: zIndex,
								transition: isDragging
									? 'none'
									: 'transform 0.35s cubic-bezier(0.25, 1, 0.5, 1), filter 0.35s ease-out, opacity 0.35s ease-out',
							}}
							onClick={() => {
								if (Math.abs(currentDragX.current) > 5) return;
								if (offset === -1) goToPrev();
								else if (offset === 1) goToNext();
							}}
							aria-hidden={!isCenter}
						>
							<div className="matched-card-media">
								<img
									src={`/swatches/${shade.id}.jpg`}
									alt={`${shade.name} lipstick swatch`}
									className="matched-card-img"
									loading="eager"
									draggable={false}
								/>
							</div>

							<div className="matched-card-content">
								<h3 className="matched-card-title">{shade.name}</h3>
								<p className="matched-card-tagline">{shade.tagline}</p>
							</div>
						</article>
					);
				})}
			</div>

			<div className="matched-carousel-nav">
				<button
					type="button"
					className="carousel-arrow prev"
					onClick={goToPrev}
					aria-label="Previous shade"
					title="Previous shade"
				>
					<ChevronLeft size={18} />
				</button>

				<div className="matched-carousel-dots" aria-label="Shade navigation">
					{shades.map((shade, i) => (
						<button
							key={shade.id}
							type="button"
							className={`matched-carousel-dot ${i === activeIndex ? 'active' : ''}`}
							onClick={() => goToIndex(i)}
							aria-label={`Go to ${shade.name}`}
							title={shade.name}
						/>
					))}
				</div>

				<button
					type="button"
					className="carousel-arrow next"
					onClick={goToNext}
					aria-label="Next shade"
					title="Next shade"
				>
					<ChevronRight size={18} />
				</button>
			</div>

			{offline && <p className="stock-note">Shopping needs an internet connection.</p>}
		</div>
	);
}
