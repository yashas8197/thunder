import Hero from "../components/landing/Hero";
import PromptInput from "../components/landing/PromptInput";

function Landing() {
  return (
    <main className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center">
      <section className="w-full max-w-3xl px-6 text-center">
        <Hero />
        <PromptInput />
      </section>
    </main>
  );
}

export default Landing;
