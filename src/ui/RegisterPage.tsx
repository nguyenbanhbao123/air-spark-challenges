import {
  ArrowLeft,
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
} from "lucide-react";
import { useState } from "react";

type RegisterPageProps = {
  onBack: () => void;
  onSignIn: () => void;
};

export default function RegisterPage({
  onBack,
  onSignIn,
}: RegisterPageProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-ground px-6 py-10 text-[var(--text)]">

      <div className="w-full max-w-md">

        <button
          onClick={onBack}
          className="mb-8 flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--text)]"
        >
          <ArrowLeft size={16} />
          Back
        </button>

        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8 shadow-2xl">

          <div className="flex justify-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[var(--accent)]/40 bg-[var(--bg)]">
              <span className="text-2xl font-bold text-[var(--accent)]">
                S
              </span>
            </div>
          </div>

          <h1 className="mt-6 text-center text-2xl font-bold">
            Create your account
          </h1>

          <p className="mt-2 text-center text-sm text-[var(--text-muted)]">
            Join Snapper AI and start asking AI about your screen.
          </p>

          {/* Name */}
          <label className="mt-7 block text-xs text-[var(--text-muted)]">
            Full name
          </label>

          <div className="relative mt-2">
            <User
              size={17}
              className="absolute left-3 top-3.5 text-[var(--text-muted)]"
            />

            <input
              type="text"
              placeholder="John Doe"
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] py-3 pl-10 pr-4 text-sm outline-none placeholder:text-[var(--text-muted)] focus:border-[var(--accent)]/50"
            />
          </div>

          {/* Email */}
          <label className="mt-5 block text-xs text-[var(--text-muted)]">
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
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] py-3 pl-10 pr-4 text-sm outline-none placeholder:text-[var(--text-muted)] focus:border-[var(--accent)]/50"
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
              placeholder="Create a password"
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] py-3 pl-10 pr-11 text-sm outline-none placeholder:text-[var(--text-muted)] focus:border-[var(--accent)]/50"
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

          {/* Create */}
          <button className="mt-7 w-full rounded-lg bg-[var(--accent)] py-3 font-semibold text-white transition hover:bg-[var(--accent-2)]">
            Create account
          </button>

          <p className="mt-6 text-center text-xs text-[var(--text-muted)]">
            Already have an account?{" "}
            <button
              onClick={onSignIn}
              className="font-medium text-[var(--accent)]"
            >
              Sign in
            </button>
          </p>

        </div>
      </div>
    </main>
  );
}