import { useEffect, useState } from "react";
import TopBar from "../components/builder/TopBar";
import SidebarAgent from "../components/builder/SidebarAgent";
import FileTree from "../components/builder/FileTree";
import CodeEditor from "../components/builder/CodeEditor";
import PreviewPane from "../components/builder/PreviewPane";
import WorkspaceTabs from "../components/builder/WorkspaceTabs";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { generateTemplete } from "../redux/builderSlice";
import { parseXml } from "../steps";
import type { Step } from "../types";

type ViewMode = "code" | "preview";

function Builder() {
  const [viewMode, setViewMode] = useState<ViewMode>("code");
  const prompt = useAppSelector((state) => state.builder.prompt);
  const uiPrompts = useAppSelector((state) => state.builder.uiPrompts);
  const [steps, setSteps] = useState<Step[]>([]);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (prompt !== "") {
      dispatch(generateTemplete(prompt));
    }
  }, [prompt]);

  useEffect(() => {
    if (uiPrompts && uiPrompts.length > 0) {
      setSteps(parseXml(uiPrompts[0]));
    }
  }, [uiPrompts]);

  return (
    <div className="h-screen flex flex-col bg-[var(--color-bg)]">
      <TopBar />
      <main className="flex-1 flex overflow-hidden">
        <SidebarAgent steps={steps} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <WorkspaceTabs activeView={viewMode} onViewChange={setViewMode} />
          <div className="flex-1 flex overflow-hidden">
            {viewMode === "code" ? (
              <>
                <FileTree />
                <CodeEditor />
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
