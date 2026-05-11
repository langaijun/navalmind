import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Info, Mic, Send, LogOut } from 'lucide-react';
import { useVoiceInput } from '@/hooks/useVoiceInput';
import { TypingIndicator } from '@/components/TypingIndicator';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';

interface Message {
  role: 'user' | 'ai';
  content: string;
  tags?: string;
}

const suggestions = [
  '我想获得财富自由',
  '我该如何做出更好的决策',
  '如何找到内心的平静',
];

export default function ChatPage() {
  const navigate = useNavigate();
  const { profile, logout } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const { isRecording, isSupported, toggleRecording } = useVoiceInput({
    onResult: (text) => {
      setInputText((prev) => prev + text);
    },
  });

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  // 调用 Supabase Edge Function（Key 藏在云端，无 CORS 问题）
  const callDifyAPI = useCallback(async (query: string) => {
    // 使用 supabase 内置方法获取认证 headers
    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;
    if (!token) throw new Error('未登录');

    const resp = await fetch(
      'https://pqwlzouwmyusmqewwgyo.supabase.co/functions/v1/smart-task',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': 'sb_publishable_qfZwL9jYiNyWtBV0e4sWVg_bRSawnjy',
          'Authorization': 'Bearer ' + token,
        },
        body: JSON.stringify({ query }),
      }
    );

    if (!resp.ok) {
      const err = await resp.json().catch(() => ({ error: '请求失败' }));
      throw new Error(err.error || '请求失败');
    }

    return resp;
  }, []);

  const handleSend = useCallback(
    (text: string) => {
      if (!text.trim()) return;

      const userMsg: Message = { role: 'user', content: text.trim() };
      setMessages((prev) => [...prev, userMsg]);
      setInputText('');
      setIsTyping(true);

      callDifyAPI(text.trim())
        .then((res) => {
          const reader = res.body?.getReader();
          if (!reader) throw new Error('No reader');

          let accumulatedContent = '';

          const readStream = () => {
            reader.read().then(({ done, value }) => {
              if (done) {
                setIsTyping(false);
                setMessages((prev) => {
                  const filtered = prev.filter((m) => !(m.role === 'ai' && m.content === '...'));
                  return [
                    ...filtered,
                    {
                      role: 'ai',
                      content: accumulatedContent || '思考中...',
                    },
                  ];
                });
                return;
              }

              const chunk = new TextDecoder().decode(value);
              const lines = chunk.split('\n');

              for (const line of lines) {
                if (line.startsWith('data: ')) {
                  try {
                    const data = JSON.parse(line.slice(6));
                    if (data.event === 'message' && data.answer) {
                      accumulatedContent += data.answer;
                      setMessages((prev) => {
                        const withoutStreaming = prev.filter(
                          (m) => !(m.role === 'ai' && m.content === '...')
                        );
                        const lastMsg = withoutStreaming[withoutStreaming.length - 1];
                        if (lastMsg?.role === 'ai' && !lastMsg.tags) {
                          return [
                            ...withoutStreaming.slice(0, -1),
                            { ...lastMsg, content: accumulatedContent },
                          ];
                        }
                        return [
                          ...withoutStreaming,
                          { role: 'ai', content: accumulatedContent },
                        ];
                      });
                    }
                    if (data.event === 'agent_message' && data.answer) {
                      accumulatedContent += data.answer;
                    }
                  } catch {
                    // ignore parse errors for incomplete chunks
                  }
                }
              }

              readStream();
            });
          };

          readStream();
        })
        .catch(() => {
          setIsTyping(false);
          setMessages((prev) => [
            ...prev,
            { role: 'ai', content: '抱歉，连接出现了一些问题。请稍后再试。' },
          ]);
        });
    },
    [callDifyAPI]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSend(inputText);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend(inputText);
    }
  };

  const isEmpty = messages.length === 0;

  return (
    <motion.div
      className="fixed inset-0 flex flex-col"
      style={{ backgroundColor: 'var(--bg-primary)' }}
      initial={{ y: '100vh', opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: '100vh', opacity: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] as const }}
    >
      {/* Header */}
      <header
        className="flex items-center justify-between px-6 h-[60px] shrink-0 border-b"
        style={{ borderColor: isEmpty ? 'transparent' : 'var(--border-color)' }}
      >
        <div className="flex items-center gap-2">
          <span className="text-body font-medium" style={{ color: 'var(--text-primary)' }}>
            Naval 导师
          </span>
          <span className="relative flex h-2 w-2">
            <span
              className="animate-pulse-dot absolute inline-flex h-full w-full rounded-full opacity-75"
              style={{ backgroundColor: 'var(--success)' }}
            />
            <span
              className="relative inline-flex rounded-full h-2 w-2"
              style={{ backgroundColor: 'var(--success)' }}
            />
          </span>
          {profile && (
            <span
              className="text-caption ml-2 px-2 py-0.5 rounded"
              style={{
                color: 'var(--accent-dim)',
                border: '1px solid var(--border-color)',
              }}
            >
              {profile.name}
            </span>
          )}
        </div>

        <div className="flex justify-end items-center gap-1">
          <button
            onClick={() => navigate('/about')}
            className="p-2 rounded-full transition-colors duration-300"
            style={{ color: 'var(--text-muted)' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
            title="关于 Naval"
          >
            <Info size={18} />
          </button>
          <button
            onClick={logout}
            className="p-2 rounded-full transition-colors duration-300"
            style={{ color: 'var(--text-muted)' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
            title="退出登录"
          >
            <LogOut size={18} />
          </button>
          {isSupported && (
            <button
              onClick={toggleRecording}
              className="p-2 rounded-full transition-colors duration-300"
              style={{
                color: isRecording ? 'var(--accent)' : 'var(--text-secondary)',
              }}
              onMouseEnter={(e) => {
                if (!isRecording) e.currentTarget.style.color = 'var(--accent)';
              }}
              onMouseLeave={(e) => {
                if (!isRecording) e.currentTarget.style.color = 'var(--text-secondary)';
              }}
              title={isRecording ? '停止录音' : '语音输入'}
            >
              <Mic size={20} className={isRecording ? 'animate-voice-pulse' : ''} />
            </button>
          )}
        </div>
      </header>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6">
        {isEmpty ? (
          <div className="flex flex-col items-center justify-center h-full">
            <h1
              className="text-h1 font-light text-center mb-4"
              style={{ color: 'var(--text-primary)' }}
            >
              你想探讨什么？
            </h1>
            <p
              className="text-body-lg text-center mb-12 max-w-lg"
              style={{ color: 'var(--text-secondary)' }}
            >
              职场、财富、心态、决策——用 Naval 的视角重新审视。
            </p>

            <div className="flex flex-wrap justify-center gap-3">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => handleSend(s)}
                  className="px-6 py-2.5 rounded-full border text-body transition-all duration-300"
                  style={{
                    backgroundColor: 'var(--bg-secondary)',
                    borderColor: 'var(--border-color)',
                    color: 'var(--text-secondary)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--accent-dim)';
                    e.currentTarget.style.color = 'var(--text-primary)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border-color)';
                    e.currentTarget.style.color = 'var(--text-secondary)';
                  }}
                >
                  {s}
                </button>
              ))}
            </div>

            {isRecording && (
              <div className="mt-8 flex items-center gap-2" style={{ color: 'var(--accent)' }}>
                <span className="w-2 h-2 rounded-full animate-pulse-dot bg-current" />
                <span className="text-caption">正在聆听...</span>
              </div>
            )}
          </div>
        ) : (
          <div className="max-w-3xl mx-auto space-y-8">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={msg.role === 'user' ? 'flex justify-end' : 'flex justify-start'}
              >
                <div className={msg.role === 'user' ? 'max-w-[70%]' : 'max-w-[85%]'}>
                  {msg.role === 'ai' && (
                    <p className="text-caption mb-2" style={{ color: 'var(--accent)' }}>
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
                      {msg.content}
                    </div>
                  ) : (
                    <div>
                      {msg.content === '...' ? (
                        <TypingIndicator />
                      ) : (
                        <p
                          className="text-body-lg whitespace-pre-line"
                          style={{ color: 'var(--text-primary)', lineHeight: 1.8 }}
                        >
                          {msg.content}
                        </p>
                      )}
                      {msg.tags && (
                        <div className="mt-3">
                          <span
                            className="inline-block text-small px-3 py-1 rounded"
                            style={{
                              color: 'var(--accent-dim)',
                              border: 'border: 1px solid var(--accent-dim)',
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

            {isTyping && messages[messages.length - 1]?.role === 'user' && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Bar */}
      <form
        onSubmit={handleSubmit}
        className="shrink-0 px-4 md:px-8 py-4 border-t"
        style={{
          backgroundColor: 'var(--bg-secondary)',
          borderColor: 'var(--border-color)',
        }}
      >
        <div className="max-w-3xl mx-auto flex items-end gap-3">
          {isSupported && (
            <button
              type="button"
              onClick={toggleRecording}
              className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300"
              style={{
                backgroundColor: isRecording ? 'rgba(196,165,90,0.2)' : 'var(--bg-elevated)',
                color: isRecording ? 'var(--accent)' : 'var(--text-secondary)',
              }}
            >
              <Mic size={18} />
            </button>
          )}

          <textarea
            ref={inputRef}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="用 Naval 的视角提问..."
            rows={1}
            className="flex-1 resize-none px-5 py-3 rounded-full text-body outline-none transition-colors duration-300"
            style={{
              backgroundColor: 'var(--bg-primary)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-primary)',
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = 'var(--accent)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = 'var(--border-color)';
            }}
          />

          <button
            type="submit"
            disabled={!inputText.trim()}
            className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 disabled:opacity-30"
            style={{
              backgroundColor: 'var(--accent)',
              color: 'var(--bg-primary)',
            }}
          >
            <Send size={18} />
          </button>
        </div>
      </form>
    </motion.div>
  );
}
