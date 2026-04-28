import { Hono } from "hono";
import { cors } from "hono/cors";
import { auth, prisma } from "./auth.js";
import { serve } from "@hono/node-server";

const app = new Hono();

app.use(
  "*",
  cors({
    origin: "http://localhost:5173", // Must exactly match your frontend URL
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["POST", "GET", "OPTIONS"],
    credentials: true, // <-- CRITICAL: Allows the auth cookie to pass through
  }),
);

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

// --- ADD THIS TO YOUR BACKEND HONO APP ---

// 1. ADD OR UPDATE AN ITEM ON THE SHELF
app.post("/api/shelf", async (c) => {
  // Check if the user is securely logged in
  const session = await auth.api.getSession({ headers: c.req.raw.headers });
  if (!session) return c.json({ error: "Unauthorized" }, 401);

  const body = await c.req.json();
  const { apiId, type, title, posterUrl, status } = body;

  // UPSERT: If it exists, update the status. If it doesn't, create it!
  const item = await prisma.shelfItem.upsert({
    where: {
      userId_apiId: { userId: session.user.id, apiId },
    },
    update: { status },
    create: {
      userId: session.user.id,
      apiId,
      type,
      title,
      posterUrl,
      status,
    },
  });
  return c.json(item);
});

// 2. GET THE USER'S ENTIRE SHELF
app.get("/api/shelf", async (c) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });
  if (!session) return c.json({ error: "Unauthorized" }, 401);

  const items = await prisma.shelfItem.findMany({
    where: { userId: session.user.id },
    orderBy: { updatedAt: "desc" }, // Show most recently updated first
  });
  return c.json(items);
});
