// src/components/HeroSlider.jsx
import React, { useState, useEffect } from 'react';

// ==========================================
// IMAGE URL VARIABLES (Extracted from your CSS)
// ==========================================
// Slide 1: New Arrivals
const S1_DESKTOP = "https://pand.co/cdn/shop/files/Untitled-1_0000_DSCF2238_1920x.jpg?v=1774606334";
const S1_MOBILE = "https://pand.co/cdn/shop/files/DROP3ECOMSIZED_0061_LeonSpring2-685_0000_DSCF22351-2_900x.jpg?v=1774453555";

// Slide 2: Mid-Season Sale
const S2_DESKTOP = "https://pand.co/cdn/shop/files/Web-Banner_2_1920x.jpg?v=1773835882";
const S2_MOBILE = "https://pand.co/cdn/shop/files/Mobile-Banner_1_0f02058c-fefa-4488-acf1-302b1c524b9e_900x.jpg?v=1773835884";

// Slide 3: Split Slide (Heritage / Vintage)
const S3_LEFT_IMG = "https://pand.co/cdn/shop/files/Web-Banner-01_a709c71a-feae-4072-8fcc-492bb2fe8cb5.jpg?v=1772101272&width=1920";
const S3_RIGHT_IMG = "https://pand.co/cdn/shop/files/Web-Banner-02_3873ccbb-3a91-40ca-bf5a-b153c0d9e778.jpg?v=1772101275&width=1920";

// Slide 4: Active Season
const S4_DESKTOP = "https://pand.co/cdn/shop/files/active-desk_0025_IMG_8162_1920x.jpg?v=1770989535";
const S4_MOBILE = "https://pand.co/cdn/shop/files/active_0001_IMG_8631_900x.jpg?v=1771256739";

// Slide 5: Join the Family
const S5_DESKTOP = "https://pand.co/cdn/shop/files/Autumn_Drop_2_-_Lookbook41_1920x.jpg?v=1758282936";
const S5_MOBILE = "https://pand.co/cdn/shop/files/Autumn_Drop_2_-_Lookbook41_900x.jpg?v=1758282936";


// ==========================================
// SLIDER DATA ARCHITECTURE
// ==========================================
const sliderData = [
  {
    id: 1,
    type: 'full',
    imgDesktop: S1_DESKTOP,
    imgMobile: S1_MOBILE,
    title: 'NEW ARRIVALS',
    subtitle: 'Serving good times & nostalgia.',
    position: 'items-end justify-start pb-24 lg:pb-32 pl-6 lg:pl-16 text-left', 
    overlay: 'bg-gradient-to-t from-black/50 via-transparent to-transparent', // Bottom shadow gradient
    buttons: [
      { label: "Shop Men's", link: "/collections/mens-new-arrivals", style: "bg-white text-black hover:bg-[#f5e8e1]" },
      { label: "Shop Women's", link: "/collections/womens-new-arrivals", style: "bg-white text-black hover:bg-[#f5e8e1]" }
    ]
  },
  {
    id: 2,
    type: 'full',
    imgDesktop: S2_DESKTOP,
    imgMobile: S2_MOBILE,
    title: 'MID-SEASON SALE:\nUp to 60% Off',
    subtitle: '',
    position: 'items-end justify-start pb-24 lg:pb-32 pl-6 lg:pl-16 text-left',
    overlay: 'bg-gradient-to-b from-black/20 via-transparent to-black/40',
    buttons: [
      { label: "Shop Sale", link: "/collections/last-chance-sale", style: "bg-[#a58c69] text-white hover:bg-[#8f6f4a] border border-[#a58c69]" }
    ]
  },
  {
    id: 3,
    type: 'split', // THIS IS THE SPECIAL 50/50 SLIDE
    leftPanel: {
      img: S3_LEFT_IMG,
      title: 'HERITAGE\nStyling',
      button: { label: "Shop Men's Outerwear", link: "/collections/mens-outerwear", style: "bg-[#a58c69] text-white hover:bg-[#684f40]" }
    },
    rightPanel: {
      img: S3_RIGHT_IMG,
      title: 'Vintage-inspired\nlayers',
      button: { label: "Shop Women's Outerwear", link: "/collections/womens-outerwear", style: "bg-[#a58c69] text-white hover:bg-[#684f40]" }
    }
  },
  {
    id: 4,
    type: 'full',
    imgDesktop: S4_DESKTOP,
    imgMobile: S4_MOBILE,
    title: 'ACTIVE SEASON. 2',
    subtitle: '',
    position: 'items-end justify-start pb-24 lg:pb-32 pl-6 lg:pl-16 text-left',
    overlay: 'bg-gradient-to-t from-black/60 via-black/20 to-transparent',
    buttons: [
      { label: "Shop Now", link: "/collections/activewear", style: "bg-[#a58c69] text-white hover:bg-[#8f6f4a]" },
      { label: "Explore More", link: "/collections/activewear-explore", style: "bg-white text-black hover:opacity-80" }
    ]
  },
  {
    id: 5,
    type: 'full',
    imgDesktop: S5_DESKTOP,
    imgMobile: S5_MOBILE,
    title: 'Join the family',
    subtitle: 'Get exclusive benefits and rewards by joining the Loyalty Dept. and becoming an active member of our family.',
    position: 'items-center justify-center text-center px-4',
    overlay: 'bg-black/30', // Simple dark overlay for readability
    buttons: [
      { label: "Sign up", link: "/pages/rewards", style: "bg-[#a58c69] text-white hover:bg-[#684f40]" }
    ]
  }
];


