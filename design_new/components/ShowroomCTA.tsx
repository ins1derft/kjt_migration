
import React from 'react';

const ShowroomCTA: React.FC = () => {
  return (
    <section className="relative py-24 md:py-32 bg-brand-dark overflow-hidden">
        {/* Background Image */}
        <div 
            className="absolute inset-0 z-0 bg-cover bg-center"
            style={{ 
                backgroundImage: 'url("https://kidsjumptech.com/wp-content/uploads/2023/04/Capture-1.jpg")' 
            }}
        ></div>
        
        {/* Dark Overlay for text readability */}
        <div className="absolute inset-0 z-10 bg-black/60"></div>

        <div className="container mx-auto px-4 relative z-20">
            <div className="flex flex-col lg:flex-row items-center lg:items-center justify-between gap-10">
                
                {/* Text Content */}
                <div className="max-w-3xl text-center lg:text-left">
                    <h2 className="font-heading font-bold text-[40px] md:text-[56px] leading-[1.1] text-white mb-6">
                        Visit our showroom or <br className="hidden md:block" />
                        schedule a Zoom call
                    </h2>
                    <p className="font-sans text-lg md:text-xl text-white/90 leading-relaxed font-light">
                        We will call you back from (877) 901-0110 within 10 minutes during our business hours, which are from 9 AM to 6 PM EST
                    </p>
                </div>

                {/* CTA Button */}
                <div className="shrink-0">
                    <a 
                        href="#" 
                        className="inline-block bg-white text-brand-dark font-heading font-bold text-[18px] py-5 px-10 rounded-full hover:bg-brand-sky hover:text-white transition-all shadow-xl hover:shadow-2xl hover:scale-105"
                    >
                        Live demo
                    </a>
                </div>

            </div>
        </div>
    </section>
  );
};

export default ShowroomCTA;
