import { useEffect, useState } from "react";
import { useParams, Link } from "@tanstack/react-router";
import { fetchMediaDetails } from "@/lib/anilist";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ThumbsUp, Star, Heart, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export default function Details({ type }: { type: "ANIME" | "MANGA" }) {
  // TanStack Router hook to grab the ID from the URL (e.g., /anime/21 -> grabs '21')
  const { id } = useParams({ strict: false });

  const [media, setMedia] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [descExpanded, setDescExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const loadDetails = async () => {
      setLoading(true);
      const data = await fetchMediaDetails(Number(id), type);
      setMedia(data);
      setLoading(false);
    };
    loadDetails();
  }, [id, type]);

  if (loading || !media) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-[#4f8ef5] animate-pulse text-lg">
          Loading Details...
        </p>
      </div>
    );
  }

  // Description Logic
  const words = media.description?.replace(/<[^>]*>?/gm, "").split(" ") || [];
  const wordLimit = isMobile ? 40 : 200;
  const isLong = words.length > wordLimit;
  const displayDesc =
    descExpanded || !isLong
      ? words.join(" ")
      : words.slice(0, wordLimit).join(" ") + "...";

  // Extract recommendations cleanly
  const similarMedia = media.recommendations.nodes
    .map((n: any) => n.mediaRecommendation)
    .filter(Boolean);

  return (
    <div className="flex-1 flex flex-col pb-12 bg-[#050c1a]">
      {/* HERO BANNER */}
      <div className="relative w-full h-[250px] md:h-[400px]">
        <img
          src={media.bannerImage || media.coverImage.extraLarge}
          alt="Banner"
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050c1a] to-transparent" />
      </div>

      {/* MAIN CONTENT CONTAINER */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 md:-mt-32 relative z-10 flex flex-col md:flex-row gap-8">
        {/* LEFT COLUMN: Poster & Add to List */}
        <div className="flex flex-col w-[150px] md:w-[250px] flex-shrink-0 space-y-4 mx-auto md:mx-0">
          <div className="rounded-xl overflow-hidden shadow-2xl border-2 border-[#1e3356]">
            <img
              src={media.coverImage.extraLarge}
              alt="Poster"
              className="w-full h-auto object-cover"
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                disabled
                className="w-full bg-[#4f8ef5] hover:bg-[#3b7de9] text-white font-bold flex justify-between items-center opacity-80 cursor-not-allowed"
              >
                Add to List <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[150px] md:w-[250px] bg-[#0b1629] border-[#1e3356] text-[#a8c8f0]">
              <DropdownMenuItem disabled>CURRENT</DropdownMenuItem>
              <DropdownMenuItem disabled>COMPLETED</DropdownMenuItem>
              <DropdownMenuItem disabled>ON_HOLD</DropdownMenuItem>
              <DropdownMenuItem disabled>DROPPED</DropdownMenuItem>
              <DropdownMenuItem disabled>PLANNING</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* RIGHT COLUMN: Info & Tabs */}
        <div className="flex-1 flex flex-col space-y-6 mt-4 md:mt-24">
          <h1
            className="text-3xl md:text-5xl font-black text-white"
            style={{ fontFamily: "'Sora', sans-serif" }}
          >
            {media.title.english || media.title.romaji}
          </h1>

          <p className="text-[#a8c8f0] text-sm md:text-base leading-relaxed">
            {displayDesc}
            {isLong && (
              <button
                onClick={() => setDescExpanded(!descExpanded)}
                className="text-[#4f8ef5] hover:underline ml-2 font-semibold"
              >
                {descExpanded ? "less" : "more..."}
              </button>
            )}
          </p>

          <Tabs defaultValue="characters" className="w-full mt-8">
            <TabsList className="bg-[#0b1629] border border-[#1e3356] w-full justify-start h-auto flex-wrap">
              <TabsTrigger
                value="characters"
                className="data-[state=active]:bg-[#1e3356] data-[state=active]:text-white text-[#6b9fd4]"
              >
                Characters
              </TabsTrigger>
              <TabsTrigger
                value="staff"
                className="data-[state=active]:bg-[#1e3356] data-[state=active]:text-white text-[#6b9fd4]"
              >
                Staff
              </TabsTrigger>
              <TabsTrigger
                value="reviews"
                className="data-[state=active]:bg-[#1e3356] data-[state=active]:text-white text-[#6b9fd4]"
              >
                Reviews
              </TabsTrigger>
              <TabsTrigger
                value="stats"
                className="data-[state=active]:bg-[#1e3356] data-[state=active]:text-white text-[#6b9fd4]"
              >
                Stats
              </TabsTrigger>
            </TabsList>

            {/* RANKINGS BADGES */}
            <div className="flex flex-wrap gap-4 mt-6">
              {media.rankings?.slice(0, 3).map((rank: any, idx: number) => (
                <div
                  key={idx}
                  className="bg-[#0b1629] border border-[#1e3356] rounded-md px-4 py-2 flex items-center gap-2 text-sm font-semibold text-[#a8c8f0]"
                >
                  {rank.type === "RATED" ? (
                    <Star className="h-4 w-4 text-yellow-500" />
                  ) : (
                    <Heart className="h-4 w-4 text-pink-500" />
                  )}
                  #{rank.rank} {rank.context} {rank.year || ""}
                </div>
              ))}
            </div>

            {/* CHARACTERS TAB */}
            <TabsContent value="characters" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {media.characters.edges.map((edge: any, idx: number) => (
                  <div
                    key={idx}
                    className="flex justify-between bg-[#0b1629] rounded-lg overflow-hidden border border-[#1e3356]"
                  >
                    {/* Character */}
                    <div className="flex items-center gap-3 w-1/2">
                      <img
                        src={edge.node.image.large}
                        alt={edge.node.name.full}
                        className="w-16 h-20 object-cover"
                      />
                      <div className="flex flex-col py-2">
                        <span className="text-[#a8c8f0] font-semibold text-sm line-clamp-1">
                          {edge.node.name.full}
                        </span>
                        <span className="text-[#6b9fd4] text-xs">
                          {edge.role}
                        </span>
                      </div>
                    </div>
                    {/* Voice Actor */}
                    {edge.voiceActors[0] && (
                      <div className="flex items-center gap-3 w-1/2 justify-end text-right">
                        <div className="flex flex-col py-2">
                          <span className="text-[#a8c8f0] font-semibold text-sm line-clamp-1">
                            {edge.voiceActors[0].name.full}
                          </span>
                          <span className="text-[#6b9fd4] text-xs">
                            Japanese
                          </span>
                        </div>
                        <img
                          src={edge.voiceActors[0].image.large}
                          alt={edge.voiceActors[0].name.full}
                          className="w-16 h-20 object-cover"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* REVIEWS TAB */}
            <TabsContent value="reviews" className="mt-6 space-y-4">
              {media.reviews.nodes.map((review: any) => (
                <div
                  key={review.id}
                  className="flex items-center gap-4 bg-[#0b1629] p-4 rounded-lg border border-[#1e3356]"
                >
                  <img
                    src={review.user.avatar.large}
                    alt={review.user.name}
                    className="w-12 h-12 rounded-full border border-[#1e3356]"
                  />
                  <div className="flex-1">
                    <p className="text-[#a8c8f0] text-sm italic line-clamp-2">
                      "{review.summary}"
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-[#6b9fd4] text-sm font-bold">
                    <ThumbsUp className="h-4 w-4" /> {review.rating}
                  </div>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="staff">
              <p className="text-[#6b9fd4] mt-4">
                Staff details coming soon...
              </p>
            </TabsContent>
            <TabsContent value="stats">
              <p className="text-[#6b9fd4] mt-4">
                Stats & Analytics coming soon...
              </p>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* SIMILAR WATCH CAROUSEL */}
      {similarMedia.length > 0 && (
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 space-y-4">
          <h3 className="text-2xl font-bold text-white tracking-wide">
            Similar {type === "ANIME" ? "Watch" : "Read"}
          </h3>
          <Carousel
            opts={{ align: "start", loop: true }}
            className="w-full relative"
          >
            <CarouselContent className="-ml-4 py-4">
              {similarMedia.map((item: any) => (
                <CarouselItem
                  key={item.id}
                  className="pl-4 basis-1/2 md:basis-1/4 lg:basis-1/5"
                >
                  <Link
                    to={type === "ANIME" ? "/anime/$id" : "/manga/$id"}
                    params={{ id: item.id.toString() }}
                    className="space-y-3 group cursor-pointer block"
                  >
                    <div className="relative aspect-[2/3] overflow-hidden rounded-xl border border-[#1e3356] transition-colors duration-300 group-hover:border-[#4f8ef5] shadow-lg">
                      <img
                        src={item.coverImage.extraLarge}
                        alt={item.title.english || item.title.romaji}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                    <h4 className="text-sm font-semibold text-[#a8c8f0] line-clamp-2 leading-tight group-hover:text-white transition-colors">
                      {item.title.english || item.title.romaji}
                    </h4>
                  </Link>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="hidden md:block">
              <CarouselPrevious className="absolute -left-4 top-1/2 -translate-y-1/2 border-[#1e3356] bg-[#0b1629] text-[#a8c8f0] hover:text-[#4f8ef5]" />
              <CarouselNext className="absolute -right-4 top-1/2 -translate-y-1/2 border-[#1e3356] bg-[#0b1629] text-[#a8c8f0] hover:text-[#4f8ef5]" />
            </div>
          </Carousel>
        </div>
      )}
    </div>
  );
}
