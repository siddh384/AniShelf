import Anime from "./pages/Anime";
import Manga from "./pages/Manga";
import Details from "./pages/Details";

import {
  RouterProvider,
  createRouter,
  createRoute,
  createRootRoute,
  Outlet,
} from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import Navbar from "@/components/Navbar";
import { ThemeProvider } from "@/components/theme-provider";

// 1. Create a Root Route (This is the wrapper for your whole app)
const rootRoute = createRootRoute({
  component: () => (
    <ThemeProvider defaultTheme="dark" storageKey="anishelf-theme">
      <div className="min-h-screen bg-[#f4f9fd] dark:bg-[#050c1a] text-[#050c1a] dark:text-white flex flex-col transition-colors duration-300">
        <Navbar />
        <main className="flex-1 flex flex-col">
          <Outlet />
        </main>
        <Toaster position="bottom-right" />
      </div>
    </ThemeProvider>
  ),
});

const animeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/anime",
  component: Anime,
});

const mangaRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/manga",
  component: Manga,
});

// 2. Create the Home Route
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Home,
});

// 3. Create the Auth Route
const authRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/auth",
  component: Auth,
});

const animeDetailsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/anime/$id",
  component: () => <Details type="ANIME" />,
});

const mangaDetailsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/manga/$id",
  component: () => <Details type="MANGA" />,
});

// 4. Snap them all together into a Route Tree
const routeTree = rootRoute.addChildren([
  indexRoute,
  authRoute,
  animeRoute,
  mangaRoute,
  animeDetailsRoute,
  mangaDetailsRoute,
]);

// 5. Initialize the Router
const router = createRouter({ routeTree });

// 6. Register the router for magical TypeScript auto-complete across your app
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

// 7. Render the App!
export default function App() {
  return <RouterProvider router={router} />;
}
