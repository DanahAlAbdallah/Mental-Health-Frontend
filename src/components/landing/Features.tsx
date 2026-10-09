function Features() {
  const items = [
    {
      icon: "🌻",
      title: "You're Not Alone",
      text: "Many people struggle with their mental health, even if it's not always visible.",
    },
    {
      icon: "🌱",
      title: "Get Support",
      text: "Professional help, kind people and safe spaces can make a difference.",
    },
    {
      icon: "☀️",
      title: "Small Steps Matter",
      text: "Healing isn't about being perfect, it's about progress, no matter how small.",
    },
    {
      icon: "🌻",
      title: "You Can Rise Again",
      text: "With the right support, joy, balance and hope can return — and you can bloom.",
    },
  ];


return (
  <section className="bg-background px-10 py-20">
    <div className="mx-auto grid max-w-6xl grid-cols-2 gap-10 text-center md:grid-cols-4">
      {items.map((item) => (
        <div key={item.title}>
          <div className="mb-4 text-5xl">{item.icon}</div>

          <h3
            style={{ fontFamily: "'Lora', serif" }}
            className="mb-2 text-lg text-heading"
          >
            {item.title}
          </h3>

          <p className="text-sm text-muted">{item.text}</p>
        </div>
      ))}
    </div>
  </section>
);
}

export default Features;
