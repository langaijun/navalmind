import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface CTAButtonProps {
  text?: string;
  onClick?: () => void;
  to?: string;
  className?: string;
}

export function CTAButton({ text = '开始对话', onClick, to, className = '' }: CTAButtonProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (to) {
      navigate(to);
    } else {
      navigate('/chat');
    }
  };

  return (
    <motion.button
      onClick={handleClick}
      className={`
        inline-flex items-center gap-3 px-12 py-3.5 rounded-full
        text-caption font-medium tracking-wider
        transition-colors duration-300
        ${className}
      `}
      style={{
        backgroundColor: 'var(--accent)',
        color: 'var(--bg-primary)',
      }}
      whileHover={{
        backgroundColor: '#F5F5F0',
        color: '#0A0A0A',
      }}
      whileTap={{ scale: 0.97 }}
    >
      {text}
      <ArrowRight size={16} />
    </motion.button>
  );
}
