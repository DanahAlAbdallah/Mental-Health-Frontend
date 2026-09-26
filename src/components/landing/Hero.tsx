

import sunflowerImage from '../../assets/sunflower.jpg';

function Hero() {
  return (
    <section className="bg-gradient-to-b from-sky-100 to-sky-50 px-10 py-20 grid md:grid-cols-2 gap-10 items-center">
      <div>
        <p className="text-xs tracking-widest font-semibold text-[#6B7A72] mb-3">
          MENTAL HEALTH SUPPORT
        </p>
        <h1
          style={{ fontFamily: "'Lora', serif" }}
          className="text-5xl text-[#2F4B42] leading-tight mb-5"
        >
          It's okay to not be okay.
          <br />
          You can still bloom.
        </h1>
        <p className="text-[#4A5751] mb-8 max-w-md">
          Just like a sunflower, everyone goes through dark days. What matters
          is that you have the strength to rise again.
        </p>
        <button className="bg-amber-400 hover:bg-amber-500 text-[#3D2B0F] font-semibold px-6 py-3 rounded-full">
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
