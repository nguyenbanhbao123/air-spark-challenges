import type { ReactNode } from "react";
import {
  Camera,
  Menu,
  ArrowRight,
  Sparkles,
  ScanLine,
  MessageSquare,
  Clock3,
  ShieldCheck,
  X,
} from "lucide-react";
import logoPng from '../assets/logo.png';

type HomePageProps = {
  onSignIn: () => void;
  onRegister: () => void;
  onCapture: () => Promise<void>;
};

export default function HomePage({
  onSignIn,
  onRegister,
  onCapture,
}: HomePageProps) {
  return (
    <main className="min-h-screen bg-gradient-ground text-[var(--text)]">

      {/* ================= NAVBAR ================= */}
      <header className="flex h-20 items-center justify-between border-b border-[var(--border)] px-8">

        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-[var(--accent)]/40 bg-[var(--surface)]">
            <img
              src={logoPng}
              alt="Snapper AI Logo"
              className="h-full w-full object-contain p-1"
            />
          </div>

          <span className="text-xl font-semibold">
            Snapper AI
          </span>
        </div>

        {/* Navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          <button className="border-b-2 border-[var(--accent)] pb-2 text-sm text-[var(--accent)]">
            Home
          </button>

          <button className="text-sm text-[var(--text-muted)] transition hover:text-[var(--text)]">
            Features
          </button>

          <button className="text-sm text-[var(--text-muted)] transition hover:text-[var(--text)]">
            How it Works
          </button>

          <button className="text-sm text-[var(--text-muted)] transition hover:text-[var(--text)]">
            Pricing
          </button>

          <button className="text-sm text-[var(--text-muted)] transition hover:text-[var(--text)]">
            FAQ
          </button>

          <button className="text-sm text-[var(--text-muted)] transition hover:text-[var(--text)]">
            About
          </button>
        </nav>

        {/* Account */}
        <div className="flex items-center gap-4">

          <button
            onClick={onSignIn}
            className="hidden text-sm text-[var(--text-muted)] transition hover:text-[var(--text)] sm:block"
          >
            Sign in
          </button>

          <button
            onClick={onRegister}
            className="rounded-lg bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--accent-2)]"
          >
            Get Started
          </button>

          <button
            className="rounded-lg p-2 text-[var(--text-muted)] transition hover:bg-[var(--surface-2)] hover:text-[var(--text)] md:hidden"
            aria-label="Menu"
          >
            <Menu size={20} />
          </button>

        </div>
      </header>


      {/* ================= HERO ================= */}
      <section className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 px-8 py-24 lg:grid-cols-2">

        {/* LEFT */}
        <div>

          {/* Badge */}
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[var(--highlight)]/60 bg-[var(--highlight)]/30 px-4 py-2 text-sm text-[var(--accent-2)]">
            <Sparkles size={15} />
            AI that sees what you see.
          </div>

          {/* Heading */}
          <h1 className="text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
            Snap anything.
            <br />

            <span className="text-[var(--accent)]">
              Ask instantly.
            </span>
          </h1>

          {/* Description */}
          <p className="mt-7 max-w-xl text-lg leading-8 text-[var(--text-muted)]">
            Capture any part of your screen and get AI
            answers without leaving your workflow.
          </p>

          {/* Buttons */}
          <div className="mt-9 flex flex-wrap gap-4">

            <button
              onClick={onCapture}
              className="flex items-center gap-3 rounded-lg bg-[var(--accent)] px-6 py-4 font-semibold text-white transition hover:bg-[var(--accent-2)]"
            >
              <Camera size={20} />

              Get Started

              <ArrowRight size={18} />
            </button>

            <button className="rounded-lg border border-[var(--border)] px-6 py-4 font-medium text-[var(--text)] transition hover:bg-[var(--surface-2)]">
              Watch Demo
            </button>

          </div>

          {/* Social proof */}
          <div className="mt-10 flex items-center gap-4">

            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-[var(--bg)] bg-[var(--surface-2)] text-xs text-[var(--text-muted)]"
                >
                  {item}
                </div>
              ))}
            </div>

            <div>
              <div className="text-[var(--accent-2)]">
                ★★★★★
              </div>

              <p className="text-xs text-[var(--text-muted)]">
                Loved by developers
              </p>
            </div>

          </div>

        </div>


        {/* ================= PRODUCT PREVIEW ================= */}
        <div className="relative">

          {/* Glow */}
          <div className="absolute inset-0 rounded-3xl bg-[var(--highlight)]/20 blur-3xl" />

          <div className="relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-2xl">

            {/* Fake application window */}
            <div className="rounded-xl border border-[var(--border)] bg-[var(--bg)]">

              {/* Window bar */}
              <div className="flex items-center justify-between border-b border-[var(--border)] px-4 py-3">

                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-400/50" />
                  <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/50" />
                  <span className="h-2.5 w-2.5 rounded-full bg-green-400/50" />
                </div>

                <span className="text-[10px] text-[var(--text-muted)]">
                  Snapper AI
                </span>

              </div>


              {/* Code area */}
              <div className="p-8">

                <div className="mb-6 flex items-center justify-between">

                  <span className="font-mono text-xs text-[var(--text-muted)]">
                    example.ts
                  </span>

                  <ScanLine
                    size={18}
                    className="text-[var(--accent)]"
                  />

                </div>


                <div className="space-y-3 font-mono text-sm">

                  <p className="text-[var(--accent-2)]">
                    function fetchData() {"{"}
                  </p>

                  <p className="pl-5 text-[var(--text-muted)]">
                    const res = fetch("/api/data");
                  </p>

                  <p className="pl-5 text-[var(--text-muted)]">
                    const data = await res.json();
                  </p>

                  <p className="pl-5 text-[var(--text-muted)]">
                    return data;
                  </p>

                  <p className="text-[var(--accent-2)]">
                    {"}"}
                  </p>

                </div>


                {/* Selection */}
                <div className="mt-8 rounded-lg border-2 border-dashed border-[var(--highlight)] bg-[var(--highlight)]/20 p-5">

                  <div className="flex items-center gap-2">
                    <ScanLine
                      size={16}
                      className="text-[var(--accent)]"
                    />

                    <p className="text-sm text-[var(--text-muted)]">
                      Selected screen region
                    </p>
                  </div>

                </div>

              </div>

            </div>


            {/* ================= CHATBOT ================= */}
            <div className="absolute bottom-8 right-8 w-80 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-2xl shadow-black/10">

              {/* Chat header */}
              <div className="flex items-center justify-between border-b border-[var(--border)] px-4 py-3">

                <div className="flex items-center gap-2">

                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--accent)] text-sm font-bold text-white">
                    S
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-[var(--text)]">
                      Snapper AI
                    </p>

                    <p className="text-[10px] text-[var(--text-muted)]">
                      AI Vision Assistant
                    </p>
                  </div>

                </div>

                <X
                  size={15}
                  className="text-[var(--text-muted)]"
                />

              </div>


              {/* Chat */}
              <div className="space-y-3 p-4">

                {/* User */}
                <div className="ml-6 rounded-xl bg-[var(--surface-2)] p-3">

                  <p className="text-xs leading-5 text-[var(--text)]">
                    Why is my code throwing this error?
                  </p>

                </div>


                {/* AI */}
                <div className="flex gap-2">

                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--accent)] text-[10px] font-bold text-white">
                    S
                  </div>

                  <div className="rounded-xl bg-[var(--surface-2)] p-3">

                    <p className="text-xs leading-5 text-[var(--text)]">
                      The error occurs because the
                      variable is undefined. Check
                      that it exists before accessing it.
                    </p>

                  </div>

                </div>

              </div>


              {/* Input */}
              <div className="border-t border-[var(--border)] p-3">

                <div className="rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3 py-2">

                  <p className="text-[11px] text-[var(--text-muted)]">
                    Ask anything about your screen...
                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* ================= HOW IT WORKS ================= */}
      <section className="mx-auto max-w-7xl px-8 py-20">

        <div className="mb-12 text-center">

          <h2 className="text-3xl font-bold">
            How{" "}
            <span className="text-[var(--accent)]">
              Snapper AI
            </span>{" "}
            works
          </h2>

          <p className="mt-3 text-[var(--text-muted)]">
            Three simple steps to get AI answers about
            anything on your screen.
          </p>

        </div>


        <div className="grid gap-6 md:grid-cols-3">

          <Step
            number="01"
            icon={<ScanLine size={28} />}
            title="Capture"
            description="Press the hotkey and select any area on your screen."
          />

          <Step
            number="02"
            icon={<MessageSquare size={28} />}
            title="Ask"
            description="Ask any question about what you captured."
          />

          <Step
            number="03"
            icon={<Sparkles size={28} />}
            title="Get Answer"
            description="Snapper AI analyzes your screenshot and gives you an answer."
          />

        </div>

      </section>


      {/* ================= FEATURES ================= */}
      <section className="mx-auto max-w-7xl px-8 pb-24">

        <h2 className="mb-8 text-center text-2xl font-bold">
          Powerful features for developers
        </h2>


        <div className="grid gap-4 md:grid-cols-4">

          <Feature
            icon={<Camera />}
            title="Instant Capture"
            description="Global hotkey to capture anything on your screen."
          />

          <Feature
            icon={<Sparkles />}
            title="AI That Understands"
            description="Vision AI understands code, errors, UI, charts and more."
          />

          <Feature
            icon={<Clock3 />}
            title="Conversation History"
            description="Save your conversations and access them anytime."
          />

          <Feature
            icon={<ShieldCheck />}
            title="Private & Secure"
            description="Your data stays private and secure."
          />

        </div>

      </section>

    </main>
  );
}


/* ================= STEP COMPONENT ================= */

function Step({
  number,
  icon,
  title,
  description,
}: {
  number: string;
  icon: ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="relative rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-7 transition hover:border-[var(--accent)]/30">

      <div className="mb-6 flex items-center justify-between">

        <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-[var(--accent)]/20 bg-[var(--accent)]/10 text-[var(--accent)]">
          {icon}
        </div>

        <span className="text-4xl font-bold text-[var(--text-muted)]/30">
          {number}
        </span>

      </div>

      <h3 className="text-lg font-semibold text-[var(--text)]">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
        {description}
      </p>

    </div>
  );
}


/* ================= FEATURE COMPONENT ================= */

function Feature({
  icon,
  title,
  description,
}: {
  icon: ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 transition hover:border-[var(--accent)]/30">

      <div className="mb-4 text-[var(--accent)]">
        {icon}
      </div>

      <h3 className="font-semibold text-[var(--text)]">
        {title}
      </h3>

      <p className="mt-2 text-xs leading-5 text-[var(--text-muted)]">
        {description}
      </p>

    </div>
  );
}