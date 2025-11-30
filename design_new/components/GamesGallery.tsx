
import React from 'react';
import { cn } from '../lib/utils';

const games = [
    { title: "Whack the Cactus", img: "https://kidsjumptech.com/wp-content/uploads/2025/01/whack-the-cactus.webp" },
    { title: "Unknown Planet", img: "https://kidsjumptech.com/wp-content/uploads/2025/01/unknown-planet.webp" },
    { title: "Underwater Adventure", img: "https://kidsjumptech.com/wp-content/uploads/2025/01/underwater-adventure.webp" },
    { title: "Turn on the Robot", img: "https://kidsjumptech.com/wp-content/uploads/2025/01/turn-on-the-robot.webp" },
    { title: "Treasure Hunt", img: "https://kidsjumptech.com/wp-content/uploads/2025/01/treasure-hunt.webp" },
    { title: "Tic Tac Toe", img: "https://kidsjumptech.com/wp-content/uploads/2025/01/tic-tac-toe.webp" },
    { title: "Cheese Heist", img: "https://kidsjumptech.com/wp-content/uploads/2025/01/the-cheese-heist.webp" },
    { title: "Supermarket", img: "https://kidsjumptech.com/wp-content/uploads/2025/01/supermarket-game.webp" },
];

// Distribute games into 3 rows
const row1 = [games[0], games[1], games[2]];
const row2 = [games[3], games[4], games[5]];
const row3 = [games[6], games[7], games[0]]; // Recycling one to fill the row

const GameCard = ({ game }: { game: typeof games[0] }) => (
    <div className="relative w-[300px] md:w-[400px] aspect-video group overflow-hidden rounded-xl cursor-pointer shrink-0">
        <img 
            src={game.img} 
            alt={game.title} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            draggable={false}
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <span className="bg-white text-brand-dark font-bold py-2 px-6 rounded-full text-sm">
                Learn More
            </span>
        </div>
    </div>
);

interface MarqueeRowProps {
    items: typeof games;
    duration: string;
    reverse?: boolean;
}

const MarqueeRow: React.FC<MarqueeRowProps> = ({ items, duration, reverse = false }) => {
    // Repeat items enough times to fill a wide screen and create a loop buffer
    const repeatedItems = [...items, ...items, ...items, ...items]; 

    return (
        <div className="flex overflow-hidden gap-6 select-none group/row py-2">
            <div 
                className={cn(
                    "flex shrink-0 gap-6 items-center min-w-full",
                    reverse ? "animate-marquee-reverse" : "animate-marquee"
                )}
                style={{ animationDuration: duration }}
            >
                {repeatedItems.map((game, i) => (
                    <GameCard key={`${i}-a`} game={game} />
                ))}
            </div>
            <div 
                aria-hidden="true"
                className={cn(
                    "flex shrink-0 gap-6 items-center min-w-full",
                    reverse ? "animate-marquee-reverse" : "animate-marquee"
                )}
                style={{ animationDuration: duration }}
            >
                {repeatedItems.map((game, i) => (
                    <GameCard key={`${i}-b`} game={game} />
                ))}
            </div>
        </div>
    );
};

const GamesGallery: React.FC = () => {
  return (
    <section className="py-16 bg-white overflow-hidden">
        {/* Inject CSS for Marquee Animations within the component to avoid global pollution */}
        <style>{`
            @keyframes marquee {
                from { transform: translateX(0); }
                to { transform: translateX(calc(-100% - 24px)); } /* 24px is the gap-6 */
            }
            @keyframes marquee-reverse {
                from { transform: translateX(calc(-100% - 24px)); }
                to { transform: translateX(0); }
            }
            .animate-marquee {
                animation: marquee linear infinite;
            }
            .animate-marquee-reverse {
                animation: marquee-reverse linear infinite;
            }
            /* Pause only the specific row being hovered */
            .group\\/row:hover .animate-marquee,
            .group\\/row:hover .animate-marquee-reverse {
                animation-play-state: paused;
            }
        `}</style>

        <div className="container mx-auto px-4 text-center mb-16">
            <h2 className="font-heading font-bold text-[40px] md:text-[64px] leading-tight text-brand-dark mb-6">
                Meet the A-list of Games and Activities.
            </h2>
            <p className="font-sans text-lg md:text-[20px] text-gray-600 max-w-7xl mx-auto leading-relaxed">
                Are you ready for a game-changer? Our collection of move-worthy games and activities (and growing) is the ultimate solution to combining fun, exercise, and learning!
            </p>
        </div>

        <div className="flex flex-col gap-6 w-full">
            <MarqueeRow items={row1} duration="80s" />
            <MarqueeRow items={row2} duration="70s" reverse />
            <MarqueeRow items={row3} duration="90s" />
        </div>
        
    </section>
  );
};

export default GamesGallery;
