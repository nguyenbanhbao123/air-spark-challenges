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
    <main className="flex min-h-screen items-center justify-center bg-[#070809] px-6 py-10 text-white">

      <div className="w-full max-w-md">

        <button
          onClick={onBack}
          className="mb-8 flex items-center gap-2 text-sm text-gray-500 hover:text-white"
        >
          <ArrowLeft size={16} />
          Back
        </button>

        <div className="rounded-2xl border border-white/10 bg-[#101215] p-8 shadow-2xl">

          <div className="flex justify-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[#f5c842]/40 bg-black">
              <span className="text-2xl font-bold text-[#f5c842]">
                M
              </span>
            </div>
          </div>

          <h1 className="mt-6 text-center text-2xl font-bold">
            Create your account
          </h1>

          <p className="mt-2 text-center text-sm text-gray-500">
            Join Mindrop and start asking AI about your screen.
          </p>

          {/* Name */}
          <label className="mt-7 block text-xs text-gray-400">
            Full name
          </label>

          <div className="relative mt-2">
            <User
              size={17}
              className="absolute left-3 top-3.5 text-gray-600"
            />

            <input
              type="text"
              placeholder="John Doe"
              className="w-full rounded-lg border border-white/10 bg-[#090a0c] py-3 pl-10 pr-4 text-sm outline-none placeholder:text-gray-700 focus:border-[#f5c842]/50"
            />
          </div>

          {/* Email */}
          <label className="mt-5 block text-xs text-gray-400">
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
              className="w-full rounded-lg border border-white/10 bg-[#090a0c] py-3 pl-10 pr-4 text-sm outline-none placeholder:text-gray-700 focus:border-[#f5c842]/50"
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
              placeholder="Create a password"
              className="w-full rounded-lg border border-white/10 bg-[#090a0c] py-3 pl-10 pr-11 text-sm outline-none placeholder:text-gray-700 focus:border-[#f5c842]/50"
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

          {/* Create */}
          <button className="mt-7 w-full rounded-lg bg-[#f5c842] py-3 font-semibold text-black transition hover:bg-[#ffd85c]">
            Create account
          </button>

          <p className="mt-6 text-center text-xs text-gray-500">
            Already have an account?{" "}
            <button
              onClick={onSignIn}
              className="font-medium text-[#f5c842]"
            >
              Sign in
            </button>
          </p>

        </div>
      </div>
    </main>
  );
}