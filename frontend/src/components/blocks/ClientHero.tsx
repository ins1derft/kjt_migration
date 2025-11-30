'use client';
import Hero, { type HeroProps } from "./Hero";

const ClientHero: React.FC<HeroProps> = (props) => <Hero {...props} />;

export default ClientHero;
