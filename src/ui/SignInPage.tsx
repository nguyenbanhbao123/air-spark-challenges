import {
  ArrowLeft,
  Eye,
  EyeOff,
  Lock,
  Mail,
} from "lucide-react";
import { useState } from "react";

type SignInPageProps = {
  onBack: () => void;
  onRegister: () => void;
};

export default function SignInPage({
  onBack,
  onRegister,
}: SignInPageProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-ground px-6 text-[var(--text)]">

      <div className="w-full max-w-md">

        {/* Back */}
        <button
          onClick={onBack}
          className="mb-8 flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--text)]"
        >
          <ArrowLeft size={16} />
          Back
        </button>

        {/* Card */}
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8 shadow-2xl">

          {/* Logo */}
          <div className="flex justify-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[var(--accent)]/40 bg-[var(--bg)]">
              <span className="text-2xl font-bold text-[var(--accent)]">
                S
              </span>
            </div>
          </div>

          <h1 className="mt-6 text-center text-2xl font-bold">
            Sign in to Snapper AI
          </h1>

          <p className="mt-2 text-center text-sm text-[var(--text-muted)]">
            Welcome back! Please sign in to continue.
          </p>

          {/* OAuth */}
          <div className="mt-7 space-y-3">

            <button className="flex w-full items-center justify-center gap-3 rounded-lg bg-white px-4 py-3 text-sm font-medium text-black transition hover:bg-gray-200">
              <span className="font-bold text-red-500">G</span>
              Continue with Google
            </button>

            <button className="flex w-full items-center justify-center gap-3 rounded-lg border border-[var(--border)] bg-[var(--surface-2)] px-4 py-3 text-sm font-medium transition hover:bg-[var(--border)]">
              <span>◉</span>
              Continue with GitHub
            </button>

          </div>

          {/* Divider */}
          <div className="my-7 flex items-center gap-4">
            <div className="h-px flex-1 bg-[var(--border)]" />
            <span className="text-xs text-[var(--text-muted)]">
              or
            </span>
            <div className="h-px flex-1 bg-[var(--border)]" />
          </div>

          {/* Email */}
          <label className="text-xs text-[var(--text-muted)]">
            Email address
          </label>

          <div className="relative mt-2">
            <Mail
              size={17}
              className="absolute left-3 top-3.5 text-[var(--text-muted)]"
            />

            <input
              type="email"
              placeholder="you@example.com"
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] py-3 pl-10 pr-4 text-sm outline-none transition placeholder:text-[var(--text-muted)] focus:border-[var(--accent)]/50"
            />
          </div>

          {/* Password */}
          <label className="mt-5 block text-xs text-[var(--text-muted)]">
            Password
          </label>

          <div className="relative mt-2">
            <Lock
              size={17}
              className="absolute left-3 top-3.5 text-[var(--text-muted)]"
            />

            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] py-3 pl-10 pr-11 text-sm outline-none transition placeholder:text-[var(--text-muted)] focus:border-[var(--accent)]/50"
            />

            <button
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-[var(--text-muted)] hover:text-[var(--text)]"
            >
              {showPassword ? (
                <EyeOff size={17} />
              ) : (
                <Eye size={17} />
              )}
            </button>
          </div>

          {/* Remember */}
          <div className="mt-4 flex items-center justify-between text-xs">

            <label className="flex items-center gap-2 text-[var(--text-muted)]">
              <input type="checkbox" />
              Remember me
            </label>

            <button className="text-[var(--accent)]">
              Forgot password?
            </button>

          </div>

          {/* Submit */}
          <button className="mt-6 w-full rounded-lg bg-[var(--accent)] py-3 font-semibold text-white transition hover:bg-[var(--accent-2)]">
            Sign in
          </button>

          <p className="mt-6 text-center text-xs text-[var(--text-muted)]">
            Don't have an account?{" "}
            <button
              onClick={onRegister}
              className="font-medium text-[var(--accent)]"
            >
              Sign up
            </button>
          </p>

        </div>
      </div>
    </main>
  );
}