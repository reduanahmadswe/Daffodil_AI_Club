'use client';

import React, { useEffect, useRef, useState } from 'react';

interface SplitTextProps {
    text: string;
    className?: string;
    delay?: number;
    duration?: number;
    ease?: string;
    splitType?: 'chars' | 'words';
    from?: { opacity?: number; y?: number; x?: number };
    to?: { opacity?: number; y?: number; x?: number };
    threshold?: number;
    rootMargin?: string;
    textAlign?: 'left' | 'center' | 'right';
    onLetterAnimationComplete?: () => void;
    gradient?: boolean;
}

export default function SplitText({
    text,
    className = '',
    delay = 50,
    duration = 0.6,
    ease = 'cubic-bezier(0.22, 1, 0.36, 1)',
    splitType = 'chars',
    from = { opacity: 0, y: 40 },
    to = { opacity: 1, y: 0 },
    threshold = 0.1,
    rootMargin = '-100px',
    textAlign = 'center',
    onLetterAnimationComplete,
    gradient = false,
}: SplitTextProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsVisible(true);
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold,
                rootMargin,
            }
        );

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => {
            if (containerRef.current) {
                observer.unobserve(containerRef.current);
            }
        };
    }, [threshold, rootMargin]);

    useEffect(() => {
        if (isVisible && onLetterAnimationComplete) {
            const totalDelay = delay * (splitType === 'chars' ? text.length : text.split(' ').length);
            const totalDuration = duration * 1000;
            const timeout = setTimeout(() => {
                onLetterAnimationComplete();
            }, totalDelay + totalDuration);

            return () => clearTimeout(timeout);
        }
    }, [isVisible, delay, duration, text, splitType, onLetterAnimationComplete]);

    const splitText = () => {
        if (splitType === 'words') {
            return text.split(' ').map((word, wordIndex) => (
                <span
                    key={wordIndex}
                    style={{
                        display: 'inline-block',
                        marginRight: '0.25em',
                        opacity: isVisible ? to.opacity ?? 1 : from.opacity ?? 0,
                        transform: isVisible
                            ? `translate(${to.x ?? 0}px, ${to.y ?? 0}px)`
                            : `translate(${from.x ?? 0}px, ${from.y ?? 0}px)`,
                        transition: `all ${duration}s ${ease} ${wordIndex * delay}ms`,
                        color: 'var(--nexus-text-secondary)',
                    }}
                >
                    {word}
                </span>
            ));
        }

        return text.split('').map((char, charIndex) => {
            const isSpace = char === ' ';
            const baseStyle: React.CSSProperties = {
                display: 'inline-block',
                opacity: isVisible ? to.opacity ?? 1 : from.opacity ?? 0,
                transform: isVisible
                    ? `translate(${to.x ?? 0}px, ${to.y ?? 0}px)`
                    : `translate(${from.x ?? 0}px, ${from.y ?? 0}px)`,
                transition: `all ${duration}s ${ease} ${charIndex * delay}ms`,
                whiteSpace: isSpace ? 'pre' : 'normal',
                fontWeight: 800,
            };

            if (gradient) {
                baseStyle.background = 'linear-gradient(135deg, var(--nexus-purple) 0%, var(--nexus-pink) 100%)';
                baseStyle.WebkitBackgroundClip = 'text';
                baseStyle.WebkitTextFillColor = 'transparent';
                baseStyle.backgroundClip = 'text';
                // Use visibility instead of opacity for gradient chars so background-clip works
                baseStyle.opacity = 1;
                baseStyle.visibility = isVisible ? 'visible' : 'hidden';
            } else {
                baseStyle.color = 'var(--nexus-text)';
            }

            return (
                <span key={charIndex} style={baseStyle}>
                    {isSpace ? '\u00A0' : char}
                </span>
            );
        });
    };

    const containerStyle: React.CSSProperties = {
        textAlign,
        display: 'inline-block',
        width: '100%',
    };

    return (
        <div
            ref={containerRef}
            className={className}
            style={containerStyle}
        >
            {splitText()}
        </div>
    );
}
