function PreviewPane() {
  return (
    <section className="flex-1 flex flex-col bg-[var(--color-bg-secondary)] overflow-hidden">
      <div className="h-10 flex items-center px-4 border-b border-[var(--color-border)]">
        <span className="text-xs text-[var(--color-text-muted)]">Preview</span>
      </div>
      <div className="flex-1 flex items-center justify-center">
        <p className="text-[var(--color-text-muted)] text-sm">Preview</p>
      </div>
    </section>
  );
}

export default PreviewPane;
