import { Link } from "react-router-dom";

function Features() {
  const steps = [
    { icon: "🌱", title: "Sign up", text: "Create your free account." },
    {
      icon: "🔎",
      title: "Find a therapist",
      text: "Browse and choose who feels right.",
    },
    {
      icon: "💬",
      title: "Start talking",
      text: "Book a session at your pace.",
    },
  ];

  return (
    <section className="bg-background px-6 py-20">
      <div className="mx-auto max-w-5xl text-center">
        <h2
          // style={{ fontFamily: "'Lora', serif" }}
          className="mb-12 text-3xl text-heading"
        >
          Getting started is simple
        </h2>

        <div className="grid grid-cols-1 gap-10 sm:grid-cols-3">
          {steps.map((step, i) => (
            <div key={step.title} className="flex flex-col items-center">
              <div className="relative mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/15 text-4xl">
                {step.icon}
                <span className="absolute -right-1 -top-1 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white">
                  {i + 1}
                </span>
              </div>
              <h3
                // style={{ fontFamily: "'Lora', serif" }}
                className="mb-1 text-lg text-heading"
              >
                {step.title}
              </h3>
              <p className="text-sm text-muted">{step.text}</p>
            </div>
          ))}
        </div>

        <Link
          to="/signup"
          className="mt-12 inline-block rounded-full bg-accent px-8 py-3 font-semibold text-white transition hover:bg-accent-hover"
        >
          Start your journey →
        </Link>
      </div>
    </section>
  );
}

export default Features;
  