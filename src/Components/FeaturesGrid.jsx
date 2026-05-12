import React, { useState } from 'react';

const featuresData = [
  {
    title: "15% OFF\nFIRST ORDER",
    shortDesc: "Subscribe to our mailing\nlist\nfor 15% off your first\norder",
    modalDesc: "Join our community and get 15% off your first purchase. Be the first to know about new drops, exclusive sales, and P&Co news.",
    linkText: "SIGN UP",
    linkUrl: "#"
  },
  {
    title: "EASY RETURNS\n& INSTANT EXCHANGES",
    shortDesc: "Get your new items sent\nout straight away on UK &\nEU orders",
    modalDesc: "We now offer instant exchanges for UK & EU customers. If your item is the incorrect size you can get your new item sent out straight away before you send off your unwanted item, so you won't have to wait to get the right item.",
    linkText: "FIND OUT MORE →",
    linkUrl: "#"
  },
  {
    title: "FREE WORLDWIDE\nDELIVERY",
    shortDesc: "Free worldwide delivery on\nall orders over £70",
    modalDesc: "We offer free tracked shipping on all UK, US, EU, and ROW orders over a certain threshold. Check our shipping page for specific rates to your country.",
    linkText: "SHIPPING INFO →",
    linkUrl: "#"
  },
  {
    title: "30 DAY\nRETURNS",
    shortDesc: "Orders are eligible for\nreturns within 30 days of\ndispatch from our UK\nwarehouse",
    modalDesc: "Not quite right? We accept returns on all unworn items within 30 days of dispatch. Please ensure all original tags are attached.",
    linkText: "RETURNS PORTAL →",
    linkUrl: "#"
  }
];

export default function FeaturesGrid() {
  // State to track which modal is open. Null means closed.
  const [activeModalIdx, setActiveModalIdx] = useState(null);

  // Helper to safely close the modal
  const closeModal = () => setActiveModalIdx(null);

  return (
    <>
      {/* MAIN GRID SECTION */}
      {/* Background color perfectly matches the beige/cream from the screenshot */}
      <section className="w-full bg-[#f4f2ed] border-y border-nav-dark">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-nav-dark">
          
          {featuresData.map((feature, idx) => (
            <div 
              key={idx} 
              className="flex flex-col items-center text-center px-6 py-12 lg:py-16 justify-between h-full"
            >
              <div className="flex flex-col items-center">
                <h3 className="font-central text-lg md:text-xl font-bold uppercase tracking-wider whitespace-pre-line leading-tight text-nav-dark">
                  {feature.title}
                </h3>
                
                <p className="font-ballinger text-[13px] md:text-sm text-nav-dark mt-6 whitespace-pre-line leading-relaxed">
                  {feature.shortDesc}
                </p>
              </div>

              {/* The 'i' Information Button */}
              <button 
                onClick={() => setActiveModalIdx(idx)}
                className="mt-8 w-[26px] h-[26px] rounded-full border border-nav-dark flex items-center justify-center hover:bg-nav-dark hover:text-[#f4f2ed] transition-colors"
                aria-label={`More info about ${feature.title.replace('\n', ' ')}`}
              >
                <span className="font-ballinger text-xs lowercase italic">i</span>
              </button>
            </div>
          ))}

        </div>
      </section>

      {/* MODAL OVERLAY */}
      {/* Only renders if a button was clicked (activeModalIdx is not null) */}
      {activeModalIdx !== null && (
        <div 
          className="fixed inset-0 z-[300] flex items-center justify-center bg-black/40 backdrop-blur-sm px-4 transition-opacity duration-300"
          onClick={closeModal} // Clicking the dark background closes it
        >
          {/* Modal Content Box */}
          <div 
            className="bg-[#f4f2ed] p-10 md:p-14 w-full max-w-lg relative shadow-2xl flex flex-col items-center text-center"
            onClick={(e) => e.stopPropagation()} // Prevents clicks inside the white box from closing the modal
          >
            {/* Close 'X' Button */}
            <button 
              onClick={closeModal} 
              className="absolute top-4 right-4 text-nav-dark hover:opacity-60 transition-colors p-2"
              aria-label="Close modal"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Modal Content */}
            <h2 className="font-central text-xl md:text-2xl font-bold uppercase tracking-[0.1em] whitespace-pre-line mb-6 text-nav-dark leading-tight">
              {featuresData[activeModalIdx].title}
            </h2>
            
            <p className="font-ballinger text-sm md:text-[15px] text-nav-dark mb-8 leading-relaxed">
              {featuresData[activeModalIdx].modalDesc}
            </p>

            <a 
              href={featuresData[activeModalIdx].linkUrl}
              className="font-central text-[11px] font-bold uppercase tracking-widest text-nav-dark hover:opacity-60 transition-opacity underline underline-offset-4 decoration-[1px]"
            >
              {featuresData[activeModalIdx].linkText}
            </a>
          </div>
        </div>
      )}
    </>
  );
}