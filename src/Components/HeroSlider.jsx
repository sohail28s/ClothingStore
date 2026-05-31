import React, { useState, useEffect  } from 'react';
import {Link} from "react-router-dom"


const S1_DESKTOP = "/Images/Hero/new1.webp";
const S1_MOBILE = "/Images/Hero/new1.webp";

// Slide 2: Mid-Season Sale
const S2_DESKTOP = "/Images/Hero/2.jpg";
const S2_MOBILE = "/Images/Hero/2small.jpg";

 const S3_LEFT_IMG = "/Images/Hero/new3.webp";
const S3_RIGHT_IMG = "/Images/Hero/new2.jpg";

// Slide 5: Join the Family
const S5_DESKTOP = "https://pand.co/cdn/shop/files/Autumn_Drop_2_-_Lookbook41_1920x.jpg?v=1758282936";
const S5_MOBILE = "https://pand.co/cdn/shop/files/Autumn_Drop_2_-_Lookbook41_900x.jpg?v=1758282936";

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
      { label: "Shop Men's", link: "/collections/mens", style: "bg-white text-black hover:bg-[#f5e8e1]" },
      { label: "Shop Women's", link: "/collections/womens", style: "bg-white text-black hover:bg-[#f5e8e1]" }
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
      { label: "Shop Sale", link: "#", style: "bg-[#a58c69] text-white hover:bg-[#8f6f4a] border border-[#a58c69]" }
    ]
  },
  {
    id: 3,
    type: 'split', // THIS IS THE SPECIAL 50/50 SLIDE
    leftPanel: {
      img: S3_LEFT_IMG,
      title: 'HERITAGE\nStyling',
      button: { label: "Shop Men's ", link: "/collections/mens", style: "bg-[#a58c69] text-white hover:bg-[#684f40]" }
    },
    rightPanel: {
      img: S3_RIGHT_IMG,
      title: 'Vintage-inspired\nlayers',
      button: { label: "Shop Women's ", link: "/collections/womens", style: "bg-[#a58c69] text-white hover:bg-[#684f40]" }
    }
  },
  {
    id: 4,
    type: 'full',
    imgDesktop: S5_DESKTOP,
    imgMobile: S5_MOBILE,
    title: 'Join the family',
    subtitle: 'Get exclusive benefits and rewards by joining the Loyalty Dept. and becoming an active member of our family.',
    position: 'items-center justify-center text-center px-4',
    overlay: 'bg-black/30', // Simple dark overlay for readability
    buttons: [
      { label: "Sign up", link: "/account/login", style: "bg-[#a58c69] text-white hover:bg-[#684f40]" }
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
                        <Link 
                          key={btnIdx} 
                          to={btn.link}
                          className={`font-central font-bold uppercase tracking-widest text-xs px-6 py-4 md:px-8 rounded-sm transition-colors duration-300 w-full sm:w-auto text-center ${btn.style}`}
                        >
                          {btn.label}
                        </Link>
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
                    <Link to={slide.leftPanel.button.link} className={`font-central font-bold uppercase tracking-widest text-xs px-6 py-4 rounded-sm transition-colors w-fit text-center ${slide.leftPanel.button.style}`}>
                      {slide.leftPanel.button.label}
                    </Link>
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
                    <Link to={slide.rightPanel.button.link} className={`font-central font-bold uppercase tracking-widest text-xs px-6 py-4 rounded-sm transition-colors w-fit text-center ${slide.rightPanel.button.style}`}>
                      {slide.rightPanel.button.label}
                    </Link>
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









