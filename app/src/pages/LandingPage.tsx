import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { NeuralConstellation } from '@/components/NeuralConstellation';
import { HeroSection } from '@/sections/HeroSection';
import { PhilosophySection } from '@/sections/PhilosophySection';
import { PreviewSection } from '@/sections/PreviewSection';
import { FooterSection } from '@/sections/FooterSection';

export default function LandingPage() {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="relative">
      {/* 顶部导航：返回对话 */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 h-[50px]"
        style={{
          backgroundColor: 'rgba(10,10,10,0.85)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid var(--border-color)',
        }}
      >
        <span className="text-caption" style={{ color: 'var(--text-muted)' }}>
          关于 Naval
        </span>
        <button
          onClick={() => navigate('/chat')}
          className="flex items-center gap-2 text-caption transition-colors duration-300"
          style={{ color: 'var(--text-secondary)' }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
        >
          <ArrowLeft size={14} />
          返回对话
        </button>
      </nav>

      <NeuralConstellation />
      <HeroSection />
      <div id="philosophy">
        <PhilosophySection />
      </div>
      <div id="preview">
        <PreviewSection />
      </div>
      <FooterSection />
    </div>
  );
}
