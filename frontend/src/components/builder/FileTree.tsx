function FileTree() {
  return (
    <aside className="w-56 flex flex-col bg-[var(--color-bg-secondary)] border-r border-[var(--color-border)] overflow-y-auto">
      <div className="p-3 border-b border-[var(--color-border)]">
        <h2 className="text-xs font-medium uppercase tracking-wide text-[var(--color-text-muted)]">
          Files
        </h2>
      </div>
      <div className="flex-1 p-2">
        <p className="text-sm text-[var(--color-text-muted)] px-2">File Tree</p>
      </div>
    </aside>
  );
}

export default FileTree;
