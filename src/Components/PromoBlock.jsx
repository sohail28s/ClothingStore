import React from 'react';

export default function PromoBlock() {
  return (
    // The main container. 
    // Stacks as a column on mobile, switches to a 50/50 grid on desktop (lg).
    // bg-[#fafafa] matches your rgb(250, 250, 250)
    <section className="w-full bg-[#fafafa] flex flex-col lg:grid lg:grid-cols-2">
      
      {/* IMAGE SECTION (order-1 ensures it shows up on top on mobile, 
        and on the left on desktop) 
      */}
      <div className="relative w-full h-[400px] lg:h-[600px] order-1">
        <img 
          src="https://pand.co/cdn/shop/files/Spring-4-desktop_0020_DSCF7604_b839eb9d-056d-476c-81c6-1d0b75b76a95.jpg?crop=center&v=1774449884&width=1440" 
          alt="Spring Collection" 
          className="absolute inset-0 w-full h-full object-cover object-center"
          loading="lazy"
        />
      </div>

      {/* TEXT SECTION (order-2 puts it below the image on mobile, 
        and on the right on desktop) 
      */}
      <div className="flex flex-col justify-center items-center text-center lg:items-start lg:text-left px-6 py-16 lg:px-16 xl:px-24 order-2 text-nav-dark">
        
        <h2 className="font-central text-3xl md:text-4xl lg:text-[40px] font-bold uppercase leading-tight mb-6 tracking-wide">
          Serving Good Times<br /> &amp; Nostalgia
        </h2>
        
        <p className="font-ballinger text-sm md:text-base font-light leading-relaxed mb-6 text-gray-700 max-w-lg">
          Our final instalment of spring celebrates the versatility of heritage workwear fabrics- herringbone, hickory stripe, and classic denim. Featuring classic fits and transitional styling, from spring through to summer, this collection features raw hems, heavy fabrics, experimental prints &amp; washes.
          <br /><br />
          With mid-century typography and long-awaited graphics, it’s our most core collection this year- a nod to our Moto &amp; automotive roots.
        </p>

        {/* Link with subtle arrow SVG to match the reference */}
        <a 
          href="/blogs/lookbook" 
          className="group inline-flex items-center gap-2 font-central font-bold text-xs uppercase tracking-[0.2em] text-[#a58c69] hover:text-nav-dark transition-colors duration-300 border-b border-transparent hover:border-nav-dark pb-1"
        >
          View The Lookbook
          <svg 
            className="w-3 h-3 transform group-hover:translate-x-1 transition-transform" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor" 
            strokeWidth="2"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
          </svg>
        </a>

      </div>

    </section>
  );
}