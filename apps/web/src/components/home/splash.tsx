import { config } from '@/lib/quiz-config';
import { SlideToUnlock } from '@/components/home/slide-to-unlock';

export function Splash({ onStart }: { onStart: () => void }) {
	const { splashVideo } = config;
	return (
		<section className="splash">
			<div className="splash-bg" aria-hidden="true">
				<img
					className="splash-poster"
					src="https://horizons-cdn.hostinger.com/cfdbec2d-ede6-4486-a46a-fbe536476726/gemini_generated_image_22e3vf22e3vf22e3-3sujA.png"
					alt=""
					loading="eager"
					decoding="async"
				/>
				<video
					className="splash-video"
					autoPlay
					muted
					loop
					playsInline
					preload="auto"
					poster={splashVideo.poster}
				>
					<source src={splashVideo.src} type="video/mp4" />
				</video>
				<span className="splash-overlay" />
			</div>

			<div className="splash-content">
				<div className="splash-logo-container">
					<img src="/nykaa-logo.png" alt="Nykaa Cosmetics" className="splash-logo" />
				</div>
				<h1 className="splash-title">Lovestruck</h1>
				<p className="splash-sub">Find your lip soulmate.</p>

				<div className="splash-foot">
					<SlideToUnlock onUnlock={onStart} text="love at first swipe" />
				</div>
			</div>
		</section>
	);
}
