import { Link, useNavigate } from "@tanstack/react-router";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useTheme } from "@/components/theme-provider";
import { Menu } from "lucide-react"; // Import Menu icon
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const { data: session } = authClient.useSession();
  const { setTheme } = useTheme();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await authClient.signOut();
    toast.success("Logged out successfully");
    navigate({ to: "/" });
  };

  // Move links to a constant to avoid repeating code
  const navLinks = [
    { to: "/", label: "Home", active: true },
    { to: "/anime", label: "Anime", disabled: false },
    { to: "/manga", label: "Manga", disabled: false },
    { to: "/shelf", label: "Shelf", disabled: false },
  ];

  return (
    <nav className="w-full border-b border-[#cae8fa] dark:border-[#1e3356] bg-white/95 dark:bg-[#050c1a]/95 backdrop-blur sticky top-0 z-50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-4">
            {/* MOBILE: Hamburger Menu (Left Side) */}
            <div className="md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-[#050c1a] dark:text-white"
                  >
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="left"
                  className="bg-white dark:bg-[#050c1a] border-[#cae8fa] dark:border-[#1e3356] w-[250px]"
                >
                  <SheetHeader>
                    <SheetTitle className="text-left text-[#050c1a] dark:text-white font-black">
                      Ani<span className="text-[#4f8ef5]">shelf</span>
                    </SheetTitle>
                  </SheetHeader>
                  <div className="flex flex-col gap-4 mt-8">
                    {navLinks.map((link) => (
                      <Link
                        key={link.label}
                        to={link.to}
                        className={`text-lg font-medium transition-colors ${
                          link.disabled
                            ? "opacity-50 cursor-not-allowed"
                            : "text-[#4f8ef5] dark:text-[#a8c8f0] hover:text-[#3b7de9] dark:hover:text-white"
                        }`}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            {/* LOGO */}
            <Link
              to="/"
              className="text-2xl font-black tracking-tight text-[#050c1a] dark:text-white"
              style={{ fontFamily: "'Sora', sans-serif" }}
            >
              Ani<span className="text-[#4f8ef5]">shelf</span>
            </Link>

            {/* DESKTOP: Navigation Links */}
            <div className="hidden md:flex items-center gap-6 text-sm font-medium text-[#4f8ef5] dark:text-[#a8c8f0]">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.to}
                  className={`transition-colors ${
                    link.disabled
                      ? "cursor-not-allowed opacity-50"
                      : "hover:text-[#3b7de9] dark:hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* RIGHT: User Profile Dropdown */}
          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-10 w-10 rounded-full border-2 border-[#1e3356] hover:border-[#4f8ef5] overflow-hidden p-0"
                >
                  {session?.user?.image ? (
                    <img
                      src={session.user.image}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-[#a8c8f0] font-bold">
                      {session?.user?.name
                        ? session.user.name.charAt(0).toUpperCase()
                        : "U"}
                    </span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              {/* ... Dropdown content remains same as previous version ... */}
              <DropdownMenuContent
                align="end"
                className="w-48 bg-white dark:bg-[#0b1629] border-[#cae8fa] dark:border-[#1e3356] text-[#050c1a] dark:text-[#a8c8f0]"
              >
                <Link to="/profile">
                  <DropdownMenuItem className="cursor-pointer focus:bg-[#f4f9fd] dark:focus:bg-[#162848]">
                    View Profile
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger className="cursor-pointer focus:bg-[#f4f9fd] dark:focus:bg-[#162848]">
                    Theme
                  </DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent className="bg-white dark:bg-[#0b1629] border-[#cae8fa] dark:border-[#1e3356]">
                      <DropdownMenuItem
                        onClick={() => setTheme("light")}
                        className="cursor-pointer"
                      >
                        Light
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setTheme("dark")}
                        className="cursor-pointer"
                      >
                        Dark
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setTheme("system")}
                        className="cursor-pointer"
                      >
                        System
                      </DropdownMenuItem>
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
                <DropdownMenuSeparator className="bg-[#cae8fa] dark:bg-[#1e3356]" />
                {session ? (
                  <DropdownMenuItem
                    onClick={handleSignOut}
                    className="text-red-500 focus:bg-red-50 dark:focus:bg-red-950/50 cursor-pointer"
                  >
                    Log Out
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem
                    onClick={() => navigate({ to: "/auth" })}
                    className="text-[#4f8ef5] focus:bg-[#f4f9fd] dark:focus:bg-[#162848] cursor-pointer"
                  >
                    Log In
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
}
