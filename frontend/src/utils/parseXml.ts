import type { Action, Artifact } from "../types";

export function parseXml(response: string): Artifact | null {
  // Find the boltArtifact tag
  const artifactOpen = response.match(
    /<boltArtifact\s+([^>]*)>/
  );
  if (!artifactOpen) return null;

  const artifactAttrs = artifactOpen[1];
  const idMatch = artifactAttrs.match(/id="([^"]*)"/);
  const titleMatch = artifactAttrs.match(/title="([^"]*)"/);

  const id = idMatch?.[1] ?? "unknown";
  const title = titleMatch?.[1] ?? "Untitled";

  // Extract content between <boltArtifact> and </boltArtifact>
  const startIdx = artifactOpen.index! + artifactOpen[0].length;
  const endIdx = response.indexOf("</boltArtifact>", startIdx);
  if (endIdx === -1) return null;

  const body = response.substring(startIdx, endIdx);

  // Extract all boltAction elements
  const actionRegex = /<boltAction\s+([^>]*)>([\s\S]*?)<\/boltAction>/g;
  const actions: Action[] = [];
  let match;
  let actionId = 1;

  while ((match = actionRegex.exec(body)) !== null) {
    const attrs = match[1];
    const content = match[2];

    const typeMatch = attrs.match(/type="([^"]*)"/);
    const filePathMatch = attrs.match(/filePath="([^"]*)"/);

    const type = typeMatch?.[1] as "file" | "shell";
    const filePath = filePathMatch?.[1];

    actions.push({
      id: actionId++,
      title:
        type === "file"
          ? `Create ${filePath}`
          : content.trim().substring(0, 50),
      type,
      filePath,
      content: content.replace(/^\n/, "").replace(/\n$/, ""),
    });
  }

  return { id, title, actions };
}
