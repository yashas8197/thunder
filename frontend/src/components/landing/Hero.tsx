function Hero() {
  return (
    <>
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[var(--color-text-primary)] mb-4">
        What will you <span className="text-[var(--color-accent)]">build</span>{" "}
        today?
      </h1>
      <p className="text-lg sm:text-xl text-[var(--color-text-secondary)] mb-10">
        Describe your idea and let AI bring it to life.
      </p>
    </>
  );
}

export default Hero;
