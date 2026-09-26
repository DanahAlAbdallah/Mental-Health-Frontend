function ClosingBanner() {
  return (
    <section className="bg-gradient-to-b from-sky-50 to-sky-100 px-10 py-16 text-center">
      <p
        className="text-heading text-2xl italic max-w-xl mx-auto"
        style={{ fontFamily: "'Lora', serif" }}
      >
        Even after the darkest days...
        <br />
        you can still bloom.
      </p>
      <div className="w-16 h-0.5 bg-primary mx-auto mt-6"></div>
    </section>
  );
}

export default ClosingBanner;
