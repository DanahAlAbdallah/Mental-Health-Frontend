import sunflowerImage from "../../assets/sunflower.jpg";

function Hero() {
  return (
    <section className="grid items-center gap-10 bg-background-soft px-10 py-20 md:grid-cols-2">
      <div>
        <p className="mb-3 text-xs font-semibold tracking-widest text-muted">
          MENTAL HEALTH SUPPORT
        </p>

        <h1
          style={{ fontFamily: "'Lora', serif" }}
          className="mb-5 text-5xl leading-tight text-heading"
        >
          It's okay to not be okay.
          <br />
          You can still bloom.
        </h1>

        <p className="mb-8 max-w-md text-text">
          Just like a sunflower, everyone goes through dark days. What matters
          is that you have the strength to rise again.
        </p>

        <button className="rounded-full bg-accent px-6 py-3 font-semibold text-button-text transition-colors hover:bg-accent-hover">
          Start Your Journey →
        </button>
      </div>

      <div className="flex justify-center">
        <img
          src={sunflowerImage}
          alt="Sunflowers in bloom"
          className="w-full max-w-md rounded-2xl object-cover"
        />
      </div>
    </section>
  );
}

export default Hero;
