import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { SectionHeader } from '@/components/SectionHeader';
import { ScrollReveal } from '@/components/ScrollReveal';
import { useTypewriter } from '@/hooks/useTypewriter';
import { useScrollReveal } from '@/hooks/useScrollReveal';

interface ChatMessage {
  role: 'user' | 'ai';
  content: string;
  tags?: string;
}

const messages: ChatMessage[] = [
  {
    role: 'user',
    content: '我感觉被困在一份不喜欢的工作里，但不敢辞职。',
  },
  {
    role: 'ai',
    content: '恐惧是社会的编程。\n\n先不问"该不该辞职"，先拆解：\n你害怕的是没有收入，还是害怕让别人失望？\n\n如果是收入——计算你的最低生存成本。\n六个月的开支就是你的自由价格。\n\n如果是别人的眼光——那是他们的游戏，不是你的。',
    tags: '第一性原理 · 恐惧分析',
  },
  {
    role: 'user',
    content: '我害怕的是收入。但我也不知道能做什么别的。',
  },
  {
    role: 'ai',
    content: '那就从"不知道自己能做什么"开始拆解。\n\n你过去十年做了什么别人愿意付钱的事？\n不是"擅长"，是"别人主动找你帮忙"的事。\n\n那就是你的 Specific Knowledge。\n剩下的，只是规模化的问题。',
    tags: 'Specific Knowledge · 杠杆评估',
  },
];

function TypewriterMessage({
  text,
  startDelay,
  onComplete,
}: {
  text: string;
  startDelay: number;
  onComplete?: () => void;
}) {
  const { displayText, isComplete } = useTypewriter({
    text,
    speed: 25,
    startDelay,
    onComplete,
    enabled: true,
  });

  return (
    <span>
      {displayText}
      {!isComplete && <span className="animate-blink">|</span>}
    </span>
  );
}

export function PreviewSection() {
  const [started, setStarted] = useState(false);
  const [completedMessages, setCompletedMessages] = useState<number[]>([]);
  const { ref, isVisible } = useScrollReveal({ threshold: 0.3 });

  useEffect(() => {
    if (isVisible && !started) {
      setStarted(true);
    }
  }, [isVisible, started]);

  const handleMessageComplete = (index: number) => {
    setCompletedMessages((prev) => [...prev, index]);
  };

  const getMessageDelay = (msgIndex: number) => {
    let delay = 500;
    for (let i = 0; i < msgIndex; i++) {
      delay += messages[i].content.length * 25 + 600;
    }
    return delay;
  };

  return (
    <section
      className="relative py-[200px] px-4"
      style={{ backgroundColor: 'var(--bg-primary)', zIndex: 1 }}
    >
      <div className="max-w-6xl mx-auto">
        <ScrollReveal className="flex justify-center mb-20">
          <SectionHeader
            eyebrow="PREVIEW"
            title="一次真实的对话"
          />
        </ScrollReveal>

        <div ref={ref}>
          <motion.div
            className="max-w-3xl mx-auto rounded-2xl border p-8 md:p-10"
            style={{
              backgroundColor: 'var(--bg-secondary)',
              borderColor: 'var(--border-color)',
            }}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isVisible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="space-y-8">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={msg.role === 'user' ? 'flex justify-end' : 'flex justify-start'}
                >
                  <div className={msg.role === 'user' ? 'max-w-[70%]' : 'max-w-[85%]'}>
                    {msg.role === 'ai' && (
                      <p
                        className="text-caption mb-2"
                        style={{ color: 'var(--accent)' }}
                      >
                        Naval
                      </p>
                    )}

                    {msg.role === 'user' ? (
                      <div
                        className="px-5 py-3 text-body"
                        style={{
                          backgroundColor: 'var(--bg-elevated)',
                          color: 'var(--text-primary)',
                          borderRadius: '16px 16px 4px 16px',
                        }}
                      >
                        {started ? (
                          <TypewriterMessage
                            text={msg.content}
                            startDelay={getMessageDelay(i)}
                            onComplete={() => handleMessageComplete(i)}
                          />
                        ) : (
                          msg.content
                        )}
                      </div>
                    ) : (
                      <div>
                        <p
                          className="text-body-lg whitespace-pre-line"
                          style={{
                            color: 'var(--text-primary)',
                            lineHeight: 1.8,
                          }}
                        >
                          {started ? (
                            <TypewriterMessage
                              text={msg.content}
                              startDelay={getMessageDelay(i)}
                              onComplete={() => handleMessageComplete(i)}
                            />
                          ) : (
                            msg.content
                          )}
                        </p>
                        {msg.tags && (
                          <div className="mt-3">
                            <span
                              className="inline-block text-small px-3 py-1 rounded"
                              style={{
                                color: 'var(--accent-dim)',
                                border: '1px solid var(--accent-dim)',
                              }}
                            >
                              {msg.tags}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Typing indicator at bottom */}
              {started && completedMessages.length < messages.length && (
                <div className="flex items-center gap-2 py-2">
                  <div className="flex items-center gap-1">
                    <span
                      className="w-1.5 h-1.5 rounded-full animate-bounce-dot"
                      style={{ backgroundColor: 'var(--text-muted)' }}
                    />
                    <span
                      className="w-1.5 h-1.5 rounded-full animate-bounce-dot-delay-1"
                      style={{ backgroundColor: 'var(--text-muted)' }}
                    />
                    <span
                      className="w-1.5 h-1.5 rounded-full animate-bounce-dot-delay-2"
                      style={{ backgroundColor: 'var(--text-muted)' }}
                    />
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
