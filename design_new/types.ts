
export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}

export interface FeatureItem {
  title: string;
  description: string;
  icon: string; // Lucide icon name mapping
}

export interface ProductCard {
  title: string;
  tagline: string;
  image: string;
  link: string;
  category: string;
}

export interface StatItem {
  value: string;
  label: string;
}

export interface Testimonial {
  name: string;
  date: string;
  rating: number;
  text: string;
  avatar?: string;
}

export interface BlogPost {
  title: string;
  tags: string[];
  date: string;
  image: string;
  link: string;
}
