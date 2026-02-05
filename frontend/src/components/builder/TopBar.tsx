function TopBar() {
  return (
    <header className="h-14 flex items-center justify-between px-4 bg-[var(--color-panel)] border-b border-[var(--color-border)]">
      <div className="text-[var(--color-text-primary)] font-semibold">
        Builder
      </div>
      <div className="flex items-center gap-3">
        <button className="px-4 py-2 text-sm text-white font-medium bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] rounded-lg transition-colors cursor-pointer">
          Publish
        </button>
      </div>
    </header>
  );
}

export default TopBar;
