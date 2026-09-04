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
};

export default function HomePage({
  onSignIn,
  onRegister,
}: HomePageProps) {
  return (
    <main className="min-h-screen bg-[#070809] text-white">

      {/* ================= NAVBAR ================= */}
      <header className="flex h-20 items-center justify-between border-b border-white/5 px-8">

        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-[#f5c842]/40 bg-black">
            <img
              src={logoPng}
              alt="Mindrop Logo"
              className="h-full w-full object-contain p-1"
            />
          </div>

          <span className="text-xl font-semibold">
            Mindrop
          </span>
        </div>

        {/* Navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          <button className="border-b-2 border-[#f5c842] pb-2 text-sm text-[#f5c842]">
            Home
          </button>

          <button className="text-sm text-gray-400 transition hover:text-white">
            Features
          </button>

          <button className="text-sm text-gray-400 transition hover:text-white">
            How it Works
          </button>

          <button className="text-sm text-gray-400 transition hover:text-white">
            Pricing
          </button>

          <button className="text-sm text-gray-400 transition hover:text-white">
            FAQ
          </button>

          <button className="text-sm text-gray-400 transition hover:text-white">
            About
          </button>
        </nav>

        {/* Account */}
        <div className="flex items-center gap-4">

          <button
            onClick={onSignIn}
            className="hidden text-sm text-gray-300 transition hover:text-white sm:block"
          >
            Sign in
          </button>

          <button
            onClick={onRegister}
            className="rounded-lg bg-[#f5c842] px-5 py-3 text-sm font-semibold text-black transition hover:bg-[#ffd85c]"
          >
            Get Started
          </button>

          <button
            className="rounded-lg p-2 text-gray-400 transition hover:bg-white/5 hover:text-white md:hidden"
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
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#f5c842]/20 bg-[#f5c842]/5 px-4 py-2 text-sm text-[#f5c842]">
            <Sparkles size={15} />
            AI that sees what you see.
          </div>

          {/* Heading */}
          <h1 className="text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
            Snap anything.
            <br />

            <span className="text-[#f5c842]">
              Ask instantly.
            </span>
          </h1>

          {/* Description */}
          <p className="mt-7 max-w-xl text-lg leading-8 text-gray-400">
            Capture any part of your screen and get AI
            answers without leaving your workflow.
          </p>

          {/* Buttons */}
          <div className="mt-9 flex flex-wrap gap-4">

            <button
              onClick={onRegister}
              className="flex items-center gap-3 rounded-lg bg-[#f5c842] px-6 py-4 font-semibold text-black transition hover:bg-[#ffd85c]"
            >
              <Camera size={20} />

              Get Started

              <ArrowRight size={18} />
            </button>

            <button className="rounded-lg border border-white/10 px-6 py-4 font-medium text-white transition hover:bg-white/5">
              Watch Demo
            </button>

          </div>

          {/* Social proof */}
          <div className="mt-10 flex items-center gap-4">

            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#070809] bg-gray-700 text-xs"
                >
                  {item}
                </div>
              ))}
            </div>

            <div>
              <div className="text-[#f5c842]">
                ★★★★★
              </div>

              <p className="text-xs text-gray-500">
                Loved by developers
              </p>
            </div>

          </div>

        </div>


        {/* ================= PRODUCT PREVIEW ================= */}
        <div className="relative">

          {/* Glow */}
          <div className="absolute inset-0 rounded-3xl bg-[#f5c842]/10 blur-3xl" />

          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#101215] p-5 shadow-2xl">

            {/* Fake application window */}
            <div className="rounded-xl border border-white/10 bg-[#08090b]">

              {/* Window bar */}
              <div className="flex items-center justify-between border-b border-white/5 px-4 py-3">

                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-400/50" />
                  <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/50" />
                  <span className="h-2.5 w-2.5 rounded-full bg-green-400/50" />
                </div>

                <span className="text-[10px] text-gray-600">
                  Mindrop
                </span>

              </div>


              {/* Code area */}
              <div className="p-8">

                <div className="mb-6 flex items-center justify-between">

                  <span className="font-mono text-xs text-gray-500">
                    example.ts
                  </span>

                  <ScanLine
                    size={18}
                    className="text-[#f5c842]"
                  />

                </div>


                <div className="space-y-3 font-mono text-sm">

                  <p className="text-purple-400">
                    function fetchData() {"{"}
                  </p>

                  <p className="pl-5 text-gray-400">
                    const res = fetch("/api/data");
                  </p>

                  <p className="pl-5 text-gray-400">
                    const data = await res.json();
                  </p>

                  <p className="pl-5 text-gray-400">
                    return data;
                  </p>

                  <p className="text-purple-400">
                    {"}"}
                  </p>

                </div>


                {/* Selection */}
                <div className="mt-8 rounded-lg border-2 border-dashed border-[#f5c842]/70 bg-[#f5c842]/5 p-5">

                  <div className="flex items-center gap-2">
                    <ScanLine
                      size={16}
                      className="text-[#f5c842]"
                    />

                    <p className="text-sm text-gray-400">
                      Selected screen region
                    </p>
                  </div>

                </div>

              </div>

            </div>


            {/* ================= CHATBOT ================= */}
            <div className="absolute bottom-8 right-8 w-80 overflow-hidden rounded-2xl border border-white/10 bg-[#111317] shadow-2xl shadow-black/60">

              {/* Chat header */}
              <div className="flex items-center justify-between border-b border-white/5 px-4 py-3">

                <div className="flex items-center gap-2">

                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#f5c842] text-sm font-bold text-black">
                    M
                  </div>

                  <div>
                    <p className="text-sm font-semibold">
                      Mindrop AI
                    </p>

                    <p className="text-[10px] text-gray-600">
                      AI Vision Assistant
                    </p>
                  </div>

                </div>

                <X
                  size={15}
                  className="text-gray-500"
                />

              </div>


              {/* Chat */}
              <div className="space-y-3 p-4">

                {/* User */}
                <div className="ml-6 rounded-xl bg-white/5 p-3">

                  <p className="text-xs leading-5 text-gray-300">
                    Why is my code throwing this error?
                  </p>

                </div>


                {/* AI */}
                <div className="flex gap-2">

                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#f5c842] text-[10px] font-bold text-black">
                    M
                  </div>

                  <div className="rounded-xl bg-[#191c21] p-3">

                    <p className="text-xs leading-5 text-gray-300">
                      The error occurs because the
                      variable is undefined. Check
                      that it exists before accessing it.
                    </p>

                  </div>

                </div>

              </div>


              {/* Input */}
              <div className="border-t border-white/5 p-3">

                <div className="rounded-xl border border-white/10 bg-[#08090b] px-3 py-2">

                  <p className="text-[11px] text-gray-600">
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
            <span className="text-[#f5c842]">
              Mindrop
            </span>{" "}
            works
          </h2>

          <p className="mt-3 text-gray-500">
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
            description="Mindrop AI analyzes your screenshot and gives you an answer."
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
    <div className="relative rounded-2xl border border-white/10 bg-[#101215] p-7 transition hover:border-[#f5c842]/30">

      <div className="mb-6 flex items-center justify-between">

        <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-[#f5c842]/20 bg-[#f5c842]/5 text-[#f5c842]">
          {icon}
        </div>

        <span className="text-4xl font-bold text-white/5">
          {number}
        </span>

      </div>

      <h3 className="text-lg font-semibold">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-gray-500">
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
    <div className="rounded-xl border border-white/10 bg-[#101215] p-6 transition hover:border-[#f5c842]/30">

      <div className="mb-4 text-[#f5c842]">
        {icon}
      </div>

      <h3 className="font-semibold">
        {title}
      </h3>

      <p className="mt-2 text-xs leading-5 text-gray-500">
        {description}
      </p>

    </div>
  );
}