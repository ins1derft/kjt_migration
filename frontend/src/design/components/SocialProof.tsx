
/* eslint-disable @next/next/no-img-element */
import React from "react";
import { STATS_DATA } from "@/design/data";

const SocialProof: React.FC = () => {
  return (
    <section className="py-20 bg-white">
        {/* Logos */}
        <div className="container mx-auto px-4 mb-20">
            <div className="text-center mb-10">
                <h2 className="font-heading font-bold text-3xl text-brand-dark mb-4">Tested. Trusted. Implemented.</h2>
                <p className="text-gray-600">We manufacture equipment for schools, libraries, museums, development centers, hospitals and home use.</p>
            </div>
            <img 
                src="https://kidsjumptech.com/wp-content/uploads/2023/04/Untitled-3-scaled.jpg" 
                alt="Client Logos" 
                className="w-full max-w-5xl mx-auto object-contain opacity-80 grayscale hover:grayscale-0 transition-all duration-500"
            />
        </div>

        {/* Parallax Stats Section */}
        <div className="relative py-32 bg-brand-dark text-white overflow-hidden">
            {/* Background Image Overlay */}
            <div className="absolute inset-0 z-0">
                <img 
                    src="https://kidsjumptech.com/wp-content/uploads/2023/12/Screenshot-2023-11-29-at-8.05.34%E2%80%AFPM.png" 
                    alt="Background" 
                    className="w-full h-full object-cover opacity-30"
                />
                <div className="absolute inset-0 bg-brand-dark/60"></div>
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <h2 className="font-heading font-bold text-4xl md:text-5xl text-center mb-16 text-white">
                    Let’s Bring That Room to Life
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                    {STATS_DATA.map((stat, index) => (
                        <div key={index} className="flex flex-col items-center">
                            <span className={`font-heading font-bold text-6xl md:text-7xl mb-2 ${index === 1 ? 'text-transparent bg-clip-text bg-gradient-to-r from-brand-start via-brand-mid to-brand-end animate-gradient' : 'text-brand-sky'}`}>
                                {stat.value}
                            </span>
                            <span className="font-heading font-bold text-xl md:text-2xl text-white/90">
                                {stat.label}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </section>
  );
};

export default SocialProof;
