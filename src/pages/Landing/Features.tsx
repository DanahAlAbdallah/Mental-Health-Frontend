import { useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check, Search, Sprout } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

// ---------- SMALL PREVIEWS OF THE REAL APP (DECORATIVE) ----------

// STEP 1: A MINI SIGN UP FORM
function SignupPreview() {
  return (
    <div className="space-y-4">
      <div data-mock className="flex items-center gap-3">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Sprout className="h-6 w-6" />
        </span>
        <div className="space-y-2">
          <div className="h-3 w-28 rounded-full bg-heading/15" />
          <div className="h-2.5 w-20 rounded-full bg-heading/10" />
        </div>
      </div>

      <div
        data-mock
        className="rounded-xl border border-border bg-background px-4 py-3 text-sm text-muted"
      >
        Full name
      </div>
      <div
        data-mock
        className="rounded-xl border border-border bg-background px-4 py-3 text-sm text-muted"
      >
        Email address
      </div>

      <div data-mock className="flex gap-2">
        <span className="rounded-full bg-primary px-4 py-1.5 text-xs font-semibold text-button-text">
          Client
        </span>
        <span className="rounded-full border border-border px-4 py-1.5 text-xs font-semibold text-muted">
          Therapist
        </span>
      </div>

      <div
        data-mock
        className="rounded-xl bg-accent py-3 text-center text-sm font-semibold text-heading"
      >
        Create account
      </div>
    </div>
  );
}

