import type { FileItem } from "../types";


export function buildWebContainerFileTree(
  files: FileItem[]
): Record<string, any> {
  const result: Record<string, any> = {};

  for (const item of files) {
    if (item.type === "folder") {
      // For folders, create a directory with recursively processed children
      result[item.name] = {
        directory: buildWebContainerFileTree(item.children),
      };
    } else {
      // For files, create a file object with contents
      result[item.name] = {
        file: {
          contents: item.content || "",
        },
      };
    }
  }

  return result;
}