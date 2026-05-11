import { motion } from 'framer-motion';
import { Compass, Scale, Eye, Heart } from 'lucide-react';
import { ScrollReveal } from '@/components/ScrollReveal';
import { SectionHeader } from '@/components/SectionHeader';

const principles = [
  {
    icon: Compass,
    number: '01',
    progress: '25%',
    title: '第一性原理',
    description: '不直接给答案，先拆解问题的底层逻辑。回到最基本的事实，从零开始重建认知。',
  },
  {
    icon: Scale,
    number: '02',
    progress: '50%',
    title: '四种杠杆',
    description: '针对事业问题，强制评估劳动力、资本、代码、媒体四种杠杆模型。找到你的非对称优势。',
  },
  {
    icon: Eye,
    number: '03',
    progress: '75%',
    title: '反直觉滤镜',
    description: '针对平庸思维提供 Contrarian 观点。当所有人向左，Naval 会问你：右边有什么？',
  },
  {
    icon: Heart,
    number: '04',
    progress: '100%',
    title: '内心平和',
    description: '真正的财富是自由的身心。从欲望中解脱，在冥想中找到判断力的源头。',
  },
];

export function PhilosophySection() {
  return (
    <section
      className="relative py-[200px] px-4"
      style={{ backgroundColor: 'var(--bg-secondary)', zIndex: 1 }}
    >
      <div className="max-w-6xl mx-auto">
        <ScrollReveal className="flex justify-center mb-20">
          <SectionHeader
            eyebrow="CORE PRINCIPLES"
            title="Naval 的思维框架"
            subtitle="四个支柱，构建你的人生算法"
          />
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {principles.map((p, i) => (
            <ScrollReveal key={p.number} delay={i * 0.1}>
              <motion.div
                className="p-16 rounded-2xl border transition-colors duration-400"
                style={{
                  backgroundColor: 'var(--bg-primary)',
                  borderColor: 'var(--border-color)',
                }}
                whileHover={{
                  borderColor: 'var(--accent-dim)',
                  backgroundColor: '#0F0F0F',
                }}
              >
                <p
                  className="text-caption font-medium mb-6"
                  style={{ color: 'var(--accent)' }}
                >
                  {p.number}
                </p>

                <p.icon
                  size={48}
                  strokeWidth={1}
                  style={{ color: 'var(--accent)' }}
                  className="mb-6"
                />

                <h3 className="text-h3 mb-4" style={{ color: 'var(--text-primary)' }}>
                  {p.title}
                </h3>

                <p className="text-body mb-10" style={{ color: 'var(--text-secondary)' }}>
                  {p.description}
                </p>

                {/* Progress bar */}
                <div
                  className="w-full h-0.5 rounded-full"
                  style={{ backgroundColor: 'var(--border-color)' }}
                >
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: 'var(--accent)' }}
                    initial={{ width: 0 }}
                    whileInView={{ width: p.progress }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, delay: 0.3 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                  />
                </div>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
