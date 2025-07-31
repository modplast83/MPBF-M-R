import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AnimatedBackgroundProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'gradient' | 'particles' | 'waves' | 'geometric';
}

export const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({
  children,
  className,
  variant = 'gradient'
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.4, 0.8, 0.4]);

  const getBackgroundVariant = () => {
    switch (variant) {
      case 'gradient':
        return (
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-indigo-50/20 to-purple-50/30"
            style={{ y: backgroundY, opacity }}
          />
        );
      case 'particles':
        return (
          <motion.div
            className="absolute inset-0"
            style={{ y: backgroundY, opacity }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/20 to-indigo-50/20" />
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-blue-200/40 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, -20, 0],
                  opacity: [0.2, 0.8, 0.2],
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </motion.div>
        );
      case 'waves':
        return (
          <motion.div
            className="absolute inset-0 overflow-hidden"
            style={{ y: backgroundY, opacity }}
          >
            <svg
              className="absolute inset-0 w-full h-full"
              viewBox="0 0 1200 800"
              preserveAspectRatio="xMidYMid slice"
            >
              <defs>
                <linearGradient id="wave-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="rgba(59, 130, 246, 0.1)" />
                  <stop offset="50%" stopColor="rgba(99, 102, 241, 0.15)" />
                  <stop offset="100%" stopColor="rgba(139, 92, 246, 0.1)" />
                </linearGradient>
              </defs>
              <motion.path
                d="M0,300 Q300,200 600,300 T1200,300 L1200,800 L0,800 Z"
                fill="url(#wave-gradient)"
                animate={{
                  d: [
                    "M0,300 Q300,200 600,300 T1200,300 L1200,800 L0,800 Z",
                    "M0,250 Q300,150 600,250 T1200,250 L1200,800 L0,800 Z",
                    "M0,300 Q300,200 600,300 T1200,300 L1200,800 L0,800 Z"
                  ]
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </svg>
          </motion.div>
        );
      case 'geometric':
        return (
          <motion.div
            className="absolute inset-0 overflow-hidden"
            style={{ y: backgroundY, opacity }}
          >
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute border border-blue-200/20 rounded-lg"
                style={{
                  width: `${50 + Math.random() * 100}px`,
                  height: `${50 + Math.random() * 100}px`,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  rotate: [0, 360],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 10 + Math.random() * 5,
                  repeat: Infinity,
                  delay: Math.random() * 3,
                }}
              />
            ))}
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <div ref={ref} className={cn("relative", className)}>
      {getBackgroundVariant()}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default AnimatedBackground;