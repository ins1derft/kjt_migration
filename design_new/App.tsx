
import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import HeroContent from './components/HeroContent';
import FeatureGrid from './components/FeatureGrid';
import ProductCarousel from './components/ProductCarousel';
import TrustedBy from './components/TrustedBy';
import Stats from './components/Stats';
import WhyUs from './components/WhyUs';
import ShowroomCTA from './components/ShowroomCTA';
import GamesGallery from './components/GamesGallery';
import Testimonials from './components/Testimonials';
import News from './components/News';
import TransformCTA from './components/TransformCTA';
import Footer from './components/Footer';
import { VALUES_DATA, CORE_FEATURES } from './data';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-brand-gray font-sans text-brand-dark">
      <Header />
      
      <main>
        <Hero />
        <HeroContent />
        
        {/* Values Section (Icon Grid under Hero) */}
        <FeatureGrid 
            items={VALUES_DATA} 
            columns={4} 
            iconColor="sky" 
            variant="values"
        />
        
        <ProductCarousel />
        
        <TrustedBy />

        <Stats />
        
        {/* Core Features Section */}
        <FeatureGrid 
            title="Core Features"
            items={CORE_FEATURES} 
            columns={3} 
            iconColor="orange"
            variant="features"
        />

        <WhyUs />

        <ShowroomCTA />
        
        <GamesGallery />
        
        <Testimonials />
        
        <News />

        <TransformCTA />
      </main>

      <Footer />
      
      {/* Sticky Chat Widget */}
      <div className="fixed bottom-6 right-6 z-50">
          <button className="bg-brand-sky text-white rounded-full p-4 shadow-lg hover:scale-110 transition-transform hover:shadow-glow">
            <span className="sr-only">Chat</span>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
          </button>
      </div>
    </div>
  );
};

export default App;
