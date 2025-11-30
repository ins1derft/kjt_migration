import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, Phone, ChevronDown, MessageCircle, Facebook, Instagram, Linkedin, Youtube } from 'lucide-react';
import * as Icons from 'lucide-react';
import { cn } from '../lib/utils';
import { NAV_MENU_DATA } from '../data';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMouseEnter = (menu: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setActiveMenu(menu);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = window.setTimeout(() => {
      setActiveMenu(null);
    }, 200); // 200ms delay to allow moving cursor to the menu
  };

  // Helper to render icon by name
  const getIcon = (name: string, className: string) => {
    const iconKey = name as keyof typeof Icons;
    const IconComponent = (Icons[iconKey] || Icons.Star) as React.ElementType;
    return <IconComponent className={className} strokeWidth={1.5} />;
  };

  const renderMegaMenu = () => {
    return (
      <div 
        className={cn(
          "absolute top-[60px] left-0 w-full bg-white border-t border-gray-100 shadow-xl z-10 transition-all duration-300 origin-top overflow-hidden",
          activeMenu === 'products' ? "opacity-100 visible translate-y-0 max-h-[600px]" : "opacity-0 invisible -translate-y-2 max-h-0"
        )}
        onMouseEnter={() => handleMouseEnter('products')}
        onMouseLeave={handleMouseLeave}
      >
        <div className="container mx-auto px-4 xl:px-12 py-10">
          <div className="flex flex-col lg:flex-row gap-12">
            
            {/* Column 1 & 2: Products (Takes up about 50% width) */}
            <div className="flex-1 lg:basis-1/2 border-r border-gray-100 pr-8">
              <h3 className="font-heading font-bold text-lg text-brand-dark mb-6">Products</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                {NAV_MENU_DATA.products.map((item, idx) => (
                  <a key={idx} href="#" className="flex items-center gap-3 group">
                    <div className="text-brand-gold group-hover:scale-110 transition-transform">
                      {getIcon(item.icon, "w-5 h-5")}
                    </div>
                    <span className="text-sm font-semibold text-gray-600 group-hover:text-brand-sky transition-colors">
                      {item.title}
                    </span>
                  </a>
                ))}
              </div>
            </div>

            {/* Column 3: Experiences */}
            <div className="flex-1 lg:basis-1/4 border-r border-gray-100 pr-8 px-4">
               <h3 className="font-heading font-bold text-lg text-brand-dark mb-6">Experiences</h3>
               <div className="flex flex-col gap-4">
                 {NAV_MENU_DATA.experiences.map((item, idx) => (
                    <a key={idx} href="#" className="flex items-center gap-3 group">
                      <div className="text-brand-mid group-hover:scale-110 transition-transform">
                        {getIcon(item.icon, "w-5 h-5")}
                      </div>
                      <span className="text-sm font-semibold text-gray-600 group-hover:text-brand-sky transition-colors">
                        {item.title}
                      </span>
                    </a>
                 ))}
               </div>
            </div>

            {/* Column 4: Services */}
            <div className="flex-1 lg:basis-1/4 pl-4">
                <h3 className="font-heading font-bold text-lg text-brand-dark mb-6">Services</h3>
                <div className="flex flex-col gap-4">
                  {NAV_MENU_DATA.services.map((item, idx) => (
                      <a key={idx} href="#" className="flex items-center gap-3 group">
                        <div className="text-brand-green group-hover:scale-110 transition-transform">
                          {getIcon(item.icon, "w-5 h-5")}
                        </div>
                        <span className="text-sm font-semibold text-gray-600 group-hover:text-brand-sky transition-colors">
                          {item.title}
                        </span>
                      </a>
                  ))}
                </div>
            </div>

          </div>
        </div>
      </div>
    );
  };

  return (
    <header className={cn(
      "w-full fixed top-0 z-50 transition-all duration-300 font-sans",
      isScrolled ? "shadow-md" : ""
    )}>
      {/* Top Bar - Blue Background, White Text */}
      {/* VISIBLE on Mobile now, containing Social Icons */}
      <div className="w-full bg-brand-sky text-white h-[44px] relative z-20">
        <div className="container mx-auto px-4 xl:px-12 h-full flex justify-end items-center relative">
            
            {/* Centered Navigation Group - Desktop Only */}
            <div className="hidden lg:block absolute left-0 w-full top-0 h-full pointer-events-none">
                <div className="h-full flex justify-center items-center">
                    <div className="flex items-center pointer-events-auto font-bold font-heading text-[14px] tracking-wide">
                        {/* Left Group (News, Careers, Testimonials) */}
                        <div className="flex items-center gap-10 justify-end w-[350px]">
                            <a href="#" className="hover:opacity-80 transition-opacity">News</a>
                            <a href="#" className="hover:opacity-80 transition-opacity">Careers</a>
                            <a href="#" className="hover:opacity-80 transition-opacity">Testimonials</a>
                        </div>

                        {/* Spacer for the Logo */}
                        <div className="w-[150px] shrink-0"></div>

                        {/* Right Group (FAQs, Support) */}
                        <div className="flex items-center gap-10 justify-start w-[350px]">
                            <a href="#" className="hover:opacity-80 transition-opacity">FAQs</a>
                            <a href="#" className="hover:opacity-80 transition-opacity">Support</a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Social Icons (Visible on Mobile & Desktop) */}
            <div className="flex gap-6 items-center text-white relative z-20 pointer-events-auto">
                <a href="#" aria-label="Facebook" className="hover:opacity-80 transition-opacity">
                    <Facebook size={18} strokeWidth={2.5} />
                </a>
                <a href="#" aria-label="Instagram" className="hover:opacity-80 transition-opacity">
                    <Instagram size={18} strokeWidth={2.5} />
                </a>
                <a href="#" aria-label="LinkedIn" className="hover:opacity-80 transition-opacity">
                    <Linkedin size={18} fill="currentColor" strokeWidth={0} />
                </a>
                <a href="#" aria-label="YouTube" className="hover:opacity-80 transition-opacity">
                    <Youtube size={20} fill="currentColor" strokeWidth={0} />
                </a>
            </div>
        </div>
      </div>

      {/* Main Navigation - White Background */}
      <div className="bg-white h-[60px] relative shadow-sm lg:shadow-none z-30 group-nav">
        <div className="container mx-auto px-4 xl:px-12 h-full flex justify-between min-[1267px]:justify-around items-center">
            
            {/* Left Nav Group (Desktop) */}
            <nav className="hidden lg:flex items-center gap-8 font-heading font-bold text-[16px] text-brand-dark h-full">
                {/* Mega Menu Trigger */}
                <div 
                    className={cn(
                        "relative group cursor-pointer h-full flex items-center gap-1 hover:text-brand-sky transition-colors",
                        activeMenu === 'products' ? "text-brand-sky" : ""
                    )}
                    onMouseEnter={() => handleMouseEnter('products')}
                    onMouseLeave={handleMouseLeave}
                >
                    <span>Products & Experiences</span>
                    <ChevronDown size={14} strokeWidth={3} className={cn("mt-[2px] transition-transform", activeMenu === 'products' ? "rotate-180" : "")} />
                    
                    {/* Invisible Bridge to prevent mouse gap issues if there's a small pixel gap */}
                    <div className="absolute top-full left-0 w-full h-[5px] bg-transparent"></div>
                </div>

                <div className="relative group cursor-pointer h-full flex items-center gap-1 hover:text-brand-sky transition-colors">
                    <span>Industries</span>
                    <ChevronDown size={14} strokeWidth={3} className="mt-[2px]" />
                </div>
            </nav>

            {/* Centered Logo */}
            <a href="#" className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
                <img 
                    src="https://i.ibb.co/hxdLwtc1/Frame-5.png" 
                    alt="KIDS Jump TECH" 
                    className="w-[103px] h-auto" 
                />
            </a>

            {/* Right Nav Group & Actions (Desktop) */}
            <div className="hidden lg:flex items-center gap-8 h-full">
                <nav className="flex items-center gap-8 font-heading font-bold text-[16px] text-brand-dark h-full">
                    <div className="relative group cursor-pointer h-full flex items-center gap-1 hover:text-brand-sky transition-colors">
                        <span>Why Us</span>
                        <ChevronDown size={14} strokeWidth={3} className="mt-[2px]" />
                    </div>
                    <a href="#" className="hover:text-brand-sky transition-colors h-full flex items-center">Contact</a>
                </nav>

                <div className="flex items-center gap-5 pl-2">
                    <a href="tel:+18779010110" className="text-brand-dark hover:text-brand-sky transition-colors">
                        <Phone size={24} strokeWidth={2.5} />
                    </a>
                    <a href="#" className="text-brand-dark hover:text-brand-sky transition-colors">
                        <MessageCircle size={24} strokeWidth={2.5} />
                    </a>
                    <a href="#" className="bg-brand-gradient animate-gradient text-white font-heading font-bold text-[15px] uppercase tracking-wide py-[10px] px-6 rounded-full hover:shadow-lg hover:opacity-90 transition-all ml-2">
                        Live Demo
                    </a>
                </div>
            </div>

            {/* Mobile Actions Container */}
            <div className="lg:hidden flex items-center justify-end w-full h-full relative z-40">
                <div className="flex items-center gap-3">
                    {/* Call Button */}
                    <a href="tel:+18779010110" className="text-brand-dark hover:text-brand-sky p-1">
                        <Phone size={20} strokeWidth={2.5} />
                    </a>

                    {/* Message Button */}
                    <a href="#" className="text-brand-dark hover:text-brand-sky p-1">
                        <MessageCircle size={20} strokeWidth={2.5} />
                    </a>

                    {/* Burger Menu Button */}
                    <button 
                        className="text-brand-dark p-1 hover:text-brand-sky transition-colors"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>

                    {/* Live Demo Button (Compact for Mobile) */}
                    <a href="#" className="bg-brand-gradient animate-gradient text-white font-heading font-bold text-[10px] uppercase tracking-wide py-2 px-3 rounded-full hover:shadow-lg hover:opacity-90 transition-all whitespace-nowrap">
                        Live Demo
                    </a>
                </div>
            </div>
        </div>
        
        {/* Render Mega Menu (Desktop) */}
        {renderMegaMenu()}

      </div>

      {/* Mobile Menu Drawer */}
      {isMenuOpen && (
        <div className="lg:hidden absolute top-[104px] left-0 w-full bg-white h-[calc(100vh-104px)] overflow-y-auto p-6 shadow-xl border-t border-gray-100 z-40">
          <nav className="flex flex-col gap-6 font-heading font-bold text-xl text-brand-dark">
            <a href="#" className="flex justify-between items-center text-brand-sky">
                Products & Experiences <ChevronDown size={16} className="rotate-180" />
            </a>
            {/* Mobile Expanded Menu for Products */}
            <div className="pl-4 flex flex-col gap-4">
                <div className="font-bold text-gray-400 text-sm uppercase">Products</div>
                {NAV_MENU_DATA.products.map((item, i) => (
                    <a key={i} href="#" className="text-base font-normal text-gray-600">{item.title}</a>
                ))}
                <div className="font-bold text-gray-400 text-sm uppercase mt-2">Experiences</div>
                {NAV_MENU_DATA.experiences.map((item, i) => (
                    <a key={i} href="#" className="text-base font-normal text-gray-600">{item.title}</a>
                ))}
                <div className="font-bold text-gray-400 text-sm uppercase mt-2">Services</div>
                {NAV_MENU_DATA.services.map((item, i) => (
                    <a key={i} href="#" className="text-base font-normal text-gray-600">{item.title}</a>
                ))}
            </div>

            <a href="#" className="flex justify-between items-center">
                Industries <ChevronDown size={16} />
            </a>
            <a href="#" className="flex justify-between items-center">
                Why Us <ChevronDown size={16} />
            </a>
            <a href="#">Contact</a>
            
            <hr className="border-gray-100 my-2" />
            
            {/* Extended menu links */}
            <div className="mt-4 flex flex-wrap gap-4 text-sm font-normal text-gray-500 justify-center">
                <a href="#">News</a>
                <a href="#">Careers</a>
                <a href="#">Testimonials</a>
                <a href="#">FAQs</a>
                <a href="#">Support</a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;