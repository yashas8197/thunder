import { useEffect, useState, useRef } from "react";
import { Loader2 } from "lucide-react";
import { useWebContainer } from "../../hooks/webContainer";

interface PreviewPaneProps {
  webContainerFiles: Record<string, any>;
}

function PreviewPane({ webContainerFiles }: PreviewPaneProps) {
  const webContainer = useWebContainer();
  const [url, setUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (!webContainer || !webContainerFiles || Object.keys(webContainerFiles).length === 0) {
      return;
    }

    // Prevent re-initialization
    if (hasInitialized.current) {
      return;
    }

    async function setupContainer() {
      if (!webContainer) return;

      try {
        setIsLoading(true);
        setError(null);
        hasInitialized.current = true;

        console.log("Mounting files to WebContainer...");
        await webContainer.mount(webContainerFiles);

        console.log("Installing dependencies...");
        const installProcess = await webContainer.spawn("npm", ["install"]);
        
        const installExitCode = await installProcess.exit;
        if (installExitCode !== 0) {
          throw new Error("npm install failed");
        }

        console.log("Starting dev server...");
        const devProcess = await webContainer.spawn("npm", ["run", "dev"]);

        // Listen for server ready event
        webContainer.on("server-ready", (port, url) => {
          console.log("Server ready on port:", port, "URL:", url);
          setUrl(url);
          setIsLoading(false);
        });

        // Stream output to console
        devProcess.output.pipeTo(
          new WritableStream({
            write(data) {
              console.log("Dev server:", data);
            },
          })
        );

      } catch (err) {
        console.error("Error setting up WebContainer:", err);
        setError(err instanceof Error ? err.message : "Failed to setup container");
        setIsLoading(false);
        hasInitialized.current = false;
      }
    }

    setupContainer();
  }, [webContainer, webContainerFiles]);

  return (
    <section className="flex-1 flex flex-col bg-[var(--color-bg-secondary)] overflow-hidden">
      <div className="h-10 flex items-center px-4 border-b border-[var(--color-border)]">
        <span className="text-xs text-[var(--color-text-muted)]">Preview</span>
        {url && (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-auto text-xs text-blue-500 hover:underline"
          >
            Open in new tab
          </a>
        )}
      </div>
      <div className="flex-1 flex items-center justify-center relative">
        {isLoading && (
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="w-6 h-6 animate-spin text-[var(--color-text-muted)]" />
            <p className="text-[var(--color-text-muted)] text-sm">
              Setting up preview...
            </p>
          </div>
        )}
        
        {error && (
          <div className="flex flex-col items-center gap-2 text-red-500">
            <p className="text-sm">Error: {error}</p>
            <button
              onClick={() => {
                hasInitialized.current = false;
                setError(null);
                window.location.reload();
              }}
              className="text-xs px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Retry
            </button>
          </div>
        )}

        {url && !isLoading && (
          <iframe
            ref={iframeRef}
            src={url}
            className="w-full h-full border-0"
            title="Preview"
          />
        )}

        {!url && !isLoading && !error && (
          <p className="text-[var(--color-text-muted)] text-sm">
            Waiting for files...
          </p>
        )}
      </div>
    </section>
  );
}

export default PreviewPane;