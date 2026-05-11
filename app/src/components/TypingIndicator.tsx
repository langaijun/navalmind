export function TypingIndicator() {
  return (
    <div className="flex items-center gap-2 py-3">
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
      <span className="text-caption" style={{ color: 'var(--text-muted)' }}>
        Naval 正在思考...
      </span>
    </div>
  );
}
