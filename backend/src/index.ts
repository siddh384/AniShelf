import { Hono } from "hono";
import { cors } from "hono/cors";
import { auth } from "./auth.js";
import { serve } from "@hono/node-server";

const app = new Hono();

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

// 1. The CORS Bridge
// This tells Hono: "It is safe to accept requests from our React app!"
app.use(
  "/api/*",
  cors({
    origin: "http://localhost:5173",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["POST", "GET", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
    credentials: true, // CRUCIAL: This allows cookies/sessions to pass through
  }),
);

// 2. Mount Better Auth
// This single line automatically generates ALL your auth routes
// (like /api/auth/sign-in, /api/auth/sign-up, /api/auth/sign-out)
app.on(["POST", "GET"], "/api/auth/**", (c) => {
  return auth.handler(c.req.raw);
});

// Just a test route to make sure the server is alive
app.get("/", (c) => {
  return c.text("Hono is running!");
});

const port = 3000;
console.log(`🚀 Backend Server is running on http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port,
});
