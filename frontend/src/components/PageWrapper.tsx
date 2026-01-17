'use client';

import React, { ReactNode } from 'react';

interface PageWrapperProps {
    children: ReactNode;
    orbColors?: {
        orb1?: 'purple' | 'pink' | 'cyan' | 'blue';
        orb2?: 'purple' | 'pink' | 'cyan' | 'blue';
    };
    gridOpacity?: number;
}

export default function PageWrapper({
    children,
    orbColors = { orb1: 'purple', orb2: 'pink' },
    gridOpacity = 20
}: PageWrapperProps) {
    return (
        <div className="min-h-screen bg-black relative overflow-hidden">
            {/* Background Orbs */}
            <div className="absolute inset-0 pointer-events-none">
                <div className={`orb orb-${orbColors.orb1} w-96 h-96 top-1/4 left-1/4`} />
                <div className={`orb orb-${orbColors.orb2} w-96 h-96 bottom-1/4 right-1/4`} />
            </div>

            {/* Grid Overlay */}
            <div className={`absolute inset-0 grid-overlay opacity-${gridOpacity} pointer-events-none`} />

            {/* Content */}
            <div className="relative z-10">
                {children}
            </div>
        </div>
    );
}
