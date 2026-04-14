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

// 1. Create a Root Route (This is the wrapper for your whole app)
const rootRoute = createRootRoute({
  component: () => (
    <>
      {/* Outlet is where the current page (Home or Auth) will be injected */}
      <Outlet />
      {/* Toaster stays at the root so it works everywhere! */}
      <Toaster position="bottom-right" theme="dark" />
    </>
  ),
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

// 4. Snap them all together into a Route Tree
const routeTree = rootRoute.addChildren([indexRoute, authRoute]);

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
