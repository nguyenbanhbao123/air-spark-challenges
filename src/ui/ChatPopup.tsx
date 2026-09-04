import {
  ArrowUp,
  Minus,
  X,
  Sparkles,
} from "lucide-react";

export default function ChatPopup() {
  return (
    <div className="absolute bottom-8 right-8 w-[320px] overflow-hidden rounded-2xl border border-white/10 bg-[#101215] shadow-2xl shadow-black/60">

      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/5 px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#f5c842] text-black">
            <Sparkles size={14} />
          </div>

          <span className="text-sm font-semibold text-white">
            Mindrop AI
          </span>
        </div>

        <div className="flex items-center gap-2 text-gray-500">
          <button className="transition hover:text-white">
            <Minus size={15} />
          </button>

          <button className="transition hover:text-white">
            <X size={15} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="space-y-4 p-4">

        {/* Screenshot preview */}
        <div className="overflow-hidden rounded-lg border border-white/5 bg-[#08090b]">
          <div className="p-3 font-mono text-[10px] leading-4">
            <p className="text-purple-400">
              function fetchData() {"{"}
            </p>

            <p className="pl-3 text-gray-500">
              const res = fetch("/api/data");
            </p>

            <p className="pl-3 text-gray-500">
              const data = await res.json();
            </p>

            <p className="pl-3 text-gray-500">
              return data;
            </p>

            <p className="text-purple-400">
              {"}"}
            </p>
          </div>
        </div>

        {/* User message */}
        <div className="rounded-xl bg-white/5 p-3">
          <p className="text-xs leading-5 text-gray-300">
            Why is my code throwing this TypeError?
          </p>

          <p className="mt-2 text-[10px] text-gray-600">
            10:24 AM
          </p>
        </div>

        {/* AI message */}
        <div className="flex gap-2">

          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#f5c842] text-black">
            <Sparkles size={14} />
          </div>

          <div className="rounded-xl bg-[#191c21] p-3">
            <p className="text-xs leading-5 text-gray-300">
              The TypeError occurs because{" "}
              <span className="text-[#f5c842]">
                user
              </span>{" "}
              is undefined. Check that it exists before
              accessing its properties.
            </p>

            <p className="mt-2 text-[10px] text-gray-600">
              10:24 AM
            </p>
          </div>

        </div>
      </div>

      {/* Input */}
      <div className="border-t border-white/5 p-3">
        <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-[#08090b] p-1">

          <input
            type="text"
            placeholder="Ask anything about your screen..."
            className="min-w-0 flex-1 bg-transparent px-3 py-2 text-xs text-white outline-none placeholder:text-gray-600"
          />

          <button className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#f5c842] text-black transition hover:bg-[#ffd85c]">
            <ArrowUp size={16} />
          </button>

        </div>
      </div>

    </div>
  );
}