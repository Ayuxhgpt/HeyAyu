import React, { createContext, useContext, useMemo } from 'react';
import { MotionConfig } from 'framer-motion';
import { useVelocity } from '../hooks/useVelocity';

const AdaptiveMotionContext = createContext();

export const AdaptiveMotionProvider = ({ children }) => {
    const { velocity, intensity } = useVelocity();

    // Tuning Physics based on Intensity
    const transition = useMemo(() => {
        if (intensity === 'chaotic') {
            return { type: 'spring', stiffness: 500, damping: 20 }; // Snappy, almost vibrating
        } else if (intensity === 'focused') {
            return { type: 'spring', stiffness: 300, damping: 25 }; // Standard UI feel
        }
        return { type: 'spring', stiffness: 120, damping: 20 }; // Soft, cinematic float
    }, [intensity]);

    return (
        <AdaptiveMotionContext.Provider value={{ velocity, intensity }}>
            <MotionConfig transition={transition}>
                {children}
            </MotionConfig>
        </AdaptiveMotionContext.Provider>
    );
};

export const useAdaptiveMotion = () => useContext(AdaptiveMotionContext);
