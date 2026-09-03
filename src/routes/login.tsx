import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, Eye, EyeOff, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in — LexaRox Accounts" },
      { name: "description", content: "Sign in to the LexaRox AI-first accountancy operations platform." },
      { property: "og:title", content: "Sign in — LexaRox Accounts" },
      { property: "og:description", content: "Secure access to your LexaRox accountancy workspace." },
    ],
  }),
  component: Login,
});

const stats = [
  { value: "126", label: "AI actions today" },
  { value: "18", label: "Awaiting review" },
  { value: "1,284", label: "Active clients" },
] as const;

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<"email" | "password" | null>(null);

  return (
    <div className="relative flex min-h-[100dvh] items-center justify-center overflow-hidden bg-[#e8edf3] px-3 py-3 sm:px-5 sm:py-4">
      {/* Ambient background */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(60,173,241,0.18),transparent_42%),radial-gradient(circle_at_85%_80%,rgba(80,181,70,0.14),transparent_40%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 top-16 h-72 w-72 rounded-full bg-[#3cadf1]/10 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-20 bottom-10 h-80 w-80 rounded-full bg-[#50b546]/10 blur-3xl"
      />

      <div className="animate-in fade-in slide-in-from-bottom-4 relative z-10 w-[94vw] max-w-[1280px] duration-700">
        <div className="overflow-hidden rounded-[1.35rem] bg-background shadow-[0_24px_60px_-12px_rgba(15,23,42,0.18),0_0_0_1px_rgba(255,255,255,0.6)_inset] lg:grid lg:h-[86vh] lg:min-h-[560px] lg:max-h-[900px] lg:grid-cols-[1.08fr_1fr]">
          {/* Left — hero panel */}
          <div className="relative hidden h-full min-h-0 overflow-hidden lg:block">
            <img
              src="/login-hero.png"
              alt="Professional using LexaRox Accounts on mobile"
              className="absolute inset-0 h-full w-full scale-[1.02] object-cover object-[center_20%]"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-[#000]/90 via-[#2f8fd4]/0 to-[#1a1824]/92" />
            <div
              aria-hidden
              className="absolute inset-0 opacity-[0.07] [background-image:linear-gradient(rgba(255,255,255,0.65)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.65)_1px,transparent_1px)] [background-size:28px_28px]"
            />

            <div className="relative flex h-full min-h-0 flex-col justify-between p-10 xl:p-12">
              <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/25 bg-white/15 px-3.5 py-1.5 text-xs font-medium text-white backdrop-blur-md">
                <Sparkles className="h-3.5 w-3.5" />
                AI operations layer
              </span>

              <div>
                <p className="max-w-[340px] text-[1.65rem] font-bold leading-[1.15] tracking-tight text-white xl:text-[1.85rem]">
                  AI handles the work.
                  <br />
                  You handle the decisions.
                </p>
                <p className="mt-4 max-w-[360px] text-sm leading-relaxed text-white/82 xl:text-[0.95rem]">
                  Documents processed, exceptions detected, and onboarding guided — before your first coffee.
                </p>
              </div>

              <dl className="grid grid-cols-3 gap-3 xl:gap-4">
                {stats.map(({ value, label }) => (
                  <div
                    key={label}
                    className="rounded-xl border border-white/20 bg-white/10 px-3 py-3 backdrop-blur-md"
                  >
                    <dt className="text-xl font-bold tabular-nums text-white">{value}</dt>
                    <dd className="mt-0.5 text-[0.68rem] leading-tight text-white/75">{label}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          {/* Right — sign-in form */}
          <div className="flex h-full min-h-0 flex-col justify-center overflow-y-auto bg-gradient-to-b from-white to-[#fafbfd] px-8 py-8 sm:px-12 sm:py-10 xl:px-14">
            <div className="lg:hidden">
              <div className="relative mb-8 h-36 overflow-hidden rounded-2xl">
                <img
                  src="/login-hero.png"
                  alt=""
                  aria-hidden
                  className="absolute inset-0 h-full w-full object-cover object-[center_25%]"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#3cadf1]/85 to-[#1a1824]/70" />
                <p className="absolute bottom-4 left-4 max-w-[220px] text-sm font-semibold leading-snug text-white">
                  AI handles the work. You handle the decisions.
                </p>
              </div>
            </div>

            <img
              src="/logo_black.png"
              alt="LexaRox Accounts"
              className="h-[3.25rem] w-auto object-contain object-left"
            />

            <div className="mt-7">
              <h1 className="text-[1.35rem] font-bold tracking-tight text-foreground">Sign in to your workspace</h1>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                Welcome back. Your AI agents have been working overnight.
              </p>
            </div>

            <form
              className="mt-7"
              onSubmit={(e) => {
                e.preventDefault();
                window.location.href = "/dashboard";
              }}
            >
              <div
                className={cn(
                  "overflow-hidden rounded-xl border bg-white transition-shadow duration-200",
                  focusedField ? "border-[#3cadf1]/45 shadow-[0_0_0_3px_rgba(60,173,241,0.12)]" : "border-input shadow-sm",
                )}
              >
                <div
                  className={cn(
                    "px-4 py-3.5 transition-colors",
                    focusedField === "email" && "bg-[#3cadf1]/[0.04]",
                  )}
                >
                  <label htmlFor="email" className="block text-[0.7rem] font-medium uppercase tracking-wide text-muted-foreground">
                    Work email
                  </label>
                  <div className="mt-1 flex items-center gap-2">
                    <input
                      id="email"
                      type="email"
                      defaultValue="andrea@lexarox.com"
                      onFocus={() => setFocusedField("email")}
                      onBlur={() => setFocusedField((f) => (f === "email" ? null : f))}
                      className="min-w-0 flex-1 border-0 bg-transparent p-0 text-[0.95rem] outline-none ring-0 focus:outline-none focus:ring-0"
                    />
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" aria-hidden />
                  </div>
                </div>

                <div
                  className={cn(
                    "border-t px-4 py-3.5 transition-colors",
                    focusedField === "password" ? "border-[#3cadf1]/20 bg-[#3cadf1]/[0.04]" : "border-input",
                  )}
                >
                  <label htmlFor="password" className="block text-[0.7rem] font-medium uppercase tracking-wide text-muted-foreground">
                    Password
                  </label>
                  <div className="mt-1 flex items-center gap-2">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      defaultValue="demo-password"
                      onFocus={() => setFocusedField("password")}
                      onBlur={() => setFocusedField((f) => (f === "password" ? null : f))}
                      className="min-w-0 flex-1 border-0 bg-transparent p-0 text-[0.95rem] outline-none ring-0 focus:outline-none focus:ring-0"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="shrink-0 rounded-md p-0.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between gap-3">
                <label className="flex cursor-pointer items-center gap-2.5 text-sm text-muted-foreground">
                  <Checkbox
                    defaultChecked
                    className="border-[#3cadf1]/70 data-[state=checked]:border-[#3cadf1] data-[state=checked]:bg-[#3cadf1]"
                  />
                  Keep me signed in
                </label>
                <button
                  type="button"
                  className="text-sm font-semibold text-[#3cadf1] transition-colors hover:text-[#2f97d8]"
                >
                  Forgot password?
                </button>
              </div>

              <Button
                type="submit"
                className="mt-6 h-11 w-full rounded-xl bg-[#3cadf1] text-sm font-bold tracking-wide shadow-[0_10px_24px_-8px_rgba(60,173,241,0.65)] transition-all hover:bg-[#35a3e3] hover:shadow-[0_14px_28px_-8px_rgba(60,173,241,0.7)] active:scale-[0.99]"
              >
                Sign in
              </Button>
            </form>

            <div className="mt-6 rounded-xl border border-border/70 bg-muted/35 px-4 py-3">
              <p className="flex items-start gap-2.5 text-xs leading-relaxed text-muted-foreground">
                <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[#3cadf1]/10 text-[#3cadf1]">
                  <ShieldCheck className="h-3.5 w-3.5" />
                </span>
                Single sign-on and audit logging are configured by your administrator.
              </p>
            </div>

            <div className="mt-5 border-t border-border/60 pt-5">
              <p className="text-center text-sm text-muted-foreground">
                Prototype access —{" "}
                <Link
                  to="/dashboard"
                  className="font-semibold text-[#3cadf1] underline-offset-4 transition-colors hover:text-[#2f97d8] hover:underline"
                >
                  continue to the dashboard
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
