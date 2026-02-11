export const basePrompt = {
  id: "project-import",
  title: "Project Files",
  actions: [
    {
      id: 1,
      title: "Create index.js",
      type: "file",
      filePath: "index.js",
      content: `// run \`node index.js\` in the terminal

console.log(\`Hello Node.js v\${process.versions.node}!\`);
`
    },
    {
      id: 2,
      title: "Create package.json",
      type: "file",
      filePath: "package.json",
      content: `{
  "name": "node-starter",
  "private": true,
  "scripts": {
    "test": "echo \\"Error: no test specified\\" && exit 1"
  }
}
`
    }
  ]
};
