import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Check, Heart, X } from 'lucide-react';
import { questions } from '@/data/quiz';
import type { Answers } from '@/lib/scoring';

const PALETTE_IMAGES: Record<string, string> = {
  nude: '/palettes/browns-and-nudes.png',
  red: '/palettes/reds.png',
  pink: '/palettes/pinks.png',
};

interface FloatingHeart {
  id: number;
  x: number;
  size: number;
  rot: number;
  delay: number;
  duration: number;
  color: string;
}

type SwipePhase = 'idle' | 'swiping-left-out' | 'swiping-left-behind' | 'swiping-right-out';

export function QuestionScreen({
  step,
  answers,
  onAnswer,
  onBack,
}: {
  step: number;
  answers: Answers;
  onAnswer: (id: string) => void;
  onBack: () => void;
}) {
  const question = questions[step];
  const heading = useRef<HTMLHeadingElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [pending, setPending] = useState<string | null>(null);

  // Deck state for Question 3
  const [deck, setDeck] = useState(() => Math.max(0, question.options.findIndex((o) => o.id === answers.q3)));
  const [drag, setDrag] = useState(0);
  const [swipePhase, setSwipePhase] = useState<SwipePhase>('idle');
  const [floatingHearts, setFloatingHearts] = useState<FloatingHeart[]>([]);
  const pointer = useRef<number | null>(null);

  useEffect(() => {
    heading.current?.focus();
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  const select = (id: string) => {
    if (pending) return;
    setPending(id);
    timer.current = setTimeout(
      () => onAnswer(id),
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 350
    );
  };

  const spawnFloatingHearts = () => {
    const hearts: FloatingHeart[] = [
      { id: Date.now() + 1, x: 0, size: 24, rot: -10, delay: 0, duration: 1.0, color: '#fc2779' },
      { id: Date.now() + 2, x: -28, size: 18, rot: 15, delay: 50, duration: 0.95, color: '#922441' },
      { id: Date.now() + 3, x: 26, size: 20, rot: -20, delay: 90, duration: 1.1, color: '#ff4081' },
      { id: Date.now() + 4, x: -12, size: 26, rot: 8, delay: 130, duration: 1.15, color: '#fc2779' },
      { id: Date.now() + 5, x: 38, size: 16, rot: 25, delay: 180, duration: 0.85, color: '#e91e63' },
      { id: Date.now() + 6, x: -38, size: 15, rot: -18, delay: 220, duration: 0.95, color: '#ff6584' },
      { id: Date.now() + 7, x: 14, size: 22, rot: -5, delay: 260, duration: 1.05, color: '#922441' },
    ];
    setFloatingHearts(hearts);
  };

  const handlePass = () => {
    if (swipePhase !== 'idle' || pending) return;
    // Phase 1: Top card slides left, revealing beneath card in place
    setSwipePhase('swiping-left-out');

    setTimeout(() => {
      // Phase 2: Card drops behind stack and softly glides into back position
      setSwipePhase('swiping-left-behind');

      setTimeout(() => {
        // Phase 3: Commit deck change so beneath card is officially front
        setDeck((prev) => (prev + 1) % question.options.length);
        setDrag(0);
        setSwipePhase('idle');
      }, 240);
    }, 260);
  };

  const handleLove = (cardId: string) => {
    if (swipePhase !== 'idle' || pending) return;
    setSwipePhase('swiping-right-out');
    spawnFloatingHearts();
    setTimeout(() => {
      select(cardId);
    }, 420);
  };

  return (
    <section className="question-screen">
      <div className="question-nav">
        <button className="back" onClick={onBack}>
          <ArrowLeft size={17} /> Back
        </button>
        <span>{step + 1} of 4</span>
      </div>

      <div className="progress-hearts" aria-label={`Question ${step + 1} of 4`}>
        {[0, 1, 2, 3].map((i) => (
          <Heart
            key={i}
            size={20}
            fill={i <= step ? 'currentColor' : 'none'}
            className={i <= step ? 'filled' : ''}
          />
        ))}
      </div>

      <p className="eyebrow">{['THE PERSONALITY', 'THE CANVAS', 'THE PALETTE', 'THE LOVE STORY'][step]}</p>
      <h2 ref={heading} tabIndex={-1}>
        {question.title}
      </h2>
      <p className="helper">{question.helper}</p>

      {step === 2 ? (
        (() => {
          const card1 = question.options[deck];
          const nextIndex = (deck + 1) % question.options.length;
          const card2 = question.options[nextIndex];
          const thirdIndex = (deck + 2) % question.options.length;
          const card3 = question.options[thirdIndex];

          return (
            <div
              className="deck-region"
              onKeyDown={(e) => {
                if (e.key === 'ArrowRight') {
                  e.preventDefault();
                  handleLove(card1.id);
                }
                if (e.key === 'ArrowLeft') {
                  e.preventDefault();
                  handlePass();
                }
              }}
              tabIndex={0}
              aria-label="Palette cards. Right arrow to love it, left arrow to pass."
            >
              {/* Love it and Pass buttons positioned ABOVE the cards stack */}
              <div className="deck-actions deck-actions-above">
                <button
                  className="secondary"
                  onClick={handlePass}
                  disabled={swipePhase !== 'idle' || !!pending}
                  aria-label="Pass to next palette"
                >
                  <X size={18} /> Pass
                </button>
                <button
                  className="primary relative overflow-visible"
                  role="radio"
                  aria-checked={pending === card1.id || answers.q3 === card1.id}
                  disabled={swipePhase !== 'idle' || !!pending}
                  onClick={() => handleLove(card1.id)}
                  aria-label="Love this palette"
                >
                  <Heart size={18} /> Love it
                  {floatingHearts.length > 0 && (
                    <div className="love-floating-hearts" aria-hidden="true">
                      {floatingHearts.map((h) => (
                        <span
                          key={h.id}
                          className="floating-heart"
                          style={
                            {
                              left: `calc(50% + ${h.x}px)`,
                              color: h.color,
                              animationDuration: `${h.duration}s`,
                              animationDelay: `${h.delay}ms`,
                              '--target-rot': `${h.rot}deg`,
                            } as React.CSSProperties
                          }
                        >
                          <Heart size={h.size} fill="currentColor" />
                        </span>
                      ))}
                    </div>
                  )}
                </button>
              </div>

              {/* Cards stack */}
              <div className="deck-stack">
                {/* Card 3: Back of stack */}
                <div
                  key={card3.id}
                  className={`palette-card deck-back second palette-${card3.palette}`}
                  aria-hidden="true"
                  style={{
                    zIndex: swipePhase === 'swiping-left-behind' ? 5 : 2,
                    transform:
                      swipePhase === 'swiping-left-out' || swipePhase === 'swiping-left-behind'
                        ? 'translateX(0px) rotate(4deg) scale(0.97)'
                        : 'translateX(0px) rotate(-4deg) scale(0.94)',
                    opacity:
                      swipePhase === 'swiping-left-out' || swipePhase === 'swiping-left-behind'
                        ? 1
                        : 0.85,
                    transition:
                      swipePhase === 'swiping-left-out'
                        ? 'transform 0.26s cubic-bezier(0.2, 0.8, 0.25, 1), opacity 0.26s ease'
                        : 'transform 0.25s ease-out',
                    pointerEvents: 'none',
                  }}
                >
                  <span className="eyebrow">
                    {thirdIndex + 1} / {question.options.length} · YOUR COLOUR STORY
                  </span>
                  <div className="palette-heart-art">
                    <img
                      src={PALETTE_IMAGES[card3.palette || 'nude']}
                      alt={`${card3.label} heart swatch`}
                      className="palette-heart-img"
                      loading="eager"
                    />
                  </div>
                  <h3>{card3.label}</h3>
                  <p className="card-shades-preview">{card3.description}</p>
                  <p className="palette-card-hint">
                    Swipe right to love it <ArrowRight size={16} />
                  </p>
                </div>

                {/* Card 2: Beneath card (stationary, revealed in place) */}
                <div
                  key={card2.id}
                  className={`palette-card deck-back first palette-${card2.palette}`}
                  aria-hidden="true"
                  style={{
                    zIndex: swipePhase === 'swiping-left-behind' ? 10 : 5,
                    transform:
                      swipePhase === 'swiping-left-out' ||
                      swipePhase === 'swiping-left-behind' ||
                      swipePhase === 'swiping-right-out'
                        ? 'translateX(0px) rotate(0deg) scale(1)'
                        : 'translateX(0px) rotate(4deg) scale(0.97)',
                    transition:
                      swipePhase === 'swiping-left-out' || swipePhase === 'swiping-right-out'
                        ? 'transform 0.26s cubic-bezier(0.2, 0.8, 0.25, 1)'
                        : 'transform 0.25s ease-out',
                    pointerEvents: 'none',
                  }}
                >
                  <span className="eyebrow">
                    {nextIndex + 1} / {question.options.length} · YOUR COLOUR STORY
                  </span>
                  <div className="palette-heart-art">
                    <img
                      src={PALETTE_IMAGES[card2.palette || 'nude']}
                      alt={`${card2.label} heart swatch`}
                      className="palette-heart-img"
                      loading="eager"
                    />
                  </div>
                  <h3>{card2.label}</h3>
                  <p className="card-shades-preview">{card2.description}</p>
                  <p className="palette-card-hint">
                    Swipe right to love it <ArrowRight size={16} />
                  </p>
                </div>

                {/* Card 1: Front card */}
                <div
                  key={card1.id}
                  className={`palette-card palette-${card1.palette}`}
                  role="radiogroup"
                  aria-label="Favourite palette"
                  style={{
                    zIndex: swipePhase === 'swiping-left-behind' ? 0 : 10,
                    transform:
                      swipePhase === 'swiping-left-out'
                        ? 'translateX(-115%) rotate(-18deg)'
                        : swipePhase === 'swiping-left-behind'
                        ? 'translateX(0px) rotate(-4deg) scale(0.94)'
                        : swipePhase === 'swiping-right-out'
                        ? 'translateX(120%) rotate(20deg)'
                        : drag !== 0
                        ? `translateX(${drag}px) rotate(${drag / 18}deg)`
                        : 'translateX(0px) rotate(0deg) scale(1)',
                    opacity:
                      swipePhase === 'swiping-right-out'
                        ? 0
                        : swipePhase === 'swiping-left-behind'
                        ? 0.85
                        : 1,
                    transition:
                      pointer.current !== null
                        ? 'none'
                        : swipePhase === 'swiping-left-out'
                        ? 'transform 0.26s cubic-bezier(0.2, 0.8, 0.25, 1)'
                        : swipePhase === 'swiping-left-behind'
                        ? 'transform 0.24s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.24s ease'
                        : swipePhase === 'swiping-right-out'
                        ? 'transform 0.35s cubic-bezier(0.2, 0.8, 0.25, 1), opacity 0.3s ease-out'
                        : 'transform 0.25s cubic-bezier(0.2, 0.9, 0.3, 1)',
                    pointerEvents: swipePhase === 'idle' ? 'auto' : 'none',
                  }}
                  onPointerDown={(e) => {
                    if (swipePhase !== 'idle') return;
                    pointer.current = e.clientX;
                    e.currentTarget.setPointerCapture(e.pointerId);
                  }}
                  onPointerMove={(e) => {
                    if (pointer.current !== null && swipePhase === 'idle') {
                      setDrag(e.clientX - pointer.current);
                    }
                  }}
                  onPointerUp={() => {
                    if (swipePhase !== 'idle') return;
                    pointer.current = null;
                    if (drag > 70) {
                      handleLove(card1.id);
                    } else if (drag < -70) {
                      handlePass();
                    } else {
                      setDrag(0);
                    }
                  }}
                  onPointerCancel={() => {
                    if (swipePhase !== 'idle') return;
                    pointer.current = null;
                    setDrag(0);
                  }}
                >
                  <span className="eyebrow">
                    {deck + 1} / {question.options.length} · YOUR COLOUR STORY
                  </span>
                  <div className="palette-heart-art">
                    <img
                      src={PALETTE_IMAGES[card1.palette || 'nude']}
                      alt={`${card1.label} heart swatch`}
                      className="palette-heart-img"
                      loading="eager"
                    />
                  </div>
                  <h3>{card1.label}</h3>
                  <p className="card-shades-preview">{card1.description}</p>
                  <p className="palette-card-hint">
                    Swipe right to love it <ArrowRight size={16} />
                  </p>
                </div>
              </div>

              <p className="micro">Swipe right to love it · Swipe left to pass</p>
            </div>
          );
        })()
      ) : (
        <div className="options" role="radiogroup" aria-label={question.title}>
          {question.options.map((option, index) => {
            const selected = (pending || answers[question.id as keyof Answers]) === option.id;
            return (
              <button
                key={option.id}
                role="radio"
                aria-checked={selected}
                disabled={!!pending}
                className={`option ${selected ? 'selected' : ''}`}
                style={{ animationDelay: `${index * 75}ms` }}
                onClick={() => select(option.id)}
                onKeyDown={(e) => {
                  if (['ArrowDown', 'ArrowRight', 'ArrowUp', 'ArrowLeft'].includes(e.key)) {
                    e.preventDefault();
                    const direction = ['ArrowDown', 'ArrowRight'].includes(e.key) ? 1 : -1;
                    const group = e.currentTarget.parentElement;
                    (
                      group?.children[
                        (index + direction + question.options.length) % question.options.length
                      ] as HTMLButtonElement
                    )?.focus();
                  }
                }}
              >
                <span className={`option-marker tone-${option.tone || 'none'}`}>
                  {selected ? <Check size={18} /> : step === 1 ? '' : String.fromCharCode(65 + index)}
                </span>
                <span>
                  <strong>{option.label}</strong>
                  {option.description && <small>{option.description}</small>}
                </span>
                <span className="option-radio">{selected && <span />}</span>
              </button>
            );
          })}
        </div>
      )}
      <p className="question-foot">
        <Heart size={12} /> There are no wrong answers. Just your kind of love.
      </p>
    </section>
  );
}
