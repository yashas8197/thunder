type ViewMode = "code" | "preview";

interface WorkspaceTabsProps {
  activeView: ViewMode;
  onViewChange: (view: ViewMode) => void;
}

function WorkspaceTabs({ activeView, onViewChange }: WorkspaceTabsProps) {
  const tabs: { id: ViewMode; label: string }[] = [
    { id: "code", label: "Code" },
    { id: "preview", label: "Preview" },
  ];

  return (
    <div className="h-10 flex items-center gap-1 px-2 bg-[var(--color-panel)] border-b border-[var(--color-border)]">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onViewChange(tab.id)}
          className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors cursor-pointer ${
            activeView === tab.id
              ? "bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)]"
              : "text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

export default WorkspaceTabs;
