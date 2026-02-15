'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import Lottie to avoid SSR issues
const Lottie = dynamic(() => import('lottie-react'), { ssr: false });

export default function DashboardAnimation() {
    const [animationData, setAnimationData] = useState(null);

    useEffect(() => {
        fetch('/animations/dashboard.json')
            .then((res) => res.json())
            .then((data) => setAnimationData(data))
            .catch((err) => console.error('Failed to load animation:', err));
    }, []);

    if (!animationData) return <div className="w-full h-full bg-nexus-glass animate-pulse rounded-2xl" />;

    return (
        <div className="w-full h-full flex items-center justify-center">
            <Lottie animationData={animationData} loop={true} className="w-full h-full" />
        </div>
    );
}
