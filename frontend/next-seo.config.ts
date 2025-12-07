import { DefaultSeoProps } from 'next-seo';

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://kidsjumptech.com').replace(/\/+$/, '');

const config: DefaultSeoProps = {
  title: 'Kids Jump Tech | Interactive Equipment for Kids',
  titleTemplate: '%s | Kids Jump Tech',
  defaultTitle: 'Kids Jump Tech | Interactive Equipment for Kids',
  description:
    'Turn any space into an interactive adventure. Explore Kids Jump Tech games, immersive floors, sandboxes, and digital parks built for active learning.',
  canonical: siteUrl || 'https://kidsjumptech.com',
  openGraph: {
    url: siteUrl || 'https://kidsjumptech.com',
    type: 'website',
    siteName: 'Kids Jump Tech',
    title: 'Kids Jump Tech | Interactive Equipment for Kids',
    description:
      'Turn any space into an interactive adventure. Explore Kids Jump Tech games, immersive floors, sandboxes, and digital parks built for active learning.',
    images: [
      {
        url: `${siteUrl || 'https://kidsjumptech.com'}/images/interactive-header/hero-desktop.jpg`,
        width: 1200,
        height: 630,
        alt: 'Kids Jump Tech interactive experiences',
      },
    ],
  },
  twitter: {
    cardType: 'summary_large_image',
    handle: '@kidsjumptech',
    site: '@kidsjumptech',
  },
  robotsProps: {
    nosnippet: false,
    noarchive: false,
    noimageindex: false,
    notranslate: false,
  },
};

export default config;
