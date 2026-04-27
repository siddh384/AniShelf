import { useEffect, useState } from "react";
import { fetchMedia } from "@/lib/anilist";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Link } from "@tanstack/react-router";

export default function Manga() {
  const [trending, setTrending] = useState<any[]>([]);
  const [popular, setPopular] = useState<any[]>([]);
  const [topRated, setTopRated] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [heroIndex, setHeroIndex] = useState(0);

  useEffect(() => {
    const loadData = async () => {
      // Fetch all three categories at once!
      const [trendData, popData, topData] = await Promise.all([
        fetchMedia("MANGA", "TRENDING_DESC"),
        fetchMedia("MANGA", "POPULARITY_DESC"),
        fetchMedia("MANGA", "SCORE_DESC"),
      ]);
      setTrending(trendData);
      setPopular(popData);
      setTopRated(topData);
      setLoading(false);
    };
    loadData();
  }, []);

  useEffect(() => {
    if (trending.length === 0) return;
    const interval = setInterval(
      () => setHeroIndex((prev) => (prev + 1) % 5),
      5000,
    );
    return () => clearInterval(interval);
  }, [trending]);

  const heroMedia = trending.length > 0 ? trending[heroIndex] : null;

  // Reusable Carousel Component
  const MediaCarousel = ({ items }: { items: any[] }) => (
    <Carousel opts={{ align: "start", loop: true }} className="w-full relative">
      <CarouselContent className="-ml-4 py-4">
        {items.map((item) => (
          <CarouselItem
            key={item.id}
            className="pl-4 basis-1/2 md:basis-1/4 lg:basis-1/5"
          >
            <Link
              to="/manga/$id"
              params={{ id: item.id.toString() }}
              className="space-y-3 group cursor-pointer block"
            >
              <div className="relative aspect-[2/3] overflow-hidden rounded-xl border border-[#cae8fa] dark:border-[#1e3356] transition-colors duration-300 group-hover:border-[#4f8ef5] dark:group-hover:border-[#3b7de9] shadow-md">
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
  );

  if (loading)
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-[#4f8ef5] animate-pulse text-lg">Loading Anime...</p>
      </div>
    );

  return (
    <div className="flex-1 flex flex-col pb-12">
      {/* HERO SECTION */}
      {heroMedia && (
        <div className="relative w-full h-[450px] md:h-[550px] bg-[#f4f9fd] dark:bg-[#050c1a]">
          <img
            key={heroMedia.id}
            src={heroMedia.bannerImage || heroMedia.coverImage.extraLarge}
            alt="Hero Banner"
            className="absolute inset-0 w-full h-full object-cover opacity-90 animate-in fade-in duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#f4f9fd] dark:from-[#050c1a] via-[#f4f9fd]/20 dark:via-[#050c1a]/20 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#f4f9fd]/50 dark:via-[#050c1a]/50 to-[#f4f9fd] dark:to-[#050c1a] hidden md:block" />
          <div className="absolute inset-0 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-end md:items-center pb-8 md:pb-0">
            <div className="flex flex-col justify-end w-full md:w-1/2 h-full z-10 space-y-4 pb-4 md:pb-0">
              <h2
                className="text-3xl md:text-5xl font-black text-[#050c1a] dark:text-white drop-shadow-md line-clamp-2"
                style={{ fontFamily: "'Sora', sans-serif" }}
              >
                {heroMedia.title.english || heroMedia.title.romaji}
              </h2>
              <Button className="w-fit bg-[#3b7de9] hover:bg-[#2563cc] text-white font-semibold rounded-full px-8 shadow-lg">
                Know More
              </Button>
            </div>
            <div className="flex flex-col justify-center items-end text-right w-full md:w-1/2 z-10 space-y-4 hidden md:flex">
              <h1
                className="text-4xl md:text-5xl font-black text-[#050c1a] dark:text-white tracking-tight drop-shadow-md"
                style={{ fontFamily: "'Sora', sans-serif" }}
              >
                Explore Manga
              </h1>
              <div className="relative w-full max-w-md mt-4">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#1e3356] dark:text-white/70" />
                <Input
                  placeholder="Search anime..."
                  className="pl-12 h-14 bg-white/60 dark:bg-black/40 backdrop-blur-md border-[#cae8fa] dark:border-white/20 text-[#050c1a] dark:text-white rounded-2xl focus-visible:ring-[#4f8ef5] shadow-xl text-lg"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CAROUSELS */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 space-y-16">
        {/* TABS CAROUSEL */}
        <Tabs defaultValue="today" className="w-full">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 gap-4">
            <h3 className="text-xl font-bold text-[#050c1a] dark:text-white tracking-wide">
              Trending
            </h3>
            <TabsList className="bg-[#e0f0fa] dark:bg-[#0b1629] border border-[#cae8fa] dark:border-[#1e3356]">
              <TabsTrigger
                value="today"
                className="data-[state=active]:bg-white dark:data-[state=active]:bg-[#1e3356] data-[state=active]:text-[#4f8ef5] dark:data-[state=active]:text-white transition-colors"
              >
                Today
              </TabsTrigger>
              <TabsTrigger
                value="month"
                className="data-[state=active]:bg-white dark:data-[state=active]:bg-[#1e3356] data-[state=active]:text-[#4f8ef5] dark:data-[state=active]:text-white transition-colors"
              >
                This Month
              </TabsTrigger>
              <TabsTrigger
                value="alltime"
                className="data-[state=active]:bg-white dark:data-[state=active]:bg-[#1e3356] data-[state=active]:text-[#4f8ef5] dark:data-[state=active]:text-white transition-colors"
              >
                All Time
              </TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="today">
            <MediaCarousel items={trending} />
          </TabsContent>
          <TabsContent value="month">
            <MediaCarousel items={popular} />
          </TabsContent>
          <TabsContent value="alltime">
            <MediaCarousel items={topRated} />
          </TabsContent>
        </Tabs>

        {/* REGULAR CAROUSELS */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-[#050c1a] dark:text-white tracking-wide">
            All Time Popular
          </h3>
          <MediaCarousel items={popular} />
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-bold text-[#050c1a] dark:text-white tracking-wide">
            Recommended for you
          </h3>
          <MediaCarousel items={topRated} />
        </div>
      </div>
    </div>
  );
}
