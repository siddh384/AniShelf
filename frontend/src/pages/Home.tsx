import { useEffect, useState } from "react";
import { fetchTrendingAnime } from "@/lib/anilist";

export default function Home() {
  const [trendingAnime, setTrendingAnime] = useState<any[]>([]);
  const [loadingAnime, setLoadingAnime] = useState(true);

  useEffect(() => {
    const getAnime = async () => {
      const data = await fetchTrendingAnime();
      setTrendingAnime(data);
      setLoadingAnime(false);
    };
    getAnime();
  }, []);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-left space-y-6">
        {/* Changed border and text color to be responsive */}
        <h2
          className="text-3xl font-black text-[#050c1a] dark:text-white border-b border-[#cae8fa] dark:border-[#1e3356] pb-4 transition-colors duration-300"
          style={{ fontFamily: "'Sora', sans-serif" }}
        >
          Trending Right Now
        </h2>

        {loadingAnime ? (
          <div className="flex items-center justify-center py-20">
            <p className="text-[#4f8ef5] dark:text-[#6b9fd4] animate-pulse text-lg">
              Fetching from AniList...
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {trendingAnime.map((anime) => (
              <div key={anime.id} className="space-y-3 group cursor-pointer">
                {/* Responsive border colors */}
                <div className="overflow-hidden rounded-xl border border-[#cae8fa] dark:border-[#1e3356] transition-transform duration-300 group-hover:scale-105 group-hover:border-[#4f8ef5] dark:group-hover:border-[#3b7de9] shadow-md dark:shadow-lg bg-white dark:bg-transparent">
                  <img
                    src={anime.coverImage.extraLarge}
                    alt={anime.title.english || anime.title.romaji}
                    className="w-full aspect-[2/3] object-cover"
                  />
                </div>
                {/* Responsive text colors */}
                <h3 className="text-sm font-semibold text-[#1e3356] dark:text-[#a8c8f0] line-clamp-2 leading-tight group-hover:text-[#4f8ef5] dark:group-hover:text-white transition-colors">
                  {anime.title.english || anime.title.romaji}
                </h3>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
