import { Link, useNavigate } from "@tanstack/react-router";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
// import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";

// ─── Navy Blue Palette ───────────────────────────────────────────────────────
// bg-[#050c1a]   → deepest navy  (page bg)
// bg-[#0b1629]   → dark navy     (panel / card)
// bg-[#0f1e38]   → mid navy      (input bg)
// bg-[#162848]   → lighter navy  (hover states)
// border-[#1e3356]               (borders)
// text-[#6b9fd4]                 (muted / label)
// text-[#a8c8f0]                 (secondary text)
// text-white                     (primary text)
// #3b7de9 / #4f8ef5              (accent blue – buttons, links)
// ─────────────────────────────────────────────────────────────────────────────

// ── tiny SVG icons (no extra deps) ───────────────────────────────────────────
const GithubIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path
      d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577
    0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7
    3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07
    1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93
    0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267
    1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24
    2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81
    2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297
    c0-6.627-5.373-12-12-12"
    />
  </svg>
);

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
    />
  </svg>
);

const BackArrow = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className="w-4 h-4"
  >
    <path
      d="M19 12H5M5 12l7-7M5 12l7 7"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const EyeIcon = ({ open }: { open: boolean }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className="w-4 h-4"
  >
    {open ? (
      <>
        <path
          d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
          strokeLinecap="round"
        />
        <circle cx="12" cy="12" r="3" />
      </>
    ) : (
      <>
        <path
          d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"
          strokeLinecap="round"
        />
        <path
          d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"
          strokeLinecap="round"
        />
        <line x1="1" y1="1" x2="23" y2="23" strokeLinecap="round" />
      </>
    )}
  </svg>
);

// ── Anime-themed left panel SVG illustration ──────────────────────────────────
const AnimeIllustration = () => (
  <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden select-none">
    {/* layered gradient circles */}
    <div className="absolute inset-0">
      <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] rounded-full bg-[#1a3a7a]/30 blur-3xl" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-[#0e2657]/40 blur-2xl" />
      <div className="absolute top-[30%] right-[10%] w-[40%] h-[40%] rounded-full bg-[#2251a3]/20 blur-2xl" />
    </div>

    {/* decorative grid lines */}
    <svg
      className="absolute inset-0 w-full h-full opacity-[0.06]"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
          <path
            d="M 48 0 L 0 0 0 48"
            fill="none"
            stroke="#a8c8f0"
            strokeWidth="0.5"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)" />
    </svg>

    {/* anime-style star/sparkle accents */}
    {[
      { cx: "20%", cy: "15%", r: 2 },
      { cx: "78%", cy: "22%", r: 1.5 },
      { cx: "12%", cy: "65%", r: 1 },
      { cx: "85%", cy: "70%", r: 2.5 },
      { cx: "50%", cy: "88%", r: 1.5 },
      { cx: "65%", cy: "10%", r: 1 },
    ].map((s, i) => (
      <svg
        key={i}
        className="absolute"
        style={{ left: s.cx, top: s.cy, width: 24, height: 24 }}
        viewBox="0 0 24 24"
        fill="none"
      >
        <circle cx="12" cy="12" r={s.r * 3} fill="#4f8ef5" opacity="0.6" />
        <circle cx="12" cy="12" r={s.r} fill="white" opacity="0.9" />
      </svg>
    ))}

    {/* main play icon */}
    <div className="relative z-10 flex flex-col items-center gap-8">
      <div className="relative">
        <div className="w-28 h-28 rounded-3xl bg-gradient-to-br from-[#1e3a6e] to-[#0b2040] border border-[#2a4a8a]/60 flex items-center justify-center shadow-[0_0_60px_rgba(59,125,233,0.3)]">
          <svg viewBox="0 0 24 24" fill="none" className="w-14 h-14">
            <polygon points="6,3 20,12 6,21" fill="#4f8ef5" opacity="0.9" />
            <polygon
              points="6,3 20,12 6,21"
              stroke="#a8c8f0"
              strokeWidth="0.5"
              fill="none"
            />
          </svg>
        </div>
        {/* glow ring */}
        <div className="absolute inset-0 rounded-3xl border border-[#4f8ef5]/30 scale-110 animate-pulse" />
      </div>

      <div className="text-center space-y-3">
        <h1
          className="text-4xl font-black tracking-tight text-white"
          style={{ fontFamily: "'Sora', sans-serif", letterSpacing: "-0.02em" }}
        >
          Anime<span className="text-[#4f8ef5]">Tracker</span>
        </h1>
        <p className="text-[#6b9fd4] text-sm font-medium max-w-xs leading-relaxed px-4">
          Your personal watchlist. Track, discover, and never lose your place in
          the story.
        </p>
      </div>

      {/* feature pills */}
      <div className="flex flex-wrap gap-2 justify-center px-8">
        {["📋 Watchlist", "⭐ Ratings", "🔔 Reminders", "🎯 Progress"].map(
          (f) => (
            <span
              key={f}
              className="px-3 py-1 rounded-full text-xs font-medium bg-[#0f1e38] border border-[#1e3356] text-[#a8c8f0]"
            >
              {f}
            </span>
          ),
        )}
      </div>
    </div>
  </div>
);

