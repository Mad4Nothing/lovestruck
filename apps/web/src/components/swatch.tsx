import { useState } from 'react';
import type { Shade, Tone } from '@/data/quiz';
import { LipArt } from '@/components/lip-art';

export function Swatch({ shade, tone }: { shade: Shade; tone?: Tone }) {
	const [hasError, setHasError] = useState(false);
	return (
		<div className="swatch" style={{ color: shade.placeholderHex }}>
			{!hasError ? (
				<img
					width={240}
					height={145}
					src={`/swatches/${shade.id}.jpg`}
					alt={`${shade.name} lipstick swatch`}
					onError={() => setHasError(true)}
					className="swatch-img"
					loading="eager"
				/>
			) : (
				<LipArt color={shade.placeholderHex} />
			)}
		</div>
	);
}
