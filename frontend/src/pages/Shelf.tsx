import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import ky from "ky";

export default function Shelf() {
  const { data: session, isPending } = authClient.useSession();
  const [shelfItems, setShelfItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShelf = async () => {
      if (!session) {
        setLoading(false);
        return;
      }
      try {
        const data: any[] = await ky
          .get("http://localhost:3000/api/shelf", { credentials: "include" })
          .json();
        setShelfItems(data);
      } catch (error) {
        console.error("Failed to fetch shelf");
      }
      setLoading(false);
    };
    fetchShelf();
  }, [session]);

  if (isPending || loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-[#4f8ef5] animate-pulse text-lg">Loading Shelf...</p>
      </div>
    );
  }

  // --- NON-LOGGED IN VIEW ---
  if (!session) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-[#050c1a] min-h-[80vh] px-4">
        <div className="text-center space-y-8">
          <h2
            className="text-3xl md:text-4xl font-bold text-white max-w-lg mx-auto leading-snug tracking-wide"
            style={{ fontFamily: "'Sora', sans-serif" }}
          >
            Log in, track episodes, own your anime journey.
          </h2>
          <Link to="/auth">
            <Button className="bg-[#1e1b4b] hover:bg-[#312e81] text-white px-10 py-7 rounded-2xl text-xl font-semibold shadow-2xl transition-all hover:scale-105 border border-[#312e81]/50">
              Login/ SignUp
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // --- LOGGED IN VIEW ---
  const animeItems = shelfItems.filter((i) => i.type === "ANIME");
  const mangaItems = shelfItems.filter((i) => i.type === "MANGA");

  // Reusable sub-component for the columns
  const ShelfColumn = ({ title, items }: { title: string; items: any[] }) => (
    <div className="flex flex-col space-y-4 w-full md:w-1/3">
      <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
      {items.length === 0 ? (
        <div className="h-24 rounded-xl border border-[#1e3356] border-dashed flex items-center justify-center text-[#1e3356]">
          Empty
        </div>
      ) : (
        items.map((item) => (
          <Link
            key={item.id}
            to={item.type === "ANIME" ? "/anime/$id" : "/manga/$id"}
            params={{ id: item.apiId.toString() }}
          >
            <div className="relative h-24 rounded-xl overflow-hidden border border-[#1e3356] hover:border-[#4f8ef5] transition-colors group cursor-pointer bg-[#0b1629]">
              <img
                src={item.posterUrl}
                alt={item.title}
                className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-60 transition-opacity"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#050c1a] via-[#050c1a]/80 to-transparent p-4 flex items-center">
                <span className="text-white font-semibold line-clamp-2 drop-shadow-md z-10">
                  {item.title}
                </span>
              </div>
            </div>
          </Link>
        ))
      )}
    </div>
  );

  const renderSection = (title: string, items: any[]) => (
    <div className="space-y-8 mb-16">
      <h2
        className="text-3xl font-black text-white border-b border-[#1e3356] pb-4"
        style={{ fontFamily: "'Sora', sans-serif" }}
      >
        {title}
      </h2>

      <div className="flex flex-col md:flex-row gap-8">
        <ShelfColumn
          title="Currently"
          items={items.filter((i) => i.status === "CURRENT")}
        />
        <ShelfColumn
          title="On Hold"
          items={items.filter((i) => i.status === "ON_HOLD")}
        />
        <ShelfColumn
          title="Completed"
          items={items.filter((i) => i.status === "COMPLETED")}
        />
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <ShelfColumn
          title="Planning"
          items={items.filter((i) => i.status === "PLANNING")}
        />
        <ShelfColumn
          title="Dropped"
          items={items.filter((i) => i.status === "DROPPED")}
        />
        {/* Empty 3rd column to keep the grid aligned */}
        <div className="hidden md:block w-1/3"></div>
      </div>
    </div>
  );

  return (
    <div className="flex-1 flex flex-col bg-[#050c1a] py-12">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <h1
          className="text-4xl md:text-5xl font-black text-white mb-12"
          style={{ fontFamily: "'Sora', sans-serif" }}
        >
          Your Shelf
        </h1>
        {renderSection("Anime", animeItems)}
        {renderSection("Manga", mangaItems)}
      </div>
    </div>
  );
}
