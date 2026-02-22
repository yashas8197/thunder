import "dotenv/config";
import express from "express";
import { basePrompt as nodeBasePrompt } from "./defaults/node.js";
import { basePrompt as reactBasePrompt } from "./defaults/react.js";
import cors from "cors";
import Anthropic from "@anthropic-ai/sdk";
import type { TextBlock } from "@anthropic-ai/sdk/resources";
import { BASE_PROMPT, getSystemPrompt } from "./prompts.js";
const anthropic = new Anthropic();
const app = express();
app.use(express.json());
app.use(cors());

app.post("/templete", async (req, res) => {
  const prompt = req.body.prompt;
  const response = await anthropic.messages.create({
    model: "claude-3-haiku-20240307",
    max_tokens: 200,
    system:
      "Return either node or react based on what do you think this project should be. Only return a single word either 'node' or 'react'. Do not return anything extra",
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  const answer = (response.content[0] as TextBlock).text;

  if (answer == "react") {
    return res.json({
      prompts: [
        BASE_PROMPT,
        `Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${JSON.stringify(reactBasePrompt)}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`,
      ],
      uiPrompts: [reactBasePrompt],
    });
  }

  if (answer === "node") {
    return res.json({
      prompts: [
        `Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${JSON.stringify(nodeBasePrompt)}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`,
      ],
      uiPrompts: [nodeBasePrompt],
    });
  }

  return res.status(403).json({ message: "You cant access this" });
});

app.post("/chat", async (req, res) => {
  const messages = req.body.messages;
  const response = await anthropic.messages.create({
    messages: messages,
    model: "claude-sonnet-4-5-20250929",
    max_tokens: 8000,
    system: getSystemPrompt(),
  });

  console.log(response);

  res.json({
    response: (response.content[0] as TextBlock)?.text,
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`server connected to port http://localhost:${PORT}`);
});