// ── Main component ────────────────────────────────────────────────────────────
export default function Auth() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignIn = async () => {
    setLoading(true);
    const { error } = await authClient.signIn.email({ email, password });
    setLoading(false);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Logged in successfully! 🚀");
      navigate({ to: "/" });
    }
  };

  const handleSignUp = async () => {
    setLoading(true);
    const { error } = await authClient.signUp.email({ email, password, name });
    setLoading(false);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Account created! You can now sign in.");
      navigate({ to: "/" });
    }
  };

  const handleSubmit = () =>
    mode === "signin" ? handleSignIn() : handleSignUp();

  return (
    <>
      {/* Google Font */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800;900&display=swap');

        * { box-sizing: border-box; }

        .auth-input {
          background: #0f1e38 !important;
          border: 1px solid #1e3356 !important;
          color: white !important;
          font-family: 'Sora', sans-serif;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .auth-input::placeholder { color: #3a5a8a; }
        .auth-input:focus {
          border-color: #3b7de9 !important;
          box-shadow: 0 0 0 3px rgba(59,125,233,0.15) !important;
          outline: none !important;
        }

        .primary-btn {
          background: linear-gradient(135deg, #3b7de9 0%, #2563cc 100%);
          border: none;
          color: white;
          font-family: 'Sora', sans-serif;
          font-weight: 600;
          letter-spacing: 0.01em;
          transition: opacity 0.2s, transform 0.15s, box-shadow 0.2s;
          box-shadow: 0 4px 20px rgba(59,125,233,0.35);
        }
        .primary-btn:hover:not(:disabled) {
          opacity: 0.93;
          transform: translateY(-1px);
          box-shadow: 0 6px 24px rgba(59,125,233,0.45);
        }
        .primary-btn:active:not(:disabled) { transform: translateY(0); }

        .social-btn {
          background: #0f1e38 !important;
          border: 1px solid #1e3356 !important;
          color: #a8c8f0 !important;
          font-family: 'Sora', sans-serif;
          font-weight: 500;
          transition: background 0.2s, border-color 0.2s, transform 0.15s;
        }
        .social-btn:hover {
          background: #162848 !important;
          border-color: #2a4a7a !important;
          transform: translateY(-1px);
        }

        .divider-line::before,
        .divider-line::after {
          content: '';
          flex: 1;
          height: 1px;
          background: #1e3356;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fadeUp 0.45s ease both; }
        .fade-up-1 { animation-delay: 0.05s; }
        .fade-up-2 { animation-delay: 0.10s; }
        .fade-up-3 { animation-delay: 0.15s; }
        .fade-up-4 { animation-delay: 0.20s; }
        .fade-up-5 { animation-delay: 0.25s; }
      `}</style>

      <div
        className="min-h-screen flex"
        style={{ background: "#050c1a", fontFamily: "'Sora', sans-serif" }}
      >
        {/* ── LEFT PANEL (desktop only) ─────────────────────────────────── */}
        <div
          className="hidden lg:flex flex-1 relative overflow-hidden"
          style={{
            background:
              "linear-gradient(145deg, #07101f 0%, #0b1829 50%, #091525 100%)",
          }}
        >
          <AnimeIllustration />
        </div>

        {/* ── RIGHT PANEL (form) ────────────────────────────────────────── */}
        <div
          className="flex-1 lg:max-w-[520px] w-full flex flex-col"
          style={{ background: "#050c1a" }}
        >
          {/* top bar */}
          <div className="flex items-center justify-between px-8 pt-8 pb-2">
            <Link
              to="/"
              className="flex items-center gap-2 text-[#6b9fd4] hover:text-white transition-colors text-sm font-medium"
            >
              <BackArrow />
              Back to Home
            </Link>
          </div>

          {/* form area – vertically centred */}
          <div className="flex-1 flex items-center justify-center px-6 py-10">
            <div className="w-full max-w-[400px]">
              {/* card */}
              <div
                className="rounded-2xl p-8 space-y-6"
                style={{ background: "#0b1629", border: "1px solid #1e3356" }}
              >
                {/* heading – animates on mode change */}
                <div key={mode} className="space-y-1 fade-up fade-up-1">
                  <h2 className="text-2xl font-bold text-white">
                    {mode === "signin" ? "Sign In" : "Create Account"}
                  </h2>
                  <p className="text-sm text-[#6b9fd4]">
                    {mode === "signin"
                      ? "Sign in to your account using your preferred provider"
                      : "Join and start tracking your favourite anime"}
                  </p>
                </div>

                <div key={mode + "-fields"} className="space-y-4">
                  {/* Name field – signup only */}
                  {mode === "signup" && (
                    <div className="space-y-1.5 fade-up fade-up-1">
                      <Label className="text-[#a8c8f0] text-xs font-semibold uppercase tracking-widest">
                        Username
                      </Label>
                      <Input
                        placeholder="PirateKing"
                        className="auth-input h-11 rounded-lg"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                  )}

                  {/* Email */}
                  <div className="space-y-1.5 fade-up fade-up-2">
                    <Label className="text-[#a8c8f0] text-xs font-semibold uppercase tracking-widest">
                      Email
                    </Label>
                    <Input
                      type="email"
                      placeholder="john.doe@example.com"
                      className="auth-input h-11 rounded-lg"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  {/* Password */}
                  <div className="space-y-1.5 fade-up fade-up-3">
                    <Label className="text-[#a8c8f0] text-xs font-semibold uppercase tracking-widest">
                      Password
                    </Label>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="auth-input h-11 rounded-lg pr-10"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#3a5a8a] hover:text-[#6b9fd4] transition-colors"
                      >
                        <EyeIcon open={showPassword} />
                      </button>
                    </div>
                  </div>

                  {/* Forgot password – sign in only */}
                  {mode === "signin" && (
                    <div className="fade-up fade-up-3 text-right -mt-1">
                      <button className="text-sm text-[#4f8ef5] hover:text-[#7aadf7] transition-colors font-medium underline underline-offset-2">
                        Reset
                      </button>
                      <span className="text-sm text-[#6b9fd4] ml-[-4px]">
                        {" "}
                      </span>
                      <span className="text-sm text-[#6b9fd4]">
                        Forgot your password?
                      </span>
                    </div>
                  )}

                  {/* Primary CTA */}
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="primary-btn w-full h-11 rounded-lg text-sm font-semibold fade-up fade-up-4 disabled:opacity-60"
                  >
                    {loading
                      ? "Please wait…"
                      : mode === "signin"
                        ? "Continue with Email"
                        : "Create Account"}
                  </button>
                </div>

                {/* Divider */}
                <div className="divider-line flex items-center gap-3 fade-up fade-up-4">
                  <span className="text-xs text-[#3a5a8a] whitespace-nowrap">
                    Or continue with
                  </span>
                </div>

                {/* Social buttons */}
                <div className="space-y-3 fade-up fade-up-5">
                  <Button className="social-btn w-full h-11 rounded-lg flex items-center gap-3 justify-center">
                    <GithubIcon />
                    <span>Sign in with Github</span>
                  </Button>
                  <Button className="social-btn w-full h-11 rounded-lg flex items-center gap-3 justify-center">
                    <GoogleIcon />
                    <span>Sign in with Google</span>
                  </Button>
                </div>

                {/* Toggle mode */}
                <p className="text-center text-sm text-[#6b9fd4] fade-up fade-up-5">
                  {mode === "signin" ? (
                    <>
                      Don't have an account?{" "}
                      <button
                        onClick={() => setMode("signup")}
                        className="text-[#4f8ef5] hover:text-[#7aadf7] font-semibold transition-colors"
                      >
                        Sign up
                      </button>
                    </>
                  ) : (
                    <>
                      Already have an account?{" "}
                      <button
                        onClick={() => setMode("signin")}
                        className="text-[#4f8ef5] hover:text-[#7aadf7] font-semibold transition-colors"
                      >
                        Sign in
                      </button>
                    </>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* <Toaster position="bottom-right" theme="dark" /> */}
    </>
  );
}
