import { Editor, type Monaco } from "@monaco-editor/react";
import type { FileItem } from "../../types";

interface CodeEditorProps {
  selectedFile: FileItem | null;
}

function handleEditorWillMount(monaco: Monaco) {
  const diagnosticsOptions = {
    noSemanticValidation: true,
    noSyntaxValidation: true,
  };
  monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions(diagnosticsOptions);
  monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions(diagnosticsOptions);

  const compilerOptions = {
    jsx: monaco.languages.typescript.JsxEmit.ReactJSX,
    allowNonTsExtensions: true,
    target: monaco.languages.typescript.ScriptTarget.ESNext,
    module: monaco.languages.typescript.ModuleKind.ESNext,
    moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
  };
  monaco.languages.typescript.typescriptDefaults.setCompilerOptions(compilerOptions);
  monaco.languages.typescript.javascriptDefaults.setCompilerOptions(compilerOptions);
}

function CodeEditor({ selectedFile }: CodeEditorProps) {
  const getLanguage = (filename: string): string => {
    const ext = filename.split('.').pop()?.toLowerCase();
    const languageMap: { [key: string]: string } = {
      'js': 'javascript',
      'jsx': 'javascript',
      'ts': 'typescript',
      'tsx': 'typescript',
      'json': 'json',
      'html': 'html',
      'css': 'css',
      'scss': 'scss',
      'md': 'markdown',
      'py': 'python',
      'java': 'java',
      'cpp': 'cpp',
      'c': 'c',
      'sh': 'shell',
      'yml': 'yaml',
      'yaml': 'yaml',
      'xml': 'xml',
      'sql': 'sql',
    };
    return languageMap[ext || ''] || 'plaintext';
  };

  return (
    <section className="flex-1 flex flex-col bg-[var(--color-bg)] overflow-hidden">
      {selectedFile ? (
        <>
          <div className="px-4 py-2 border-b border-[var(--color-border)] bg-[var(--color-bg-secondary)]">
            <p className="text-sm font-medium text-[var(--color-text)]">
              {selectedFile.name}
            </p>
            <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
              {selectedFile.path}
            </p>
          </div>
          <Editor
            height="100%"
            language={getLanguage(selectedFile.name)}
            theme="vs-dark"
            value={selectedFile.content || ''}
            beforeMount={handleEditorWillMount}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              lineNumbers: 'on',
              roundedSelection: false,
              scrollBeyondLastLine: false,
              readOnly: false,
              automaticLayout: true,
            }}
          />
        </>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-sm text-[var(--color-text-muted)]">
            Select a file to view its contents
          </p>
        </div>
      )}
    </section>
  );
}

export default CodeEditor;