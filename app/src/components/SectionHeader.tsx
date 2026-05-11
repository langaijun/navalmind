interface SectionHeaderProps {
  eyebrow: string;
  title: string;
  subtitle?: string;
  centered?: boolean;
  light?: boolean;
}

export function SectionHeader({ eyebrow, title, subtitle, centered = true, light = false }: SectionHeaderProps) {
  return (
    <div className={centered ? 'text-center' : ''}>
      <p className="eyebrow mb-4">{eyebrow}</p>
      <h2
        className="text-h1 mb-6"
        style={{ color: light ? 'var(--text-primary)' : 'var(--text-primary)' }}
      >
        {title}
      </h2>
      {subtitle && (
        <p className="text-body-lg max-w-xl" style={{ color: 'var(--text-secondary)' }}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