// ==========================================
// MAIN COMPONENT
// ==========================================
export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-play
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === sliderData.length - 1 ? 0 : prev + 1));
    }, 6000); 
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev === sliderData.length - 1 ? 0 : prev + 1));
  const prevSlide = () => setCurrentSlide((prev) => (prev === 0 ? sliderData.length - 1 : prev - 1));

  return (
    <div className="relative w-full h-[100dvh] overflow-hidden bg-[#1c1a19] group">
      
      {/* Slides Container */}
      <div 
        className="flex transition-transform duration-700 ease-in-out h-full"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {sliderData.map((slide, idx) => (
          <div key={slide.id} className="w-full h-full shrink-0 relative">
            
            {/* --- RENDER LOGIC FOR FULL SLIDES --- */}
            {slide.type === 'full' && (
              <>
                {/* Desktop & Mobile Image Swap using CSS hiding */}
                <img src={slide.imgDesktop} alt={slide.title} className="hidden md:block absolute inset-0 w-full h-full object-cover object-center" />
                <img src={slide.imgMobile} alt={slide.title} className="block md:hidden absolute inset-0 w-full h-full object-cover object-center" />
                
                {/* Specific Gradient Overlay mapped from CSS */}
                <div className={`absolute inset-0 z-10 ${slide.overlay}`} />

                {/* Content Area */}
                <div className={`absolute inset-0 z-20 flex ${slide.position}`}>
                  <div className="flex flex-col gap-4 max-w-2xl">
                    <h2 className="font-central text-5xl md:text-[80px] font-bold text-white uppercase leading-[0.9] tracking-tight whitespace-pre-line">
                      {slide.title}
                    </h2>
                    
                    {slide.subtitle && (
                      <p className="font-ballinger text-white text-base md:text-lg mb-4">
                        {slide.subtitle}
                      </p>
                    )}
                    
                    <div className={`flex flex-col sm:flex-row gap-4 mt-2 ${slide.position.includes('center') ? 'justify-center mx-auto' : ''}`}>
                      {slide.buttons.map((btn, btnIdx) => (
                        <a 
                          key={btnIdx} 
                          href={btn.link}
                          className={`font-central font-bold uppercase tracking-widest text-xs px-6 py-4 md:px-8 rounded-sm transition-colors duration-300 w-full sm:w-auto text-center ${btn.style}`}
                        >
                          {btn.label}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* --- RENDER LOGIC FOR SPLIT SLIDE (Slide 3) --- */}
            {slide.type === 'split' && (
              <div className="flex flex-col md:flex-row w-full h-full">
                
                {/* Left Half */}
                <div className="relative flex-1 h-1/2 md:h-full flex items-end justify-start pb-12 lg:pb-32 pl-6 lg:pl-16">
                  <img src={slide.leftPanel.img} alt="Left Panel" className="absolute inset-0 w-full h-full object-cover object-center" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                  <div className="relative z-20 flex flex-col gap-6">
                    <h2 className="font-central text-4xl md:text-6xl font-bold text-white uppercase leading-none whitespace-pre-line">
                      {slide.leftPanel.title}
                    </h2>
                    <a href={slide.leftPanel.button.link} className={`font-central font-bold uppercase tracking-widest text-xs px-6 py-4 rounded-sm transition-colors w-fit text-center ${slide.leftPanel.button.style}`}>
                      {slide.leftPanel.button.label}
                    </a>
                  </div>
                </div>

                {/* Right Half */}
                <div className="relative flex-1 h-1/2 md:h-full flex items-end justify-start pb-12 lg:pb-32 pl-6 lg:pl-16">
                  <img src={slide.rightPanel.img} alt="Right Panel" className="absolute inset-0 w-full h-full object-cover object-center" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                  <div className="relative z-20 flex flex-col gap-6">
                    <h2 className="font-central text-4xl md:text-6xl font-bold text-white uppercase leading-none whitespace-pre-line">
                      {slide.rightPanel.title}
                    </h2>
                    <a href={slide.rightPanel.button.link} className={`font-central font-bold uppercase tracking-widest text-xs px-6 py-4 rounded-sm transition-colors w-fit text-center ${slide.rightPanel.button.style}`}>
                      {slide.rightPanel.button.label}
                    </a>
                  </div>
                </div>

              </div>
            )}

          </div>
        ))}
      </div>

      {/* Standard Left/Right Arrows */}
      <button onClick={prevSlide} className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-2 text-white/70 hover:text-white transition-all hidden md:block opacity-0 group-hover:opacity-100">
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
      </button>
      <button onClick={nextSlide} className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-2 text-white/70 hover:text-white transition-all hidden md:block opacity-0 group-hover:opacity-100">
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
      </button>

      {/* Pagination Dots (Exactly matching your screenshot placement) */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-2.5">
        {sliderData.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            className={`w-2 h-2 rounded-full border border-white transition-all duration-300 ${
              currentSlide === idx ? 'bg-white scale-125' : 'bg-transparent hover:bg-white/50'
            }`}
          />
        ))}
      </div>

    </div>
  );
}