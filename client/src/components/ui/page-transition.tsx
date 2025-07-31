import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { cn } from '@/lib/utils';

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'fade' | 'slide' | 'scale' | 'parallax';
  duration?: number;
  delay?: number;
}

export const PageTransition: React.FC<PageTransitionProps> = ({
  children,
  className,
  variant = 'fade',
  duration = 0.4,
  delay = 0
}) => {
  const variants = {
    fade: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 }
    },
    slide: {
      initial: { opacity: 0, x: 20 },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: -20 }
    },
    scale: {
      initial: { opacity: 0, scale: 0.95 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 1.05 }
    },
    parallax: {
      initial: { opacity: 0, y: 30, scale: 0.98 },
      animate: { opacity: 1, y: 0, scale: 1 },
      exit: { opacity: 0, y: -30, scale: 1.02 }
    }
  };

  return (
    <motion.div
      className={cn("w-full", className)}
      variants={variants[variant]}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1]
      }}
    >
      {children}
    </motion.div>
  );
};

interface ParallaxContainerProps {
  children: React.ReactNode;
  className?: string;
  speed?: number;
  offset?: number;
}

export const ParallaxContainer: React.FC<ParallaxContainerProps> = ({
  children,
  className,
  speed = 0.5,
  offset = 0
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [offset, offset + speed * 100]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.6, 1, 1, 0.6]);

  return (
    <motion.div
      ref={ref}
      className={cn("relative", className)}
      style={{ y, opacity }}
    >
      {children}
    </motion.div>
  );
};

interface SmoothScrollProps {
  children: React.ReactNode;
  className?: string;
}

export const SmoothScroll: React.FC<SmoothScrollProps> = ({
  children,
  className
}) => {
  const { scrollYProgress } = useScroll();
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <div className={cn("relative", className)}>
      {/* Progress bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-600 origin-left z-50"
        style={{ scaleX }}
      />
      {children}
    </div>
  );
};

interface FloatingElementProps {
  children: React.ReactNode;
  className?: string;
  intensity?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
}

export const FloatingElement: React.FC<FloatingElementProps> = ({
  children,
  className,
  intensity = 10,
  direction = 'up'
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const getTransform = () => {
    switch (direction) {
      case 'up':
        return useTransform(scrollYProgress, [0, 1], [intensity, -intensity]);
      case 'down':
        return useTransform(scrollYProgress, [0, 1], [-intensity, intensity]);
      case 'left':
        return useTransform(scrollYProgress, [0, 1], [intensity, -intensity]);
      case 'right':
        return useTransform(scrollYProgress, [0, 1], [-intensity, intensity]);
      default:
        return useTransform(scrollYProgress, [0, 1], [intensity, -intensity]);
    }
  };

  const transform = getTransform();

  return (
    <motion.div
      ref={ref}
      className={cn("relative", className)}
      style={{
        [direction === 'left' || direction === 'right' ? 'x' : 'y']: transform
      }}
    >
      {children}
    </motion.div>
  );
};

interface StaggeredAnimationProps {
  children: React.ReactNode[];
  className?: string;
  staggerDelay?: number;
}

export const StaggeredAnimation: React.FC<StaggeredAnimationProps> = ({
  children,
  className,
  staggerDelay = 0.1
}) => {
  return (
    <div className={cn("space-y-4", className)}>
      {children.map((child, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            delay: index * staggerDelay,
            ease: [0.22, 1, 0.36, 1]
          }}
        >
          {child}
        </motion.div>
      ))}
    </div>
  );
};

export default PageTransition;