import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, isAuthenticated, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [debug, setDebug] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      navigate('/chat', { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="w-6 h-6 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setDebug('');
    setIsSubmitting(true);

    try {
      const result = await login(email, password);
      setDebug(`登录成功! profile: ${JSON.stringify(result.profile)}`);
      navigate('/chat', { replace: true });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      console.error('登录错误详情:', err);
      setError(message);
      setDebug(`错误类型: ${typeof err}, 原始错误: ${message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <motion.div className="w-full max-w-sm" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <div className="text-center mb-12">
          <h1 className="text-h2 font-light tracking-tight" style={{ color: 'var(--accent)' }}>navalmind</h1>
          <p className="text-caption mt-2" style={{ color: 'var(--text-muted)' }}>家庭私有版 · 登录</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="邮箱"
            required
            className="w-full px-5 py-3.5 rounded-lg text-body outline-none"
            style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
          />

          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="密码"
              required
              minLength={1}
              className="w-full px-5 py-3.5 pr-12 rounded-lg text-body outline-none"
              style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }}>
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {error && (
            <div className="p-3 rounded-lg text-sm" style={{ backgroundColor: 'rgba(204,68,68,0.1)', color: '#c44', border: '1px solid rgba(204,68,68,0.3)' }}>
              <p className="font-medium">{error}</p>
            </div>
          )}

          {debug && (
            <div className="p-3 rounded-lg text-xs break-all" style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-secondary)', border: '1px solid var(--border-color)' }}>
              {debug}
            </div>
          )}

          <motion.button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 rounded-xl text-body font-medium tracking-wider"
            style={{ backgroundColor: 'var(--accent)', color: 'var(--bg-primary)', boxShadow: '0 4px 20px rgba(196, 165, 90, 0.25)' }}
            whileHover={!isSubmitting ? { scale: 1.02 } : undefined}
            whileTap={!isSubmitting ? { scale: 0.98 } : undefined}
          >
            {isSubmitting ? '登录中...' : '登 录'}
          </motion.button>
        </form>

        <p className="text-center text-small mt-10" style={{ color: 'var(--text-muted)' }}>此系统为家庭私有，不提供公开注册</p>
      </motion.div>
    </div>
  );
}
