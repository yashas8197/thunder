import type { Action, FileItem } from "../types";

export function buildFileTree(actions: Action[]): FileItem[] {
  const root: FileItem = {
    name: "",
    type: "folder",
    path: "",
    children: [],
  };

  for (const action of actions) {
    if (action.type === "file") {
      if (!action.filePath) continue;

      const segments = action.filePath.split("/").filter(Boolean);
      if (segments.length === 0) continue;

      const fileName = segments[segments.length - 1];
      const parent = ensurePath(root, segments);

      createOrUpdateFile(
        parent,
        fileName,
        action.content || "",
        action.filePath
      );
    }
  }

  return root.children;
}

function ensurePath(root: FileItem, pathSegments: string[]): FileItem {
  let current = root;

  for (let i = 0; i < pathSegments.length - 1; i++) {
    const segmentName = pathSegments[i];

    let folder = current.children!.find(
      (child) => child.type === "folder" && child.name === segmentName
    );

    if (!folder) {
      folder = {
        name: segmentName,
        type: "folder",
        path: current.path
          ? `${current.path}/${segmentName}`
          : segmentName,
        children: [],
      };
      current.children!.push(folder);
    }

    current = folder;
  }

  return current;
}

function createOrUpdateFile(
  parent: FileItem,
  fileName: string,
  content: string,
  fullPath: string
): void {
  const existingFile = parent.children!.find(
    (child) => child.type === "file" && child.name === fileName
  );

  if (existingFile) {
    existingFile.content = content;
  } else {
    const newFile: FileItem = {
      name: fileName,
      type: "file",
      path: fullPath,
      content,
    };
    parent.children!.push(newFile);
  }
}