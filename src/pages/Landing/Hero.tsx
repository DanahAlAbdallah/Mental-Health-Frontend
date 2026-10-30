import { Link } from "react-router-dom";
import yellowLineVideo from "../../assets/yellow_line_loop.webm";

function Hero() {
  // HERO DESIGN
  return (
    <section className="grid items-center gap-10 bg-background-soft px-10 py-20 md:grid-cols-2">
      {/* TEXT */}
      <div>
        <p className="mb-3 text-xs font-semibold tracking-widest text-muted">
          MENTAL HEALTH SUPPORT
        </p>

        <h1 className="mb-5 text-5xl leading-tight text-heading">
          It's okay to not be okay.
          <br />
          You can still bloom.
        </h1>

        <p className="mb-8 max-w-md text-text">
          Just like a sunflower, everyone goes through dark days. What matters
          is that you have the strength to rise again.
        </p>

        <Link
          to="/therapists"
          className="inline-block rounded-full bg-accent px-6 py-3 font-semibold text-white transition-colors hover:bg-accent-hover"
        >
          Book your session →
        </Link>
      </div>

      {/* ANIMATED LINE */}
      <div className="flex justify-center">
        <video
          src={yellowLineVideo}
          autoPlay
          loop
          muted
          playsInline
          aria-hidden="true"
          className="w-full max-w-md object-contain"
        />
      </div>
    </section>
  );
}

export default Hero;