// STEP 2: A MINI LIST OF THERAPISTS
function TherapistsPreview() {
  const rows = [
    { tags: ["Anxiety", "Online"], active: true },
    { tags: ["Sleep", "In person"], active: false },
    { tags: ["Stress", "Online"], active: false },
  ];

  return (
    <div className="space-y-3">
      <div
        data-mock
        className="flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-3 text-sm text-muted"
      >
        <Search className="h-4 w-4" />
        Search therapists
      </div>

      {rows.map((row, index) => (
        <div
          key={index}
          data-mock
          className={`flex items-center gap-4 rounded-2xl border p-4 ${
            row.active ? "border-primary bg-primary/5" : "border-border"
          }`}
        >
          <span
            className={`h-12 w-12 shrink-0 rounded-full ${
              row.active ? "bg-accent" : "bg-accent/50"
            }`}
          />
          <div className="min-w-0 flex-1 space-y-2">
            <div className="h-3 w-32 rounded-full bg-heading/15" />
            <div className="flex gap-2">
              {row.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
          {row.active && (
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-button-text">
              <Check className="h-4 w-4" />
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

// STEP 3: A MINI BOOKING CALENDAR
function BookingPreview() {
  const days = [
    { name: "Mon", number: 12 },
    { name: "Tue", number: 13 },
    { name: "Wed", number: 14 },
    { name: "Thu", number: 15 },
  ];
  const slots = ["10:00", "11:00", "14:00", "16:00"];

  return (
    <div className="space-y-4">
      <div data-mock className="grid grid-cols-4 gap-2">
        {days.map((day) => (
          <div
            key={day.name}
            className={`rounded-xl border py-3 text-center ${
              day.number === 14
                ? "border-primary bg-primary text-button-text"
                : "border-border text-heading"
            }`}
          >
            <p className="text-xs opacity-70">{day.name}</p>
            <p className="text-lg font-semibold">{day.number}</p>
          </div>
        ))}
      </div>

      <div data-mock className="grid grid-cols-2 gap-2">
        {slots.map((slot) => (
          <div
            key={slot}
            className={`rounded-xl border py-2.5 text-center text-sm font-semibold ${
              slot === "11:00"
                ? "border-accent bg-accent text-heading"
                : "border-border text-heading"
            }`}
          >
            {slot}
          </div>
        ))}
      </div>

      <div
        data-confirm
        className="flex items-center justify-center gap-2 rounded-xl bg-green-100 py-3 text-sm font-semibold text-green-800"
      >
        <Check className="h-4 w-4" />
        Session booked
      </div>
    </div>
  );
}

// ---------- THE THREE STEPS ----------

const STEPS = [
  {
    title: "Sign up",
    text: "Create your free account.",
    preview: <SignupPreview />,
  },
  {
    title: "Find a therapist",
    text: "Browse and choose who feels right.",
    preview: <TherapistsPreview />,
  },
  {
    title: "Start talking",
    text: "Book a session at your pace.",
    preview: <BookingPreview />,
  },
];

function Features() {
  const root = useRef<HTMLElement>(null);
  const head = useRef<HTMLDivElement>(null);
  const list = useRef<HTMLDivElement>(null);
  const cta = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      // (SKIPPED FOR PEOPLE WHO PREFER LESS MOTION)
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // TITLE FADES UP, THEN THE YELLOW MARKER DRAWS
        gsap.from(head.current, {
          y: 24,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
          clearProps: "transform",
          scrollTrigger: { trigger: head.current, start: "top 85%", once: true },
        });
        gsap.from("[data-feat='marker']", {
          scaleX: 0,
          transformOrigin: "left center",
          duration: 0.8,
          delay: 0.35,
          ease: "power2.inOut",
          scrollTrigger: { trigger: head.current, start: "top 85%", once: true },
        });

        // EACH STEP TELLS ITS OWN SMALL STORY WHEN IT SCROLLS INTO VIEW
        const sideShift = window.innerWidth >= 768 ? 70 : 0;
        const rows = gsap.utils.toArray<HTMLElement>("[data-row]");

        rows.forEach((row, index) => {
          const q = gsap.utils.selector(row);
          const fromLeft = index % 2 === 0 ? -sideShift : sideShift;

          const tl = gsap.timeline({
            defaults: { ease: "power3.out" },
            scrollTrigger: { trigger: row, start: "top 78%", once: true },
          });

          tl.from(q("[data-text]"), {
            x: fromLeft,
            y: sideShift === 0 ? 30 : 0,
            opacity: 0,
            duration: 0.9,
            clearProps: "transform",
          })
            .from(
              q("[data-card]"),
              {
                x: -fromLeft,
                y: sideShift === 0 ? 30 : 0,
                opacity: 0,
                duration: 0.9,
                clearProps: "transform",
              },
              0,
            )
            .from(
              q("[data-node]"),
              { scale: 0, duration: 0.5, ease: "back.out(2.5)" },
              0.2,
            )
            // THE ITEMS INSIDE THE PREVIEW APPEAR ONE BY ONE
            .from(
              q("[data-mock]"),
              {
                y: 14,
                opacity: 0,
                duration: 0.5,
                stagger: 0.12,
                clearProps: "transform",
              },
              0.5,
            )
            // THE FINAL "BOOKED" MESSAGE POPS IN LAST
            .from(
              q("[data-confirm]"),
              { scale: 0.7, opacity: 0, duration: 0.5, ease: "back.out(2)" },
              ">-0.1",
            );

          // EACH PREVIEW FLOATS GENTLY, A LITTLE OUT OF STEP WITH THE OTHERS
          gsap.to(q("[data-float]"), {
            y: -8,
            duration: 2.6 + index * 0.4,
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1,
          });
        });

        // THE LINE IN THE MIDDLE DRAWS ITSELF AS YOU SCROLL (DESKTOP)
        gsap.fromTo(
          "[data-feat='line']",
          { scaleY: 0 },
          {
            scaleY: 1,
            transformOrigin: "top center",
            ease: "none",
            scrollTrigger: {
              trigger: list.current,
              start: "top 65%",
              end: "bottom 60%",
              scrub: 0.6,
            },
          },
        );

        // THE BUTTON FADES UP LAST
        gsap.from(cta.current, {
          y: 20,
          opacity: 0,
          duration: 0.7,
          ease: "power3.out",
          clearProps: "transform",
          scrollTrigger: { trigger: cta.current, start: "top 92%", once: true },
        });
      });
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      className="relative isolate overflow-hidden bg-white px-6 py-20 sm:py-28"
    >
      {/* BACKGROUND: DOT PATTERN AND SOFT SHAPES */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 opacity-70"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgb(0 0 0 / 0.07) 1.5px, transparent 1.5px)",
          backgroundSize: "24px 24px",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 top-24 -z-10 h-96 w-96 rounded-full bg-accent/50 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 bottom-24 -z-10 h-96 w-96 rounded-full bg-primary/15 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 -top-20 -z-10 h-72 w-72 rounded-full border-2 border-heading/10"
      />

      <div className="mx-auto max-w-6xl">
        {/* TITLE */}
        <div ref={head} className="mb-16 text-center sm:mb-24">
          <h2 className="text-4xl font-semibold tracking-tight text-heading sm:text-5xl lg:text-6xl">
            Getting started is{" "}
            <span className="relative inline-block">
              <span className="relative z-10">simple</span>
              <span
                data-feat="marker"
                aria-hidden="true"
                className="absolute -inset-x-1 bottom-1 z-0 h-3 rounded-full bg-accent sm:h-5"
              />
            </span>
          </h2>
        </div>

        {/* STEPS */}
        <div ref={list} className="relative">
          {/* LINE IN THE MIDDLE (DESKTOP ONLY) */}
          <div
            aria-hidden="true"
            className="absolute bottom-0 left-1/2 top-0 hidden w-0.5 -translate-x-1/2 md:block"
          >
            <div className="absolute inset-0 rounded-full bg-heading/10" />
            <div
              data-feat="line"
              className="absolute inset-0 rounded-full bg-primary"
            />
          </div>

          <ol className="space-y-16 md:space-y-28">
            {STEPS.map((step, index) => {
              const textOnLeft = index % 2 === 0;

              return (
                <li
                  key={step.title}
                  data-row
                  className="relative grid items-center gap-8 md:grid-cols-2 md:gap-x-28"
                >
                  {/* NUMBER ON THE MIDDLE LINE */}
                  <span
                    data-node
                    aria-hidden="true"
                    className="absolute left-1/2 top-1/2 z-10 hidden h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-primary text-xl font-bold text-button-text shadow-lg ring-8 ring-accent/40 md:flex"
                  >
                    {index + 1}
                  </span>

                  {/* TEXT */}
                  <div
                    data-text
                    className={`flex flex-col ${
                      textOnLeft
                        ? "md:items-end md:text-right"
                        : "md:order-2 md:items-start md:text-left"
                    }`}
                  >
                    <span className="mb-4 inline-flex w-fit rounded-full bg-heading/10 px-3 py-1 text-xs font-bold tracking-widest text-heading">
                      STEP {index + 1}
                    </span>
                    <h3 className="mb-3 text-3xl font-semibold text-heading sm:text-4xl">
                      {step.title}
                    </h3>
                    <p className="max-w-sm text-lg leading-8 text-heading/70">
                      {step.text}
                    </p>
                  </div>

                  {/* PREVIEW CARD */}
                  <div
                    data-card
                    className={textOnLeft ? "md:justify-self-start" : "md:justify-self-end"}
                  >
                    <div data-float>
                      <div
                        aria-hidden="true"
                        className={`w-full max-w-md rounded-3xl border border-border bg-surface p-6 shadow-xl ${
                          textOnLeft ? "rotate-1" : "-rotate-1"
                        }`}
                      >
                        {step.preview}
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>

        {/* CALL TO ACTION */}
        <div ref={cta} className="mt-20 text-center sm:mt-28">
          <Link
            to="/signup"
            className="group inline-flex items-center gap-2 rounded-full bg-primary px-9 py-4 text-lg font-semibold text-button-text shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary-hover hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2"
          >
            Start your journey
            <ArrowRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Features;
