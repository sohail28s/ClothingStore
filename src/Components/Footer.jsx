import React, { useRef, useEffect, useState } from 'react';

function Marquee({ text, speed = 60 }) {
  const trackRef = useRef(null);
  const [duration, setDuration] = useState(20);

  useEffect(() => {
    if (trackRef.current) {
      setDuration(trackRef.current.scrollWidth / 2 / speed);
    }
  }, [speed]);

  return (
    <div className="w-full overflow-hidden pointer-events-none select-none">
      <div
        ref={trackRef}
        style={{
          display: 'flex',
          whiteSpace: 'nowrap',
          animation: `marquee-scroll ${duration}s linear infinite`,
        }}
      >
        {[0, 1].map((i) => (
          <span
            key={i}
            className="font-central text-5xl md:text-[80px] font-bold uppercase shrink-0"
            style={{ paddingRight: '3rem' }}
          >
            {text}
          </span>
        ))}
      </div>
      <style>{`
        @keyframes marquee-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}

export default function Footer() {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer className="w-full text-[#fafafa] font-ballinger text-sm relative ">

      <div className="relative w-full overflow-hidden">

        <img
          src="https://pand.co/cdn/shop/files/Spring-4-desktop_0020_DSCF7604.jpg?v=1774449882&width=1440"
          alt=""
          className="absolute inset-0 w-full h-full object-cover hidden md:block z-0"
        />
        <img
          src="https://pand.co/cdn/shop/files/DROP3ECOMSIZED_0061_LeonSpring2-685_0000_DSCF2510.jpg?v=1774450024&width=430"
          alt=""
          className="absolute inset-0 w-full h-full object-cover md:hidden z-0"
        />
        <div className="absolute inset-0 bg-black/65 z-10" />

        <div className="relative z-20 max-w-[1680px] mx-auto px-4 lg:px-8">

          <div className="py-5 opacity-90">
            <Marquee text="A MINDSET FOR PURPOSEFUL LIVING" speed={60} />
          </div>

          <div className="border-t border-white/20 py-4">

            <div className="hidden md:flex items-center gap-3 w-full">
              <p className="font-central font-bold uppercase text-[11px] tracking-wide leading-tight shrink-0 w-[140px]">
                Sign up for tailored offers
              </p>

              <div className="w-px h-7 bg-white/20 shrink-0" />

              <span className="text-[10px] tracking-widest uppercase opacity-60 shrink-0 font-central font-bold whitespace-nowrap">
                I'm interested in:
              </span>

              <div className="flex gap-4 shrink-0">
                {['Unisex', 'Mens', 'Womens'].map((type) => (
                  <label key={type} className="flex items-center gap-1.5 cursor-pointer group">
                    <div className="w-3.5 h-3.5 border border-white rounded-sm group-hover:bg-white/20 transition-colors shrink-0">
                      <input type="checkbox" className="opacity-0 absolute w-0 h-0" />
                    </div>
                    <span className="uppercase text-[11px] tracking-wider">{type}</span>
                  </label>
                ))}
              </div>

              <div className="w-px h-7 bg-white/20 shrink-0" />

              <form
                className="flex flex-1 min-w-0 border border-white/40 bg-white/10 rounded-sm overflow-hidden focus-within:bg-white/15 transition-colors"
                onSubmit={(e) => e.preventDefault()}
              >
                <input
                  type="email"
                  placeholder="EMAIL ADDRESS"
                  className="flex-1 min-w-0 bg-transparent px-3 py-2 text-[11px] tracking-widest outline-none placeholder:text-white/40"
                  required
                />
                <button
                  type="submit"
                  className="px-5 font-central font-bold uppercase text-[11px] tracking-widest hover:bg-white hover:text-black transition-colors border-l border-white/30 shrink-0 whitespace-nowrap"
                >
                  Submit →
                </button>
              </form>
            </div>

            <div className="flex flex-col gap-3 md:hidden">
              <p className="font-central font-bold uppercase text-xs tracking-wide">Sign up for tailored offers</p>
              <div className="flex gap-5">
                {['Unisex', 'Mens', 'Womens'].map((type) => (
                  <label key={type} className="flex items-center gap-1.5 cursor-pointer">
                    <div className="w-3.5 h-3.5 border border-white rounded-sm shrink-0">
                      <input type="checkbox" className="opacity-0 absolute w-0 h-0" />
                    </div>
                    <span className="uppercase text-[11px] tracking-wider">{type}</span>
                  </label>
                ))}
              </div>
              <form
                className="flex border border-white/40 bg-white/10 rounded-sm overflow-hidden"
                onSubmit={(e) => e.preventDefault()}
              >
                <input
                  type="email"
                  placeholder="EMAIL ADDRESS"
                  className="flex-1 bg-transparent px-3 py-2.5 text-[11px] tracking-widest outline-none placeholder:text-white/40"
                  required
                />
                <button
                  type="submit"
                  className="px-4 font-central font-bold uppercase text-[11px] tracking-widest hover:bg-white hover:text-black transition-colors border-l border-white/30"
                >
                  Submit
                </button>
              </form>
            </div>
          </div>

          <div className="border-t border-white/20 py-5">

            <div className="hidden md:grid md:grid-cols-5 gap-5">

              <div className="flex flex-col gap-2">
                <h6 className="font-central text-[9px] uppercase tracking-widest opacity-40 font-bold mb-0.5">Links</h6>
                {['Rewards', 'Reviews', 'Contact', 'Account', 'Returns Policy'].map((l) => (
                  <a key={l} href="#" className="text-[11px] uppercase tracking-wider hover:opacity-60 transition-opacity w-fit">{l}</a>
                ))}
              </div>

              <div className="flex flex-col gap-2 pt-[17px]">
                {['Careers', 'Help Center', 'Returns Portal', 'Flagship Store'].map((l) => (
                  <a key={l} href="#" className="text-[11px] uppercase tracking-wider hover:opacity-60 transition-opacity w-fit">{l}</a>
                ))}
                <button className="text-[11px] uppercase tracking-wider hover:opacity-60 transition-opacity text-left w-fit">Live Chat</button>
              </div>

              <div className="flex flex-col gap-2">
                <h6 className="font-central text-[9px] uppercase tracking-widest opacity-40 font-bold mb-0.5">Socials</h6>
                {['Instagram', 'TikTok', 'YouTube', 'Flagship Store'].map((l) => (
                  <a key={l} href="#" className="text-[11px] uppercase tracking-wider hover:opacity-60 transition-opacity w-fit">{l}</a>
                ))}
              </div>

              <div className="flex flex-col gap-2">
                <h6 className="font-central text-[9px] uppercase tracking-widest opacity-40 font-bold mb-0.5">The Store</h6>
                <p className="text-[11px] tracking-wider opacity-80 uppercase leading-relaxed">103 Commercial St,<br />F11 Islamabad</p>
                <p className="text-[11px] tracking-wider opacity-80 uppercase leading-relaxed mt-1.5">Mon-Fri: 11-7<br />Sat: 10-7<br />Sun: 11-5:30</p>
              </div>

              <div className="flex flex-col gap-2.5">
  <p className="text-[9px] uppercase tracking-widest opacity-40 font-central font-bold mb-0.5">App</p>
  
  {/* App Store Badges */}
  <a href="#" className="hover:opacity-80 transition-opacity w-fit" aria-label="Download on the App Store">
    <img 
      src="https://developer.apple.com/app-store/marketing/guidelines/images/badge-download-on-the-app-store.svg" 
      alt="App Store" 
      className="h-[32px] w-auto"
    />
  </a>
  <a href="#" className="hover:opacity-80 transition-opacity w-fit" aria-label="Get it on Google Play">
    <img 
      src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" 
      alt="Google Play" 
      className="h-[32px] w-auto"
    />
  </a>

  {/* Country & Currency Selector */}
  <button className="flex items-center gap-2 mt-0.5 hover:opacity-70 transition-opacity border border-white/30 px-2.5 py-1 rounded-sm w-fit text-[10px] uppercase tracking-widest font-central">
    <img 
      src="https://flagcdn.com/pk.svg" 
      alt="Pakistan" 
      className="w-4 h-3 object-cover rounded-[1px]" 
    />
    <span>PK (PKR)</span>
  </button>
</div>
            </div>

            {/* Mobile: 2×2 grid */}
            <div className="grid grid-cols-2 gap-x-6 gap-y-5 md:hidden">

              {/* Cell 1 — Links */}
              <div className="flex flex-col gap-1.5">
                <h6 className="font-central text-[9px] uppercase tracking-widest opacity-40 font-bold mb-0.5">Links</h6>
                {['Rewards', 'Reviews', 'Contact', 'Account', 'Returns Policy', 'Careers', 'Help Center', 'Returns Portal', 'Flagship Store'].map((l) => (
                  <a key={l} href="#" className="text-[11px] uppercase tracking-wider hover:opacity-60 w-fit">{l}</a>
                ))}
                <button className="text-[11px] uppercase tracking-wider hover:opacity-60 text-left w-fit">Live Chat</button>
              </div>

              {/* Cell 2 — Socials */}
              <div className="flex flex-col gap-1.5">
                <h6 className="font-central text-[9px] uppercase tracking-widest opacity-40 font-bold mb-0.5">Socials</h6>
                {['Instagram', 'TikTok', 'YouTube', 'Flagship Store'].map((l) => (
                  <a key={l} href="#" className="text-[11px] uppercase tracking-wider hover:opacity-60 w-fit">{l}</a>
                ))}
              </div>

              {/* Cell 3 — Store */}
              <div className="flex flex-col gap-1.5">
                <h6 className="font-central text-[9px] uppercase tracking-widest opacity-40 font-bold mb-0.5">The Store</h6>
                <p className="text-[11px] tracking-wider opacity-80 uppercase leading-relaxed">103 Commercial St,<br />F11 Islamabad</p>
                <p className="text-[11px] tracking-wider opacity-80 uppercase leading-relaxed mt-1.5">Mon-Fri: 11-7<br />Sat: 10-7<br />Sun: 11-5:30</p>
              </div>

              {/* Cell 4 — App + Country */}
              <div className="flex flex-col gap-3">
                <p className="font-central text-[9px] uppercase tracking-widest opacity-40 font-bold mb-0.5">App</p>

                {/* App Store Badges */}
                <div className="flex flex-col gap-2.5">
                  <a href="#" className="hover:opacity-80 transition-opacity w-fit" aria-label="Download on the App Store">
                    <img
                      src="https://developer.apple.com/app-store/marketing/guidelines/images/badge-download-on-the-app-store.svg"
                      alt="App Store"
                      className="h-[32px] w-auto"
                    />
                  </a>
                  <a href="#" className="hover:opacity-80 transition-opacity w-fit" aria-label="Get it on Google Play">
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                      alt="Google Play"
                      className="h-[32px] w-auto"
                    />
                  </a>
                </div>
                {/* Country & Currency Selector */}
                <button className="flex items-center gap-2 mt-2 border border-white/30 px-3 py-1.5 rounded-sm w-fit text-[10px] uppercase tracking-widest font-central hover:bg-white/10 transition-colors">
                  <img
                    src="https://flagcdn.com/pk.svg"
                    alt="Pakistan"
                    className="w-4 h-3 object-cover rounded-[1px]"
                  />
                  <span>PK (PKR)</span>
                </button>
              </div>
            </div>
          </div>

          {/* ── BOTTOM BAR ── */}
          <div className="border-t border-white/20 py-3 flex flex-col sm:flex-row justify-between items-center gap-2">
            <p className="text-[9px] tracking-widest uppercase opacity-40 font-central">Sohail LTD.</p>
            <button
              onClick={scrollToTop}
              className="text-[9px] tracking-widest uppercase opacity-50 hover:opacity-100 transition-opacity font-central"
            >
              ↑ Back to top
            </button>
            <p className="text-[9px] tracking-widest uppercase opacity-40 font-central">Site by Sohail Zafar</p>
          </div>

        </div>
      </div>
    </footer>
  );
}