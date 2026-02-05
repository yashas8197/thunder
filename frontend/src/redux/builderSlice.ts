import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "./store";
import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axios";

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

// Define a type for the slice state
interface BuilderState {
  prompt: string;
  loading: boolean;
  error: string | null;
  uiPrompts?: string[];
  prompts?: string[];
}

// Define the initial state using that type
const initialState: BuilderState = {
  prompt: "",
  error: null as string | null,
  loading: false,
  uiPrompts: [],
  prompts: [],
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
      });
  },
});

export const { setBuilderPrompt } = builderSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectPrompt = (state: RootState) => state.builder.prompt;

export default builderSlice.reducer;
