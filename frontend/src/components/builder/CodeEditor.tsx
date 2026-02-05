function CodeEditor() {
  return (
    <section className="flex-1 flex flex-col bg-[var(--color-bg)] overflow-hidden">
      <div className="h-10 flex items-center px-4 bg-[var(--color-bg-secondary)] border-b border-[var(--color-border)]">
        <span className="text-xs text-[var(--color-text-muted)]">
          index.tsx
        </span>
      </div>
      <div className="flex-1 flex items-center justify-center">
        <p className="text-[var(--color-text-muted)] font-mono text-sm">
          Code Editor
        </p>
      </div>
    </section>
  );
}

export default CodeEditor;
