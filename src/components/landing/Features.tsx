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
    <section className="bg-[#FBF3E4] px-10 py-20">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-10 max-w-6xl mx-auto text-center">
        {items.map((item) => (
          <div key={item.title}>
            <div className="text-5xl mb-4">{item.icon}</div>
            <h3
              style={{ fontFamily: "'Lora', serif" }}
              className="text-lg text-[#2F4B42] mb-2"
            >
              {item.title}
            </h3>
            <p className="text-sm text-[#6B7A72]">{item.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Features;
