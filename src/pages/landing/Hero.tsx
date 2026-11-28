import { useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowDown, ArrowRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import yellowLineVideo from "../../assets/yellow_line_loop.webm";
import { useAuth } from "../../context/AuthContext";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const highlights = [
  "Online or in person",
  "Book in minutes",
  "Choose your therapist",
];

// ONE WORD, SPLIT INTO LETTERS. THE BOX CLIPS THE LETTERS, SO THEY APPEAR
// TO RISE UP FROM BELOW WHEN THE PAGE OPENS
function Word({ text, className = "" }: { text: string; className?: string }) {
  return (
    <span
      className={`inline-block overflow-hidden pb-[0.08em] align-bottom ${className}`}
    >
      {text.split("").map((char, index) => (
        <span key={index} data-hero="char" className="inline-block">
          {char}
        </span>
      ))}
    </span>
  );
}

function Hero() {
  const root = useRef<HTMLElement>(null);
  const videoLayer = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      // 1) ENTRANCE AND SCROLL EFFECTS
      // (SKIPPED FOR PEOPLE WHO PREFER LESS MOTION)
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

        // THE VIDEO BACKGROUND ZOOMS OUT SLOWLY WHILE FADING IN
        tl.from(
          "[data-hero='bg']",
          { opacity: 0, scale: 1.2, duration: 1.8 },
          0,
        )
          .from(
            "[data-hero='eyebrow']",
            { y: 16, opacity: 0, duration: 0.7 },
            0.2,
          )
          .from(
            "[data-hero='char']",
            { yPercent: 120, rotate: 6, duration: 1, stagger: 0.03 },
            0.35,
          )
          .from(
            "[data-hero='marker']",
            {
              scaleX: 0,
              transformOrigin: "left center",
              duration: 0.8,
              ease: "power2.inOut",
            },
            "-=0.9",
          )
          .from(
            "[data-hero='fade']",
            {
              y: 24,
              opacity: 0,
              duration: 0.8,
              stagger: 0.15,
              clearProps: "transform",
            },
            "-=0.5",
          )
          .from(
            "[data-hero='cue']",
            { opacity: 0, y: -10, duration: 0.6 },
            "-=0.3",
          );

        // THE SCROLL CUE BOUNCES
        gsap.to("[data-hero='cue-arrow']", {
          y: 6,
          duration: 0.9,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        });

        // WHEN SCROLLING DOWN, THE TEXT AND THE VIDEO MOVE AT DIFFERENT SPEEDS
        gsap.to("[data-hero='scroll-text']", {
          yPercent: -10,
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
        gsap.to("[data-hero='scroll-video']", {
          yPercent: 14,
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      });

      // 2) MOUSE PARALLAX ON THE VIDEO (ONLY FOR MOUSE USERS, NOT TOUCH SCREENS)
      mm.add(
        "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
        () => {
          const section = root.current;
          const layer = videoLayer.current;
          if (!section || !layer) return;

          const moveX = gsap.quickTo(layer, "x", {
            duration: 1.2,
            ease: "power3",
          });
          const moveY = gsap.quickTo(layer, "y", {
            duration: 1.2,
            ease: "power3",
          });

          function onMove(e: MouseEvent) {
            moveX((e.clientX / window.innerWidth - 0.5) * -40);
            moveY((e.clientY / window.innerHeight - 0.5) * -40);
          }

          section.addEventListener("mousemove", onMove);
          return () => section.removeEventListener("mousemove", onMove);
        },
      );
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      className="relative isolate flex min-h-[calc(100svh-4.5rem)] items-center overflow-hidden bg-gradient-to-br from-primary to-primary-hover px-6 py-20 text-button-text sm:px-10"
    >
      {/* VIDEO BACKGROUND */}
      <div
        data-hero="scroll-video"
        aria-hidden="true"
        className="absolute inset-0 -z-10"
      >
        <div data-hero="bg" className="h-full w-full">
          <div ref={videoLayer} className="h-full w-full">
            <video
              src={yellowLineVideo}
              autoPlay
              loop
              muted
              playsInline
              className="h-full w-full scale-110 object-cover object-right"
            />
          </div>
        </div>

        {/* DARKER ON THE LEFT, SO THE TEXT STAYS EASY TO READ */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 via-primary/40 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-primary-hover/60 to-transparent" />
      </div>

      {/* CONTENT */}
      <div className="mx-auto w-full max-w-7xl">
        <div data-hero="scroll-text" className="max-w-3xl">
          <p
            data-hero="eyebrow"
            className="bg-white mb-6 inline-flex items-center gap-2 rounded-full border border-button-text/30 bg-button-text/10 px-4 py-1.5 text-xs font-semibold tracking-widest backdrop-blur"
          >
            <span className="h-2 w-2 rounded-full bg-accent" />
            MENTAL HEALTH SUPPORT
          </p>

          <h1
            aria-label="It's okay to not be okay. You can still bloom."
            className="text-white mb-10 text-5xl font-semibold leading-[1] tracking-tight sm:text-6xl lg:text-7xl xl:text-8xl"
          >
            <span aria-hidden="true">
              <Word text="It's" className="mr-[0.22em]" />
              <Word text="okay" className="mr-[0.22em]" />
              <Word text="to" className="mr-[0.22em]" />
              {/* THE WORD "NOT" GETS A YELLOW MARKER THAT DRAWS ITSELF */}
              <span className="relative mr-[0.22em] inline-block">
                <Word
                  text="not"
                  className="text-white relative z-10 text-heading"
                />
                <span
                  data-hero="marker"
                  className="absolute -inset-x-[0.06em] bottom-[0.1em] z-0 h-[0.4em] rounded-full bg-accent"
                />
              </span>
              <Word text="be" className="mr-[0.22em]" />
              <Word text="okay." />
              <br />
              <Word text="You" className="mr-[0.22em]" />
              <Word text="can" className="mr-[0.22em]" />
              <Word text="still" className="mr-[0.22em]" />
              <Word text="bloom." className="text-accent" />
            </span>
          </h1>

          <div data-hero="fade" className="flex flex-wrap items-center gap-6">
            <Link
              to={user ? "/therapists" : "/login"}
              state={{ from: "/therapists" }}
              className="group inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3.5 font-semibold text-heading shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:bg-accent-hover hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
            >
              Book your session
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>

            <Link
              to="/articles"
              className="text-sm font-semibold underline decoration-accent decoration-2 underline-offset-4 transition-opacity hover:opacity-80"
            >
              Read our articles
            </Link>
          </div>

          <ul data-hero="fade" className="mt-10 flex flex-wrap gap-x-6 gap-y-2">
            {highlights.map((item) => (
              <li
                key={item}
                className="flex items-center gap-2 text-sm opacity-90"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* SCROLL CUE */}
      <button
        data-hero="cue"
        type="button"
        aria-label="Scroll down"
        onClick={() =>
          window.scrollBy({
            top: window.innerHeight * 0.85,
            behavior: "smooth",
          })
        }
        className="absolute bottom-6 left-1/2 hidden h-11 w-11 -translate-x-1/2 cursor-pointer items-center justify-center rounded-full border border-button-text/30 bg-button-text/10 backdrop-blur transition-colors hover:border-accent hover:bg-accent hover:text-heading md:flex"
      >
        <ArrowDown data-hero="cue-arrow" className="h-4 w-4" />
      </button>
    </section>
  );
}

export default Hero;
