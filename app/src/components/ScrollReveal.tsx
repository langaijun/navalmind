import { motion } from 'framer-motion';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import type { ReactNode } from 'react';

interface ScrollRevealProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  direction?: 'up' | 'down' | 'left' | 'right';
  distance?: number;
}

export function ScrollReveal({
  children,
  delay = 0,
  className = '',
  direction = 'up',
  distance = 60,
}: ScrollRevealProps) {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.2 });

  const getInitialPosition = () => {
    switch (direction) {
      case 'up': return { y: distance, x: 0 };
      case 'down': return { y: -distance, x: 0 };
      case 'left': return { x: distance, y: 0 };
      case 'right': return { x: -distance, y: 0 };
    }
  };

  return (
    <div ref={ref} className={className}>
      <motion.div
        initial={{ opacity: 0, ...getInitialPosition() }}
        animate={isVisible ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, ...getInitialPosition() }}
        transition={{
          duration: 0.8,
          delay,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}
