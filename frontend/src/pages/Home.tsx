import { useEffect, useState } from "react";
import { fetchTrendingAnime, fetchTrendingManga } from "@/lib/anilist";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Link } from "@tanstack/react-router";
// import { Link } from "@tanstack/react-router";

export default function Home() {
  const [trendingAnime, setTrendingAnime] = useState<any[]>([]);
  const [trendingManga, setTrendingManga] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [heroIndex, setHeroIndex] = useState(0);

  useEffect(() => {
    const loadData = async () => {
      const [animeData, mangaData] = await Promise.all([
        fetchTrendingAnime(),
        fetchTrendingManga(),
      ]);
      setTrendingAnime(animeData);
      setTrendingManga(mangaData);
      setLoading(false);
    };
    loadData();
  }, []);

  useEffect(() => {
    if (trendingAnime.length === 0) return;
    const interval = setInterval(() => {
      setHeroIndex((prevIndex) => (prevIndex + 1) % 5);
    }, 5000);
    return () => clearInterval(interval);
  }, [trendingAnime]);

  const heroMedia = trendingAnime.length > 0 ? trendingAnime[heroIndex] : null;

  const MediaCarousel = ({ title, items }: { title: string; items: any[] }) => (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-[#050c1a] dark:text-white tracking-wide">
        {title}
      </h3>
      <Carousel
        opts={{ align: "start", loop: true }}
        className="w-full relative"
      >
        <CarouselContent className="-ml-4 py-4">
          {items.map((item) => (
            <CarouselItem
              key={item.id}
              className="pl-4 basis-1/2 md:basis-1/4 lg:basis-1/5"
            >
              <Link
                to="/anime/$id"
                params={{ id: item.id.toString() }}
                className="space-y-3 group cursor-pointer block"
              >
                <div className="relative aspect-[2/3] overflow-hidden rounded-xl border border-[#cae8fa] dark:border-[#1e3356] transition-colors duration-300 group-hover:border-[#4f8ef5] dark:group-hover:border-[#3b7de9] shadow-md dark:shadow-lg">
                  <img
                    src={item.coverImage.extraLarge}
                    alt={item.title.english || item.title.romaji}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <h4 className="text-sm font-semibold text-[#1e3356] dark:text-[#a8c8f0] line-clamp-2 leading-tight group-hover:text-[#4f8ef5] dark:group-hover:text-white transition-colors">
                  {item.title.english || item.title.romaji}
                </h4>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="hidden md:block">
          <CarouselPrevious className="absolute -left-4 top-1/2 -translate-y-1/2 border-[#cae8fa] dark:border-[#1e3356] bg-white dark:bg-[#0b1629] text-[#050c1a] dark:text-[#a8c8f0] hover:text-[#4f8ef5]" />
          <CarouselNext className="absolute -right-4 top-1/2 -translate-y-1/2 border-[#cae8fa] dark:border-[#1e3356] bg-white dark:bg-[#0b1629] text-[#050c1a] dark:text-[#a8c8f0] hover:text-[#4f8ef5]" />
        </div>
      </Carousel>
    </div>
  );

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-[#4f8ef5] dark:text-[#6b9fd4] animate-pulse text-lg">
          Loading Anishelf...
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col pb-12">
      {/* --- EDGE-TO-EDGE HERO SECTION --- 
          Notice this is completely outside of the max-w-7xl wrapper! 
      */}
      {heroMedia && (
        <div className="relative w-full h-[450px] md:h-[550px] bg-[#f4f9fd] dark:bg-[#050c1a]">
          <img
            key={heroMedia.id}
            src={heroMedia.bannerImage || heroMedia.coverImage.extraLarge}
            alt="Hero Banner"
            className="absolute inset-0 w-full h-full object-cover opacity-90 animate-in fade-in duration-1000"
          />

          {/* Theme-aware Gradients to blend the image into the background seamlessly */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#f4f9fd] dark:from-[#050c1a] via-[#f4f9fd]/20 dark:via-[#050c1a]/20 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#f4f9fd]/50 dark:via-[#050c1a]/50 to-[#f4f9fd] dark:to-[#050c1a] hidden md:block" />

          {/* Inner Content Wrapper - Keeps text aligned with the carousels below */}
          <div className="absolute inset-0 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-end md:items-center pb-8 md:pb-0">
            {/* Bottom Left: Title & Button */}
            <div className="flex flex-col justify-end w-full md:w-1/2 h-full z-10 space-y-4 pb-4 md:pb-0">
              <h2
                className="text-3xl md:text-5xl font-black text-[#050c1a] dark:text-white drop-shadow-md line-clamp-2"
                style={{ fontFamily: "'Sora', sans-serif" }}
              >
                {heroMedia.title.english || heroMedia.title.romaji}
              </h2>
              <Button
                className="w-fit bg-[#3b7de9] hover:bg-[#2563cc] text-white font-semibold rounded-full px-8 shadow-lg"
                onClick={() => {}}
              >
                Know More
              </Button>
            </div>

            {/* Right Side: Floating Text & Search Bar */}
            <div className="flex flex-col justify-center items-end text-right w-full md:w-1/2 z-10 space-y-4 hidden md:flex">
              <h1
                className="text-4xl md:text-5xl font-black text-[#050c1a] dark:text-white tracking-tight drop-shadow-md"
                style={{ fontFamily: "'Sora', sans-serif" }}
              >
                Track your favorites
              </h1>
              <p className="text-xl text-[#1e3356] dark:text-[#a8c8f0] font-medium drop-shadow-md">
                Save those you want to see
              </p>

              <div className="relative w-full max-w-md mt-4">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#1e3356] dark:text-white/70" />
                <Input
                  placeholder="Search anime, manga..."
                  className="pl-12 h-14 bg-white/60 dark:bg-black/40 backdrop-blur-md border-[#cae8fa] dark:border-white/20 text-[#050c1a] dark:text-white rounded-2xl focus-visible:ring-[#4f8ef5] placeholder:text-[#1e3356]/70 dark:placeholder:text-white/60 shadow-xl text-lg"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- CAROUSELS --- 
          Now wrapped in their own max-w container so they sit perfectly below the hero 
      */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 space-y-12">
        <MediaCarousel title="Popular Anime" items={trendingAnime} />
        <MediaCarousel title="Popular Manga" items={trendingManga} />
        <MediaCarousel
          title="Recommended for you"
          items={trendingAnime.slice().reverse()}
        />
      </div>
    </div>
  );
}
