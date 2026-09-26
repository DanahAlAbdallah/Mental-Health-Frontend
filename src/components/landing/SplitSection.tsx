function SplitSection() {
  return (
    <section className="bg-background-soft px-10 py-20 grid md:grid-cols-2 gap-12 items-center">
      <div className="flex justify-center text-9xl">🧘</div>
      <div>
        <p className="text-xs tracking-widest font-semibold text-muted mb-3">
          YOU'RE NOT ALONE
        </p>
        <h2 className="text-3xl text-heading mb-5">
          Healing looks different for everyone.
        </h2>
        <p className="text-text mb-8 max-w-md">
          Whether you're facing stress, anxiety, sadness or just feeling lost —
          your feelings are valid, and support is here.
        </p>
        <button className="border-2 border-heading text-heading font-medium px-6 py-3 rounded-full hover:bg-heading hover:text-white transition">
          Learn More →
        </button>
      </div>
    </section>
  );
}

export default SplitSection;
