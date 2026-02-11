import { useState } from 'react';
import { ChevronRight, ChevronDown, File, Folder, FolderOpen } from 'lucide-react';
import type { FileItem } from '../../types';

interface FileTreeProps {
  files: FileItem[];
  onFileSelect?: (file: FileItem) => void;
}

interface TreeNodeProps {
  item: FileItem;
  level: number;
  onFileSelect?: (file: FileItem) => void;
}

function TreeNode({ item, level, onFileSelect }: TreeNodeProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const isFolder = item.type === 'folder';

  const handleClick = () => {
    if (isFolder) {
      setIsExpanded(!isExpanded);
    } else {
      onFileSelect?.(item);
    }
  };

  return (
    <div>
      <div
        className="flex items-center gap-1 px-2 py-1 hover:bg-[var(--color-bg-hover)] cursor-pointer rounded text-sm"
        style={{ paddingLeft: `${level * 12 + 8}px` }}
        onClick={handleClick}
      >
        {isFolder ? (
          <>
            {isExpanded ? (
              <ChevronDown className="w-4 h-4 text-[var(--color-text-muted)] flex-shrink-0" />
            ) : (
              <ChevronRight className="w-4 h-4 text-[var(--color-text-muted)] flex-shrink-0" />
            )}
            {isExpanded ? (
              <FolderOpen className="w-4 h-4 text-[var(--color-accent)] flex-shrink-0" />
            ) : (
              <Folder className="w-4 h-4 text-[var(--color-accent)] flex-shrink-0" />
            )}
          </>
        ) : (
          <>
            <div className="w-4" /> {/* Spacer for alignment */}
            <File className="w-4 h-4 text-[var(--color-text-muted)] flex-shrink-0" />
          </>
        )}
        <span className="truncate text-[var(--color-text)]">{item.name}</span>
      </div>

      {isFolder && isExpanded && item.children && (
        <div>
          {item.children.map((child, index) => (
            <TreeNode
              key={child.path || `${child.name}-${index}`}
              item={child}
              level={level + 1}
              onFileSelect={onFileSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function FileTree({ files, onFileSelect }: FileTreeProps) {
  return (
    <aside className="w-56 flex flex-col bg-[var(--color-bg-secondary)] border-r border-[var(--color-border)] overflow-y-auto">
      <div className="p-3 border-b border-[var(--color-border)]">
        <h2 className="text-xs font-medium uppercase tracking-wide text-[var(--color-text-muted)]">
          Files
        </h2>
      </div>
      <div className="flex-1 p-2">
        {files.length === 0 ? (
          <p className="text-sm text-[var(--color-text-muted)] px-2">
            No files yet
          </p>
        ) : (
          <div className="space-y-0.5">
            {files.map((file, index) => (
              <TreeNode
                key={file.path || `${file.name}-${index}`}
                item={file}
                level={0}
                onFileSelect={onFileSelect}
              />
            ))}
          </div>
        )}
      </div>
    </aside>
  );
}

export default FileTree;