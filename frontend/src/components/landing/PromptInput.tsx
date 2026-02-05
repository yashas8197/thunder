import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../redux/hooks";
import { setBuilderPrompt } from "../../redux/builderSlice";

function PromptInput() {
  const navigate = useNavigate();
  const [promptValue, setPromptValue] = useState("");
  const dispatch = useAppDispatch();

  const handleSubmit = () => {
    dispatch(setBuilderPrompt(promptValue));
    navigate("/builder");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  return (
    <div className="flex items-center gap-3 w-full bg-[var(--color-panel)] border border-[var(--color-border)] rounded-2xl p-2 pl-5 transition-colors focus-within:border-[var(--color-border-hover)]">
      <input
        type="text"
        placeholder="Let's build an MVP for my startup that..."
        className="flex-1 bg-transparent text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] text-base sm:text-lg outline-none"
        onKeyDown={handleKeyDown}
        onChange={(e) => setPromptValue(e.target.value)}
      />
      <button
        onClick={handleSubmit}
        className="px-5 py-3 bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white font-medium rounded-xl transition-colors cursor-pointer"
      >
        Build
      </button>
    </div>
  );
}

export default PromptInput;
