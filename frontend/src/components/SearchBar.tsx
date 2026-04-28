import { useState, useEffect, useRef } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { searchMedia } from "@/lib/anilist";

export function SearchBar({ type }: { type?: "ANIME" | "MANGA" }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Debounced Search Effect
  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      const data = await searchMedia(query, type);
      setResults(data);
      setIsLoading(false);
      setIsOpen(true);
    }, 500); // Waits 500ms after typing stops

    return () => clearTimeout(timer);
  }, [query, type]);

  // Click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (id: number, mediaType: string) => {
    setIsOpen(false);
    setQuery("");
    navigate({
      to: mediaType === "MANGA" ? "/manga/$id" : "/anime/$id",
      params: { id: id.toString() },
    });
  };

  return (
    <div ref={wrapperRef} className="relative w-full max-w-md mt-4 z-50">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#1e3356] dark:text-white/70" />
      <Input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => query.trim().length >= 2 && setIsOpen(true)}
        placeholder={`Search ${type ? type.toLowerCase() : "anime, manga"}...`}
        className="pl-12 h-14 bg-white/60 dark:bg-black/40 backdrop-blur-md border-[#cae8fa] dark:border-white/20 text-[#050c1a] dark:text-white rounded-2xl focus-visible:ring-[#4f8ef5] placeholder:text-[#1e3356]/70 dark:placeholder:text-white/60 shadow-xl text-lg"
      />

      {/* Loading Spinner */}
      {isLoading && (
        <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 animate-spin text-[#4f8ef5]" />
      )}

      {/* Dropdown Results */}
      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-[#0b1629]/95 backdrop-blur-md border border-[#1e3356] rounded-xl shadow-2xl overflow-hidden">
          {results.map((item) => (
            <div
              key={item.id}
              onClick={() => handleSelect(item.id, item.type)}
              className="flex items-center gap-4 p-3 hover:bg-[#1e3356] cursor-pointer transition-colors border-b border-[#1e3356]/50 last:border-0"
            >
              <img
                src={item.coverImage.medium}
                alt={item.title.english || item.title.romaji}
                className="w-10 h-14 object-cover rounded"
              />
              <span className="text-white font-medium line-clamp-2">
                {item.title.english || item.title.romaji}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
