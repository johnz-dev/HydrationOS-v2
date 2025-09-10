import { SignUp } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Navigation */}
      <nav className="flex h-16 items-center justify-between px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/logo-hd.svg"
            alt="Hydration OS"
            width={32}
            height={32}
            className="h-8 w-8"
          />
          <span className="text-xl font-bold text-white">Hydration OS</span>
        </Link>

        <Link
          href="/"
          className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
        >
          ← Back to Home
        </Link>
      </nav>

      {/* Sign Up Form */}
      <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-6">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white mb-2">Get Started</h1>
            <p className="text-slate-400">
              Create your account to access Hydration OS
            </p>
          </div>

          <SignUp
            appearance={{
              elements: {
                rootBox: "mx-auto",
                card: "bg-slate-800/50 backdrop-blur border border-slate-700",
                headerTitle: "text-white",
                headerSubtitle: "text-slate-400",
                socialButtonsBlockButton:
                  "bg-slate-700 border-slate-600 text-white hover:bg-slate-600",
                formButtonPrimary:
                  "bg-[#87EFFF] hover:bg-[#6DE5FF] text-slate-900",
                formFieldInput: "bg-slate-700 border-slate-600 text-white",
                formFieldLabel: "text-slate-300",
                dividerLine: "bg-slate-600",
                dividerText: "text-slate-400",
                footerActionLink: "text-[#87EFFF] hover:text-[#6DE5FF]",
              },
            }}
          />
        </div>
      </main>
    </div>
  );
}
