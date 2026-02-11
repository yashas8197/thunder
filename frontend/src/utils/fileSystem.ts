import type { Action, FileItem } from '../types/index';

export function buildFileTree(actions: Action[]): FileItem[] {
  // console.log(actions, 'action');
  const root: FileItem = {
    name: '',
    type: 'folder',
    path: '',
    children: [],
  };

  for (const action of actions) {
    if (
      action?.type === 'file' &&
      action.filePath &&
      action.filePath.trim() !== ''
    ) {

      const segments = action.filePath.split('/').filter(Boolean);
      if (segments.length === 0) continue;

      const fileName = segments[segments.length - 1];

      const parent = ensurePath(root, segments);

      createOrUpdateFile(parent, fileName, action.content, action.filePath);
    }
  }
  
  return root.children;
}

function ensurePath(root: FileItem, pathSegments: string[]) {
  let current = root;

  pathSegments.slice(0, -1).forEach((segmentName) => {
    if (current.type !== 'folder') return;
    let folder = current.children.find(
      (child: FileItem) => child.type === 'folder' && child.name === segmentName
    );

    if (!folder) {
      folder = {
        name: segmentName,
        type: 'folder',
        path: current.path ? `${current.path}/${segmentName}` : segmentName,
        children: [],
      };

      current.children.push(folder);
    }

    current = folder;
  });
  return current;
}

function createOrUpdateFile(
  parent: FileItem,
  fileName: string,
  content: string,
  fullPath: string
): void {
  if (parent.type !== 'folder') return;

  const existingFile = parent.children.find(
    (child: FileItem) => child.type === 'file' && child.name === fileName
  );

  if (existingFile && existingFile.type === 'file') {
    existingFile.content = content;
  } else {
    const newFile: FileItem = {
      name: fileName,
      type: 'file',
      path: fullPath,
      content,
    };

    parent.children.push(newFile);
  }
}
