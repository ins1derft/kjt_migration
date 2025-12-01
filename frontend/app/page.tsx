import FeatureGrid from "@/components/blocks/FeatureGrid";
import Hero from "@/components/blocks/ClientHero";
import HeroContent from "@/components/blocks/HeroContent";
import News from "@/components/blocks/News";
import ProductCarousel from "@/components/blocks/ProductCarousel";
import CTASection from "@/components/blocks/CTASection";
import Stats from "@/components/blocks/Stats";
import Reviews from "@/components/blocks/Reviews";
import HighlightCTA from "@/components/blocks/HighlightCTA";
import TrustedBy from "@/components/blocks/TrustedBy";
import WhyUs from "@/components/blocks/WhyUs";
import GamesGallery from "@/components/blocks/GamesGallery";
import { getReviews } from "@/lib/api";

export default async function Home() {
  const reviews = await getReviews({
    limit: 12,
    init: { revalidate: 300 },
  });

  return (
    <main className="bg-brand-gray text-brand-dark">
      <Hero
        title="Interactive Equipment For Kids"
        slides={HERO_SLIDES}
      />
      <HeroContent
        title="Interactive Equipment For Kids"
        subtitle="Turn-Key Interactive Systems for Your Environment"
        text="Yes, any space can become an exciting educational adventure where kids can dive into fun and learn with their whole selves – body, mind, and heart."
        ctaLabel="Live Demo"
        ctaHref="mailto:info@kidsjumptech.com?subject=Live%20Demo"
      />
      <FeatureGrid
        items={VALUES_DATA}
        columns={4}
        iconColor="sky"
        variant="values"
      />
      <ProductCarousel
        title="The World of Interactive Wonders!"
        description="Dive into a Whirlwind Adventure Through an Interactive Wonderland, Where Every Twist and Turn Sparks Joy and Friendship!"
        query={{
          limit: 12,
          fields: ["slug", "name", "slogan", "hero_image"],
        }}
      />
      <TrustedBy
        title="Tested. Trusted. Implemented."
        description="Our products have been implemented by leading local and national brands in the entertainment, fitness, and education industry."
        footerText="We manufacture equipment for schools, libraries, museums, development centers, hospitals and home use."
        query={{
          fields: ["image", "alt", "position"]
        }}
      />
      <Stats
        title="Let’s Bring That Room to Life"
        items={STATS_DATA}
      />
      <FeatureGrid
        title="Core Features"
        items={CORE_FEATURES} 
        columns={3}
        iconColor="orange"
        variant="features"
      />
      <WhyUs 
        title="Why Us?"
      />
      <CTASection
        title="Visit our showroom or schedule a Zoom call"
        description="We will call you back from (877) 901-0110 within 10 minutes during our business hours, which are from 9 AM to 6 PM EST"
        ctaLabel="Live demo"
        ctaHref="mailto:info@kidsjumptech.com?subject=Showroom%20or%20Zoom%20visit"
        backgroundImage="https://kidsjumptech.com/wp-content/uploads/2023/04/Capture-1.jpg"
      />
      <GamesGallery
        title="Meet the A-list of Games and Activities."
        description="Are you ready for a game-changer? Our collection of move-worthy games and activities (and growing) is the ultimate solution to combining fun, exercise, and learning!"
        query={{ limit: 12, fields: ["slug", "title", "hero_image"] }}
      />
      <Reviews
        title="Feedback and suggestions"
        items={reviews}
        ctaHref="https://go.repute.city/kids-jump-tech"
        ctaLabel="Leave a review"
      />
      <News
        title="News & Insights"
        description="See How Interactive Technologies are Shaping the Future of Education"
        query={{
          limit: 8,
          fields: ["slug", "title", "featured_image", "published_at", "categories"],
        }}
      />
      <HighlightCTA
        title="Transform Your Environment 🚀"
        description="If you are ready to elevate your space with cutting-edge interactive technology we are here to make it a reality for you. Reach out to us today and let’s make learning an adventure! 🌟"
        ctaLabel="Contact Us"
        ctaHref="mailto:info@kidsjumptech.com?subject=Transform%20my%20space"
      />
    </main>
  );
}

const VALUES_DATA = [
  {
    title: "Warranty",
    description: "From 2 to 5 years on all equipment",
    icon: "ShieldCheck",
  },
  {
    title: "Technical Support",
    description: "24/7 remote technical support for prompt software issue resolution",
    icon: "Headset",
  },
  {
    title: "No Subscriptions",
    description: "You only pay once for the equipment, games, and subsequent updates.",
    icon: "Ban",
  },
  {
    title: "Useful",
    description: "Our equipment is designed to help develop certain skills. Compatible with special needs kids",
    icon: "HeartHandshake",
  },
];

const STATS_DATA = [
  { value: "100%", label: "Positive Feedback" },
  { value: "21+", label: "Interactive products" },
  { value: "40+", label: "Countries" },
];

const CORE_FEATURES = [
  { title: "High Quality", description: "Our equipment is developed and made in the USA", icon: "Award" },
  { title: "Reputation", description: "We have over 90 5-star reviews", icon: "Star" },
  { title: "Turnkey Delivery", description: "Your product will be delivered safely. We provide free training.", icon: "Truck" },
  { title: "Mobility", description: "Easy to move, no ceiling attachment needed.", icon: "Move" },
  { title: "High-Speed Sensors", description: "Sensors instantly react to touch.", icon: "Zap" },
  { title: "Free Updates", description: "Clients receive new games and software for free regularly.", icon: "RefreshCw" },
  { title: "Customization", description: "We customize products with any color, design, or logo.", icon: "Palette" },
  { title: "Easy Setup", description: "Just plug the equipment into an outlet and you're set.", icon: "Plug" },
  { title: "Premium Support", description: "24/7 remote help plus onboarding.", icon: "LifeBuoy" },
];

const HERO_SLIDES = [
  { id: 1, videoId: "QNT7l1TT7_0", alt: "Interactive Floor" },
  { id: 2, videoId: "Ktkh_mW2ADg", alt: "Interactive Wall" },
  { id: 3, videoId: "nJSXQ9uxvO0", alt: "Alive Sketches" },
  { id: 4, videoId: "ojKgw68k1Qk", alt: "Interactive Climbing" },
];
