// THE LAST SECTION OF THE LANDING PAGE: A SHORT CLOSING MESSAGE
function ClosingBanner() {
  //DESIGN
  return (
    <section className="bg-gradient-to-b from-sky-50 to-sky-100 px-10 py-16 text-center">
      <p className="mx-auto max-w-xl text-2xl italic text-heading">
        Even after the darkest days...
        <br />
        you can still bloom.
      </p>

      {/* DECORATIVE LINE */}
      <div className="mx-auto mt-6 h-0.5 w-16 bg-primary" />
    </section>
  );
}

export default ClosingBanner;