import { useState, useEffect } from 'react';

export const useVelocity = () => {
    const [velocity, setVelocity] = useState(0);
    const [intensity, setIntensity] = useState('calm'); // 'calm' | 'focused' | 'chaotic'

    useEffect(() => {
        let lastX = 0;
        let lastY = 0;
        let lastTime = Date.now();
        let speedHistory = [];

        const handleMouseMove = (e) => {
            const now = Date.now();
            const dt = now - lastTime;
            if (dt < 16) return; // Cap at ~60fps

            const dx = e.clientX - lastX;
            const dy = e.clientY - lastY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const speed = dist / dt; // pixels per ms

            // Moving average of last 10 frames
            speedHistory.push(speed);
            if (speedHistory.length > 10) speedHistory.shift();

            const avgSpeed = speedHistory.reduce((a, b) => a + b, 0) / speedHistory.length;

            setVelocity(avgSpeed);

            if (avgSpeed > 4) setIntensity('chaotic');
            else if (avgSpeed > 1.5) setIntensity('focused');
            else setIntensity('calm');

            lastX = e.clientX;
            lastY = e.clientY;
            lastTime = now;
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return { velocity, intensity };
};
