import React from 'react';
import { MapPin, Phone, Mail, Clock, Facebook, Instagram, Linkedin, Youtube } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-footer-bg text-white font-sans">
        {/* Main Footer Content */}
        <div className="container mx-auto px-4 pt-20 pb-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-20">
                {/* About Us */}
                <div className="col-span-1">
                    <h3 className="font-heading font-bold text-[24px] leading-[1.3] text-white mb-8">
                        About Us
                    </h3>
                    <p className="text-[16px] text-white/70 leading-[1.6] font-sans">
                        Kids Jump Tech is the manufacturer of the latest interactive equipment, providing state-of-the-art experiences via multimedia technology. Based out of the USA, Kids Jump Tech has completed more than 3,000 projects all around the world. When kids are happy, they jump!
                    </p>
                </div>

                {/* Contact Us */}
                <div className="col-span-1">
                    <h3 className="font-heading font-bold text-[24px] leading-[1.3] text-white mb-8">
                        Contact Us
                    </h3>
                    <div className="flex flex-col gap-6 text-[16px] text-white/70 font-sans">
                        <div className="flex gap-4 items-start">
                            <MapPin size={20} className="shrink-0 text-brand-sky mt-1" strokeWidth={1.5} /> 
                            <span>150 NW 176th st., unit E,<br/>Miami, FL, 33169</span>
                        </div>
                        <div className="flex gap-4 items-start">
                            <Phone size={20} className="shrink-0 text-brand-sky mt-1" strokeWidth={1.5} /> 
                            <div className="flex flex-col">
                                <a href="tel:8779010110" className="hover:text-brand-sky transition-colors text-white font-semibold">(877) 901-0110</a>
                                <span className="text-[14px] opacity-70">(Toll free number)</span>
                            </div>
                        </div>
                        <div className="flex gap-4 items-start">
                            <Phone size={20} className="shrink-0 text-brand-sky mt-1" strokeWidth={1.5} /> 
                            <div className="flex flex-col">
                                <a href="tel:15613828555" className="hover:text-brand-sky transition-colors text-white font-semibold">+1 (561) 382-8555</a>
                                <span className="text-[14px] opacity-70">(WhatsApp number for outside of US inquiries)</span>
                            </div>
                        </div>
                         <div className="flex gap-4 items-start">
                            <Mail size={20} className="shrink-0 text-brand-sky mt-1" strokeWidth={1.5} /> 
                            <a href="mailto:info@kidsjumptech.com" className="hover:text-brand-sky transition-colors">info@kidsjumptech.com</a>
                        </div>
                        <div className="flex gap-4 items-start">
                            <Clock size={20} className="shrink-0 text-brand-sky mt-1" strokeWidth={1.5} /> 
                            <span>Mon – Sat: 8 AM – 7 PM</span>
                        </div>

                        {/* Technical Support Section */}
                        <div className="mt-2 pt-6 border-t border-white/10">
                            <h4 className="font-heading font-bold text-[18px] text-white mb-4">Technical Support</h4>
                            <div className="flex flex-col gap-4">
                                <div className="flex gap-4 items-start">
                                    <Phone size={20} className="shrink-0 text-brand-sky mt-1" strokeWidth={1.5} /> 
                                    <div className="flex flex-col">
                                        <a href="tel:17869685878" className="hover:text-brand-sky transition-colors text-white font-semibold">+1 (786) 968-5878</a>
                                        <span className="text-[14px] opacity-70">(WhatsApp)</span>
                                    </div>
                                </div>
                                <div className="flex gap-4 items-start">
                                    <Mail size={20} className="shrink-0 text-brand-sky mt-1" strokeWidth={1.5} /> 
                                    <a href="mailto:support@kidsjumptech.com" className="hover:text-brand-sky transition-colors text-white">support@kidsjumptech.com</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Catalog */}
                <div className="col-span-1">
                    <h3 className="font-heading font-bold text-[24px] leading-[1.3] text-white mb-8">
                        Catalog
                    </h3>
                    <ul className="text-[16px] text-white/70 space-y-4 font-sans">
                        <li><a href="#" className="hover:text-brand-sky transition-colors">Interactive Floor</a></li>
                        <li><a href="#" className="hover:text-brand-sky transition-colors">Interactive Mobile Floor</a></li>
                        <li><a href="#" className="hover:text-brand-sky transition-colors">Interactive Sandboxes</a></li>
                        <li><a href="#" className="hover:text-brand-sky transition-colors">Interactive Wall</a></li>
                        <li><a href="#" className="hover:text-brand-sky transition-colors">Alive Sketches</a></li>
                        <li><a href="#" className="hover:text-brand-sky transition-colors">Interactive Climbing Wall</a></li>
                        <li><a href="#" className="hover:text-brand-sky transition-colors">Mobile Interactive Wall</a></li>
                        <li><a href="#" className="hover:text-brand-sky transition-colors">Interactive Multitouch Tables</a></li>
                        <li><a href="#" className="hover:text-brand-sky transition-colors">Interactive Slide</a></li>
                        <li><a href="#" className="hover:text-brand-sky transition-colors">Interactive Shooting Gallery</a></li>
                    </ul>
                </div>

                 {/* Helpful Links (Social icons removed from here) */}
                 <div className="col-span-1">
                    <h3 className="font-heading font-bold text-[24px] leading-[1.3] text-white mb-8">
                        Helpful Links
                    </h3>
                    <ul className="text-[16px] text-white/70 space-y-4 mb-10 font-sans">
                        <li><a href="#" className="hover:text-brand-sky transition-colors">Privacy Policy</a></li>
                        <li><a href="#" className="hover:text-brand-sky transition-colors">Terms and Conditions</a></li>
                    </ul>
                </div>
            </div>
        </div>

        {/* Secondary Bar / Socials & Copyright */}
        <div className="bg-footer-bar py-10 border-t border-footer-bar">
            <div className="container mx-auto px-4 text-center">
                
                {/* Social Icons */}
                <div className="flex justify-center gap-4 mb-8">
                     <a 
                        href="#" 
                        aria-label="Facebook"
                        className="w-10 h-10 rounded-full bg-social-facebook flex items-center justify-center text-white hover:scale-110 transition-transform shadow-lg"
                     >
                        <Facebook size={20} fill="currentColor" strokeWidth={0} />
                     </a>
                     <a 
                        href="#" 
                        aria-label="Instagram"
                        className="w-10 h-10 rounded-full bg-social-instagram flex items-center justify-center text-white hover:scale-110 transition-transform shadow-lg"
                     >
                        <Instagram size={20} strokeWidth={2} />
                     </a>
                     <a 
                        href="#" 
                        aria-label="LinkedIn"
                        className="w-10 h-10 rounded-md bg-social-linkedin flex items-center justify-center text-white hover:scale-110 transition-transform shadow-lg"
                     >
                        <Linkedin size={20} fill="currentColor" strokeWidth={0} />
                     </a>
                     <a 
                        href="#" 
                        aria-label="YouTube"
                        className="w-10 h-10 rounded-md bg-social-youtube flex items-center justify-center text-white hover:scale-110 transition-transform shadow-lg"
                     >
                        <Youtube size={20} strokeWidth={2} />
                     </a>
                </div>

                <div className="text-[14px] text-white font-sans">
                    Copyright © 2025 KIDSjumpTECH All rights reserved
                </div>
            </div>
        </div>
    </footer>
  );
};

export default Footer;