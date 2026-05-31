import React from 'react';

const categories = [
  {
    title: "Men's",
    link: "/collections/all-mens",
    img: "/Images/Hero/cat-1.webp"
  },
  {
    title: "Women's",
    link: "/collections/all-womens",
    img: "/Images/Hero/cat-2.jpg"
  },

];

export default function ExploreCategory() {
  return (
    <section className="w-full bg-white py-16 lg:py-24 text-[#1c1a19]">
      <div className="max-w-[1680px] mx-auto px-4 lg:px-8">
        
        <h3 className="font-central text-2xl md:text-3xl font-bold uppercase tracking-[1.2px] text-center mb-10">
          Explore By Category
        </h3>

        <div className="flex lg:grid lg:grid-cols-2 justify-center mx-auto gap-6  snap-x snap-mandatory no-scrollbar pb-8 lg:pb-0">
          
          {categories.map((category, idx) => (
            <a 
              key={idx} 
              href={category.link} 
              className="group flex flex-col shrink-0 w-[85vw] sm:w-[400px] lg:w-auto snap-center border border-[#1c1a19] overflow-hidden"
            >
              
              <div className="relative aspect-[4/5] overflow-hidden border-b border-[#1c1a19]">
                <img 
                  src={category.img} 
                  alt={category.title} 
                  loading="lazy"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                />
              </div>

              <div className="flex items-center justify-between p-6 bg-transparent transition-colors duration-300 group-hover:bg-[#1c1a19] group-hover:text-[#edecea]">
                <h5 className="font-central text-lg font-bold uppercase tracking-[1.2px]">
                  {category.title}
                </h5>
                <span className="font-ballinger text-xl font-bold transition-transform duration-300 group-hover:translate-x-1">
                  &gt;
                </span>
              </div>
            </a>
          ))}

        </div>

        <div className="flex justify-center gap-2 mt-4 lg:hidden">
          {categories.map((_, idx) => (
            <span 
              key={idx} 
              className={`w-2.5 h-2.5 rounded-full border border-[#1c1a19] ${idx === 0 ? 'bg-[#a58c69] border-[#a58c69]' : 'bg-transparent'}`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}