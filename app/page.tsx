import { SignedIn, SignedOut, SignInButton, SignUpButton } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Navigation */}
      <nav className="flex h-16 items-center justify-between px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <Image
            src="/logo-hd.svg"
            alt="Hydration OS"
            width={32}
            height={32}
            className="h-8 w-8"
          />
          <span className="text-xl font-bold text-white">Hydration OS</span>
        </div>

        <div className="flex items-center gap-4">
          <SignedOut>
            <SignInButton mode="modal">
              <button className="rounded-lg px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors">
                Sign In
              </button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button className="rounded-lg bg-[#87EFFF] px-4 py-2 text-sm font-medium text-slate-900 hover:bg-[#6DE5FF] transition-colors">
                Get Started
              </button>
            </SignUpButton>
          </SignedOut>

          <SignedIn>
            <Link
              href="/dashboard"
              className="rounded-lg bg-[#87EFFF] px-4 py-2 text-sm font-medium text-slate-900 hover:bg-[#6DE5FF] transition-colors"
            >
              Go to Dashboard
            </Link>
          </SignedIn>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
            Professional Club
            <span className="block text-[#87EFFF]">Management Platform</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            Streamline your club operations with our comprehensive management
            platform. Handle memberships, events, payments, and member
            engagement all in one place.
          </p>

          <div className="mt-10 flex items-center justify-center gap-x-6">
            <SignedOut>
              <SignUpButton mode="modal">
                <button className="rounded-md bg-[#87EFFF] px-6 py-3 text-base font-semibold text-slate-900 shadow-sm hover:bg-[#6DE5FF] transition-colors">
                  Start Free Trial
                </button>
              </SignUpButton>

              <SignInButton mode="modal">
                <button className="text-base font-semibold leading-6 text-white hover:text-[#87EFFF] transition-colors">
                  Sign In <span aria-hidden="true">→</span>
                </button>
              </SignInButton>
            </SignedOut>

            <SignedIn>
              <Link
                href="/dashboard"
                className="rounded-md bg-[#87EFFF] px-6 py-3 text-base font-semibold text-slate-900 shadow-sm hover:bg-[#6DE5FF] transition-colors"
              >
                Access Dashboard
              </Link>
            </SignedIn>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mx-auto mt-32 max-w-7xl">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-lg bg-slate-800/50 p-8 backdrop-blur border border-slate-700">
              <div className="text-[#87EFFF] text-2xl mb-4">👥</div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Member Management
              </h3>
              <p className="text-slate-400">
                Comprehensive member profiles, subscription tracking, and
                engagement analytics.
              </p>
            </div>

            <div className="rounded-lg bg-slate-800/50 p-8 backdrop-blur border border-slate-700">
              <div className="text-[#87EFFF] text-2xl mb-4">📱</div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Social Feed
              </h3>
              <p className="text-slate-400">
                Instagram-like member experience with curated content and
                exclusive offers.
              </p>
            </div>

            <div className="rounded-lg bg-slate-800/50 p-8 backdrop-blur border border-slate-700">
              <div className="text-[#87EFFF] text-2xl mb-4">🎫</div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Event Management
              </h3>
              <p className="text-slate-400">
                Create events, manage RSVPs, and integrate with ticketing
                platforms.
              </p>
            </div>

            <div className="rounded-lg bg-slate-800/50 p-8 backdrop-blur border border-slate-700">
              <div className="text-[#87EFFF] text-2xl mb-4">💳</div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Payment Processing
              </h3>
              <p className="text-slate-400">
                Handle subscriptions, event tickets, and merchandise sales
                seamlessly.
              </p>
            </div>

            <div className="rounded-lg bg-slate-800/50 p-8 backdrop-blur border border-slate-700">
              <div className="text-[#87EFFF] text-2xl mb-4">📊</div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Analytics Dashboard
              </h3>
              <p className="text-slate-400">
                Track member engagement, revenue metrics, and operational
                insights.
              </p>
            </div>

            <div className="rounded-lg bg-slate-800/50 p-8 backdrop-blur border border-slate-700">
              <div className="text-[#87EFFF] text-2xl mb-4">🔗</div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Integrations
              </h3>
              <p className="text-slate-400">
                Connect with your existing tools and third-party services
                effortlessly.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
