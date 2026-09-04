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
    <main className="flex min-h-screen items-center justify-center bg-[#070809] px-6 text-white">

      <div className="w-full max-w-md">

        {/* Back */}
        <button
          onClick={onBack}
          className="mb-8 flex items-center gap-2 text-sm text-gray-500 hover:text-white"
        >
          <ArrowLeft size={16} />
          Back
        </button>

        {/* Card */}
        <div className="rounded-2xl border border-white/10 bg-[#101215] p-8 shadow-2xl">

          {/* Logo */}
          <div className="flex justify-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[#f5c842]/40 bg-black">
              <span className="text-2xl font-bold text-[#f5c842]">
                M
              </span>
            </div>
          </div>

          <h1 className="mt-6 text-center text-2xl font-bold">
            Sign in to Mindrop
          </h1>

          <p className="mt-2 text-center text-sm text-gray-500">
            Welcome back! Please sign in to continue.
          </p>

          {/* OAuth */}
          <div className="mt-7 space-y-3">

            <button className="flex w-full items-center justify-center gap-3 rounded-lg bg-white px-4 py-3 text-sm font-medium text-black transition hover:bg-gray-200">
              <span className="font-bold text-red-500">G</span>
              Continue with Google
            </button>

            <button className="flex w-full items-center justify-center gap-3 rounded-lg border border-white/10 bg-[#17191d] px-4 py-3 text-sm font-medium transition hover:bg-white/5">
              <span>◉</span>
              Continue with GitHub
            </button>

          </div>

          {/* Divider */}
          <div className="my-7 flex items-center gap-4">
            <div className="h-px flex-1 bg-white/10" />
            <span className="text-xs text-gray-600">
              or
            </span>
            <div className="h-px flex-1 bg-white/10" />
          </div>

          {/* Email */}
          <label className="text-xs text-gray-400">
            Email address
          </label>

          <div className="relative mt-2">
            <Mail
              size={17}
              className="absolute left-3 top-3.5 text-gray-600"
            />

            <input
              type="email"
              placeholder="you@example.com"
              className="w-full rounded-lg border border-white/10 bg-[#090a0c] py-3 pl-10 pr-4 text-sm outline-none transition placeholder:text-gray-700 focus:border-[#f5c842]/50"
            />
          </div>

          {/* Password */}
          <label className="mt-5 block text-xs text-gray-400">
            Password
          </label>

          <div className="relative mt-2">
            <Lock
              size={17}
              className="absolute left-3 top-3.5 text-gray-600"
            />

            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              className="w-full rounded-lg border border-white/10 bg-[#090a0c] py-3 pl-10 pr-11 text-sm outline-none transition placeholder:text-gray-700 focus:border-[#f5c842]/50"
            />

            <button
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-gray-600 hover:text-gray-300"
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

            <label className="flex items-center gap-2 text-gray-500">
              <input type="checkbox" />
              Remember me
            </label>

            <button className="text-[#f5c842]">
              Forgot password?
            </button>

          </div>

          {/* Submit */}
          <button className="mt-6 w-full rounded-lg bg-[#f5c842] py-3 font-semibold text-black transition hover:bg-[#ffd85c]">
            Sign in
          </button>

          <p className="mt-6 text-center text-xs text-gray-500">
            Don't have an account?{" "}
            <button
              onClick={onRegister}
              className="font-medium text-[#f5c842]"
            >
              Sign up
            </button>
          </p>

        </div>
      </div>
    </main>
  );
}