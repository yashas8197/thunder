import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "./store";
import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axios";
import type { Artifact } from "../types";
import { parseXml } from "../utils/parseXml";

export const generateTemplete = createAsyncThunk(
  "builder/templete",
  async (prompt: string, { rejectWithValue }) => {
    try {
      const res = await api.post("/templete", { prompt: prompt.trim() });
      console.log(res);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || "Something went wrong");
    }
  },
);

export const generateChat = createAsyncThunk(
  "builder/chat",
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = (getState() as RootState).builder;
      const { prompts, prompt } = state;

      // Build messages from however many prompts the backend returned
      const messages: { role: "user" | "assistant"; content: string }[] = [];
      if (prompts) {
        for (const p of prompts) {
          messages.push({ role: "user", content: p });
        }
      }
      messages.push({ role: "user", content: prompt });

      const res = await api.post("/chat", { messages });
      const xmlResponse: string = res.data.response;

      const artifact = parseXml(xmlResponse);
      if (!artifact) {
        return rejectWithValue("Failed to parse AI response");
      }

      return artifact;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Chat generation failed",
      );
    }
  },
);

// Define a type for the slice state
interface BuilderState {
  prompt: string;
  loading: boolean;
  error: string | null;
  uiPrompts?: Artifact[];
  prompts?: string[];
  chatLoading: boolean;
  chatError: string | null;
  generatedArtifact?: Artifact | null;
}

// Define the initial state using that type
const initialState: BuilderState = {
  prompt: "",
  error: null as string | null,
  loading: false,
  uiPrompts: [],
  prompts: [],
  chatLoading: false,
  chatError: null,
  generatedArtifact: null,
};

export const builderSlice = createSlice({
  name: "builder",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setBuilderPrompt: (state, action: PayloadAction<string>) => {
      state.prompt = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(generateTemplete.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(generateTemplete.fulfilled, (state, action) => {
        state.loading = false;
        state.uiPrompts = action.payload.uiPrompts;
        state.prompts = action.payload.prompts;
      })
      .addCase(generateTemplete.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(generateChat.pending, (state) => {
        state.chatLoading = true;
        state.chatError = null;
      })
      .addCase(generateChat.fulfilled, (state, action) => {
        state.chatLoading = false;
        state.generatedArtifact = action.payload;
      })
      .addCase(generateChat.rejected, (state, action) => {
        state.chatLoading = false;
        state.chatError = action.payload as string;
      });
  },
});

export const { setBuilderPrompt } = builderSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectPrompt = (state: RootState) => state.builder.prompt;

export default builderSlice.reducer;
