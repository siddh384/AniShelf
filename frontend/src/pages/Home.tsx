import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

export default function Home() {
  const { data: session, isPending } = authClient.useSession();

  const handleSignOut = async () => {
    await authClient.signOut();
    toast.success("Logged out successfully");
  };

  return (
    <div className="min-h-screen bg-[#050c1a] text-white flex flex-col items-center justify-center p-4">
      <div className="max-w-2xl text-center space-y-8">
        <h1
          className="text-5xl font-black tracking-tight"
          style={{ fontFamily: "'Sora', sans-serif" }}
        >
          Welcome to Anime<span className="text-[#4f8ef5]">Tracker</span>
        </h1>

        {/* Dynamic Welcome Message */}
        <p className="text-xl text-[#6b9fd4]">
          {session
            ? `Welcome back, ${session.user.name || "Nakama"}! 🏴‍☠️`
            : "The ultimate public homepage. Anyone can see this!"}
        </p>

        <div className="flex gap-4 justify-center pt-8">
          {/* If loading, show nothing or a spinner. If logged in, show Log Out. Otherwise, show Log In. */}
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
              className="border-red-900/50 text-red-400 hover:bg-red-950/30 px-8 py-6 rounded-xl text-lg font-semibold"
            >
              Log Out
            </Button>
          ) : (
            <Link to="/auth">
              <Button className="bg-[#3b7de9] hover:bg-[#2563cc] text-white px-8 py-6 rounded-xl text-lg font-semibold">
                Log In / Sign Up
              </Button>
            </Link>
          )}

          <Button
            variant="outline"
            className="border-[#1e3356] text-[#a8c8f0] hover:bg-[#0f1e38] px-8 py-6 rounded-xl text-lg"
          >
            Explore Anime (Public)
          </Button>
        </div>
      </div>
    </div>
  );
}
