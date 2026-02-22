import { useEffect, useMemo, useState } from "react";
import { Loader2 } from "lucide-react";
import TopBar from "../components/builder/TopBar";
import SidebarAgent from "../components/builder/SidebarAgent";
import PreviewPane from "../components/builder/PreviewPane";
import WorkspaceTabs from "../components/builder/WorkspaceTabs";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { generateTemplete, generateChat } from "../redux/builderSlice";
import FileTree from "../components/builder/FileTree";
import CodeEditor from "../components/builder/CodeEditor";
import { buildFileTree } from "../utils/fileSystem";
import type { FileItem } from "../types";
import { buildWebContainerFileTree } from "../hooks/buildWebContainerFileTree";

type ViewMode = "code" | "preview";

function Builder() {
  const [viewMode, setViewMode] = useState<ViewMode>("code");
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);

  const prompt = useAppSelector((state) => state.builder.prompt);
  const uiPrompts = useAppSelector((state) => state.builder.uiPrompts ?? []);
  const generatedArtifact = useAppSelector(
    (state) => state.builder.generatedArtifact,
  );
  const chatLoading = useAppSelector((state) => state.builder.chatLoading);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (prompt !== "") {
      dispatch(generateTemplete(prompt)).then((result) => {
        if (generateTemplete.fulfilled.match(result)) {
          dispatch(generateChat());
        }
      });
    }
  }, [prompt]);

  // Merge base template actions with AI-generated actions.
  // The template provides infrastructure (package.json, vite.config, tsconfig, etc.)
  // while the AI provides application code. AI files override matching template files.
  const actions = useMemo(() => {
    const baseActions = uiPrompts[0]?.actions ?? [];
    if (!generatedArtifact) return baseActions;

    const merged = [...baseActions];
    for (const aiAction of generatedArtifact.actions) {
      const idx = merged.findIndex(
        (a) => a.filePath && a.filePath === aiAction.filePath,
      );
      if (idx >= 0) {
        merged[idx] = aiAction;
      } else {
        merged.push(aiAction);
      }
    }
    return merged;
  }, [uiPrompts, generatedArtifact]);

  // Build file tree for UI display
  const files = useMemo(() => buildFileTree(actions), [actions]);

  // Re-select file when actions change
  useEffect(() => {
    if (selectedFile && selectedFile.type === "file") {
      const updated = findFileByPath(files, selectedFile.path);
      setSelectedFile(updated);
    }
  }, [files]);

  // Build WebContainer-compatible file tree only when AI code is ready
  const webContainerFiles = useMemo(
    () => (generatedArtifact ? buildWebContainerFileTree(files) : {}),
    [files, generatedArtifact],
  );

  return (
    <div className="h-screen flex flex-col bg-[var(--color-bg)]">
      <TopBar />
      <main className="flex-1 flex overflow-hidden">
        <SidebarAgent actions={actions} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <WorkspaceTabs activeView={viewMode} onViewChange={setViewMode} />
          <div className="flex-1 flex overflow-hidden relative">
            {chatLoading && (
              <div className="absolute top-2 right-2 z-10 flex items-center gap-2 bg-[var(--color-panel)] px-3 py-1.5 rounded-lg shadow">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-xs text-[var(--color-text-muted)]">
                  Generating code...
                </span>
              </div>
            )}
            {viewMode === "code" ? (
              <>
                <FileTree files={files} onFileSelect={setSelectedFile} />
                <CodeEditor selectedFile={selectedFile} />
              </>
            ) : (
              <PreviewPane webContainerFiles={webContainerFiles} />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

function findFileByPath(
  items: FileItem[],
  path: string,
): FileItem | null {
  for (const item of items) {
    if (item.path === path) return item;
    if (item.type === "folder") {
      const found = findFileByPath(item.children, path);
      if (found) return found;
    }
  }
  return null;
}

export default Builder;