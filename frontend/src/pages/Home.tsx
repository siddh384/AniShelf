import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

import { useEffect, useState } from "react";
import { fetchTrendingAnime } from "@/lib/anilist";

export default function Home() {
  const { data: session, isPending } = authClient.useSession();

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

  const handleSignOut = async () => {
    await authClient.signOut();
    toast.success("Logged out successfully");
  };

  return (
    <div className="min-h-screen bg-[#050c1a] text-white flex flex-col items-center pt-20 p-4">
      <div className="max-w-4xl w-full text-center space-y-8">
        <h1
          className="text-5xl font-black tracking-tight"
          style={{ fontFamily: "'Sora', sans-serif" }}
        >
          Welcome to Anime<span className="text-[#4f8ef5]">Tracker</span>
        </h1>

        <p className="text-xl text-[#6b9fd4]">
          {session
            ? `Welcome back, ${session.user.name || "Nakama"}! 🏴‍☠️`
            : "The ultimate public homepage. Anyone can see this!"}
        </p>

        <div className="flex gap-4 justify-center pt-4 pb-12">
          {isPending ? (
            <Button
              disabled
              className="bg-[#1e3356] text-[#6b9fd4] px-8 py-6 rounded-xl text-lg"
            >
              Loading...
            </Button>
          ) : session ? (
            <Button
              onClick={handleSignOut}
              variant="outline"
              className="border-red-900/50 text-red-400 hover:bg-red-950/30 px-8 py-6 rounded-xl text-lg font-semibold cursor-pointer"
            >
              Log Out
            </Button>
          ) : (
            <Link to="/auth">
              <Button className="bg-[#3b7de9] hover:bg-[#2563cc] text-white px-8 py-6 rounded-xl text-lg font-semibold cursor-pointer">
                Log In / Sign Up
              </Button>
            </Link>
          )}
        </div>

        {/* --- TRENDING ANIME SECTION --- */}
        <div className="text-left space-y-6">
          <h2 className="text-2xl font-bold text-white border-b border-[#1e3356] pb-2">
            Trending Right Now
          </h2>

          {loadingAnime ? (
            <p className="text-[#6b9fd4]">Fetching from AniList...</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
              {trendingAnime.map((anime) => (
                <div key={anime.id} className="space-y-2 group cursor-pointer">
                  <div className="overflow-hidden rounded-xl border border-[#1e3356] transition-transform duration-300 group-hover:scale-105 group-hover:border-[#3b7de9]">
                    <img
                      src={anime.coverImage.extraLarge}
                      alt={anime.title.english || anime.title.romaji}
                      className="w-full aspect-[2/3] object-cover"
                    />
                  </div>
                  <h3 className="text-sm font-semibold text-[#a8c8f0] line-clamp-2 leading-tight group-hover:text-white transition-colors">
                    {anime.title.english || anime.title.romaji}
                  </h3>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
