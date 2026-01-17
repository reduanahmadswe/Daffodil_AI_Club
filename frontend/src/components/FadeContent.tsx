'use client';

import * as React from 'react';
import { useRef, useEffect, useState } from 'react';

interface FadeContentProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    blur?: boolean;
    duration?: number;
    ease?: string;
    delay?: number;
    threshold?: number;
    initialOpacity?: number;
    onComplete?: () => void;
}

const FadeContent: React.FC<FadeContentProps> = ({
    children,
    blur = false,
    duration = 1000,
    ease = 'ease-out',
    delay = 0,
    threshold = 0.1,
    initialOpacity = 0,
    onComplete,
    className = '',
    ...props
}) => {
    const ref = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setTimeout(() => {
                            setIsVisible(true);
                            if (onComplete) {
                                setTimeout(onComplete, duration);
                            }
                        }, delay);
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold,
            }
        );

        observer.observe(el);

        return () => {
            if (el) {
                observer.unobserve(el);
            }
        };
    }, [threshold, delay, duration, onComplete]);

    return (
        <div
            ref={ref}
            className={className}
            style={{
                opacity: isVisible ? 1 : initialOpacity,
                filter: isVisible ? 'blur(0px)' : blur ? 'blur(10px)' : 'blur(0px)',
                transition: `opacity ${duration}ms ${ease}, filter ${duration}ms ${ease}`,
                willChange: 'opacity, filter',
            }}
            {...props}
        >
            {children}
        </div>
    );
};

export default FadeContent;
