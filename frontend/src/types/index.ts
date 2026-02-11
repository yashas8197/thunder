export interface Action {
  id: number;
  title: string;
  type: "file" | "shell";
  filePath?: string;
  content: string;
}

export interface Artifact {
  id: string;
  title: string;
  actions: Action[];
}

export interface FileItem {
  name: string;
  type: "file" | "folder";
  children?: FileItem[];
  content?: string;
  path: string;
}

export interface FileViewerProps {
  file: FileItem | null;
  onClose: () => void;
}
