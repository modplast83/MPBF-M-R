import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { cn } from '@/lib/utils';

interface FadeInViewProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
}

export const FadeInView: React.FC<FadeInViewProps> = ({
  children,
  className,
  delay = 0,
  duration = 0.5,
  direction = 'up'
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-10% 0px' });

  const getInitialPosition = () => {
    switch (direction) {
      case 'up':
        return { y: 30, x: 0 };
      case 'down':
        return { y: -30, x: 0 };
      case 'left':
        return { y: 0, x: 30 };
      case 'right':
        return { y: 0, x: -30 };
      default:
        return { y: 30, x: 0 };
    }
  };

  const initial = getInitialPosition();

  return (
    <motion.div
      ref={ref}
      className={cn("", className)}
      initial={{ opacity: 0, ...initial }}
      animate={inView ? { opacity: 1, y: 0, x: 0 } : { opacity: 0, ...initial }}
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

interface ParallaxScrollProps {
  children: React.ReactNode;
  className?: string;
  speed?: number;
  direction?: 'up' | 'down';
}

export const ParallaxScroll: React.FC<ParallaxScrollProps> = ({
  children,
  className,
  speed = 0.5,
  direction = 'up'
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y = useTransform(
    scrollYProgress,
    [0, 1],
    direction === 'up' ? [0, speed * -100] : [0, speed * 100]
  );

  return (
    <motion.div
      ref={ref}
      className={cn("", className)}
      style={{ y }}
    >
      {children}
    </motion.div>
  );
};

interface HoverCardProps {
  children: React.ReactNode;
  className?: string;
  hoverScale?: number;
  hoverRotate?: number;
}

export const HoverCard: React.FC<HoverCardProps> = ({
  children,
  className,
  hoverScale = 1.02,
  hoverRotate = 0
}) => {
  return (
    <motion.div
      className={cn("cursor-pointer", className)}
      whileHover={{
        scale: hoverScale,
        rotate: hoverRotate,
        transition: { duration: 0.2, ease: "easeOut" }
      }}
      whileTap={{ scale: 0.98 }}
    >
      {children}
    </motion.div>
  );
};

interface ProgressiveRevealProps {
  children: React.ReactNode[];
  className?: string;
  staggerDelay?: number;
  direction?: 'horizontal' | 'vertical';
}

export const ProgressiveReveal: React.FC<ProgressiveRevealProps> = ({
  children,
  className,
  staggerDelay = 0.1,
  direction = 'vertical'
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-10% 0px' });

  return (
    <div ref={ref} className={cn("", className)}>
      {children.map((child, index) => (
        <motion.div
          key={index}
          initial={{ 
            opacity: 0,
            y: direction === 'vertical' ? 20 : 0,
            x: direction === 'horizontal' ? 20 : 0
          }}
          animate={inView ? { 
            opacity: 1, 
            y: 0, 
            x: 0 
          } : { 
            opacity: 0,
            y: direction === 'vertical' ? 20 : 0,
            x: direction === 'horizontal' ? 20 : 0
          }}
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

interface ScaleOnScrollProps {
  children: React.ReactNode;
  className?: string;
  scaleFactor?: number;
}

export const ScaleOnScroll: React.FC<ScaleOnScrollProps> = ({
  children,
  className,
  scaleFactor = 0.1
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1 - scaleFactor, 1, 1 - scaleFactor]);
  const opacity = useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [0.5, 1, 1, 0.5]);

  return (
    <motion.div
      ref={ref}
      className={cn("", className)}
      style={{ scale, opacity }}
    >
      {children}
    </motion.div>
  );
};

interface RotateOnScrollProps {
  children: React.ReactNode;
  className?: string;
  rotationDegrees?: number;
}

export const RotateOnScroll: React.FC<RotateOnScrollProps> = ({
  children,
  className,
  rotationDegrees = 180
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const rotate = useTransform(scrollYProgress, [0, 1], [0, rotationDegrees]);

  return (
    <motion.div
      ref={ref}
      className={cn("", className)}
      style={{ rotate }}
    >
      {children}
    </motion.div>
  );
};

interface SlidingTextProps {
  text: string;
  className?: string;
  delay?: number;
}

export const SlidingText: React.FC<SlidingTextProps> = ({
  text,
  className,
  delay = 0
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });

  return (
    <div ref={ref} className={cn("overflow-hidden", className)}>
      <motion.div
        initial={{ y: "100%" }}
        animate={inView ? { y: "0%" } : { y: "100%" }}
        transition={{
          duration: 0.8,
          delay,
          ease: [0.22, 1, 0.36, 1]
        }}
      >
        {text}
      </motion.div>
    </div>
  );
};

interface CountUpProps {
  end: number;
  duration?: number;
  delay?: number;
  className?: string;
  prefix?: string;
  suffix?: string;
}

export const CountUp: React.FC<CountUpProps> = ({
  end,
  duration = 2,
  delay = 0,
  className,
  prefix = "",
  suffix = ""
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });

  return (
    <div ref={ref} className={cn("", className)}>
      <motion.span
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.5, delay }}
      >
        {prefix}
        <motion.span
          initial={{ rotateX: 90 }}
          animate={inView ? { rotateX: 0 } : { rotateX: 90 }}
          transition={{
            duration,
            delay,
            ease: "easeOut"
          }}
        >
          {inView ? end : 0}
        </motion.span>
        {suffix}
      </motion.span>
    </div>
  );
};

export default {
  FadeInView,
  ParallaxScroll,
  HoverCard,
  ProgressiveReveal,
  ScaleOnScroll,
  RotateOnScroll,
  SlidingText,
  CountUp
};