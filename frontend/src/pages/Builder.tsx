import { useEffect, useMemo, useState } from "react";
import TopBar from "../components/builder/TopBar";
import SidebarAgent from "../components/builder/SidebarAgent";
import PreviewPane from "../components/builder/PreviewPane";
import WorkspaceTabs from "../components/builder/WorkspaceTabs";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { generateTemplete } from "../redux/builderSlice";
import FileTree from "../components/builder/FileTree";
import CodeEditor from "../components/builder/CodeEditor";
import { buildFileTree } from "../utils/fileSystem";
import type { FileItem } from "../types";

type ViewMode = "code" | "preview";

function Builder() {
  const [viewMode, setViewMode] = useState<ViewMode>("code");
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);

  const prompt = useAppSelector((state) => state.builder.prompt);
  const uiPrompts = useAppSelector((state) => state.builder.uiPrompts ?? []);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (prompt !== "") {
      dispatch(generateTemplete(prompt));
    }
  }, [prompt]);

  const actions = uiPrompts[0]?.actions ?? [];
  const files = useMemo(() => buildFileTree(actions), [actions]);

  return (
    <div className="h-screen flex flex-col bg-[var(--color-bg)]">
      <TopBar />
      <main className="flex-1 flex overflow-hidden">
        <SidebarAgent actions={actions} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <WorkspaceTabs activeView={viewMode} onViewChange={setViewMode} />
          <div className="flex-1 flex overflow-hidden">
            {viewMode === "code" ? (
              <>
                <FileTree files={files} onFileSelect={setSelectedFile} />
                <CodeEditor selectedFile={selectedFile} />
              </>
            ) : (
              <PreviewPane />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Builder;
