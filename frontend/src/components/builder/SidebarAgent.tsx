import type { Action } from "../../types";

type SidebarAgentProps = {
  actions: Action[];
};

function SidebarAgent({ actions }: SidebarAgentProps) {
  return (
    <aside className="w-1/3 flex flex-col bg-[var(--color-panel)] border-r border-[var(--color-border)] overflow-y-auto">
      <div className="p-4 border-b border-[var(--color-border)]">
        <h2 className="text-sm font-medium text-[var(--color-text-primary)]">
          New chat with Agent
        </h2>
      </div>
      <div className="flex-1 p-3 space-y-2">
        {actions?.map((action) => (
          <button
            key={action.id}
            className="w-full px-3 py-2 text-sm text-left text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-panel-hover)] rounded-lg transition-colors cursor-pointer"
          >
            {action.title}
          </button>
        ))}
      </div>
    </aside>
  );
}

export default SidebarAgent;
