import { useNavigate } from 'react-router-dom';
import { CTAButton } from '@/components/CTAButton';
import { ScrollReveal } from '@/components/ScrollReveal';

export function FooterSection() {
  const navigate = useNavigate();

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer
      id="footer"
      className="relative pt-24 pb-16 px-4 border-t"
      style={{
        backgroundColor: 'var(--bg-secondary)',
        borderColor: 'var(--border-color)',
        zIndex: 1,
      }}
    >
      <div className="max-w-6xl mx-auto">
        {/* CTA */}
        <ScrollReveal className="text-center mb-24">
          <h2 className="text-h1 mb-10" style={{ color: 'var(--text-primary)' }}>
            准备好重新审视一切了吗？
          </h2>
          <CTAButton />
        </ScrollReveal>

        {/* Navigation */}
        <ScrollReveal>
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-16">
            <div>
              <h3 className="text-h3" style={{ color: 'var(--text-primary)' }}>
                navalmind.cc
              </h3>
              <p className="text-caption mt-1" style={{ color: 'var(--text-secondary)' }}>
                AI 导师系统
              </p>
            </div>

            <nav className="flex flex-wrap items-center gap-8">
              <button
                onClick={() => scrollToSection('philosophy')}
                className="nav-link text-body"
              >
                原理
              </button>
              <button
                onClick={() => scrollToSection('preview')}
                className="nav-link text-body"
              >
                预览
              </button>
              <button
                onClick={() => navigate('/chat')}
                className="nav-link text-body"
              >
                对话
              </button>
            </nav>
          </div>
        </ScrollReveal>

        {/* Copyright */}
        <div
          className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t"
          style={{ borderColor: 'var(--border-color)' }}
        >
          <p className="text-caption" style={{ color: 'var(--text-muted)' }}>
            © 2025 Navalmind.cc
          </p>
          <p className="text-caption" style={{ color: 'var(--text-muted)' }}>
            Inspired by Naval Ravikant · Built with DeepSeek
          </p>
        </div>
      </div>
    </footer>
  );
}
