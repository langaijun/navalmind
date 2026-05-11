import { motion, type Variants } from 'framer-motion';

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

export function HeroSection() {
  return (
    <section
      className="relative min-h-[60vh] flex flex-col items-center justify-center px-4 pt-24"
      style={{ zIndex: 1 }}
    >
      <motion.div
        className="text-center max-w-3xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.p variants={itemVariants} className="eyebrow mb-8">
          NAVMIND.CC — AI LIFE MENTOR
        </motion.p>

        <motion.h1 variants={itemVariants} className="text-display mb-8">
          <span style={{ color: 'var(--text-primary)' }}>Naval的</span>
          <span className="accent-text">核心思想</span>
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="text-body-lg max-w-xl mx-auto mb-12"
          style={{ color: 'var(--text-secondary)' }}
        >
          基于 Naval Ravikant 的思想库，用第一性原理拆解你的职场困惑、财富焦虑与人生决策。
        </motion.p>

      </motion.div>
    </section>
  );
}
