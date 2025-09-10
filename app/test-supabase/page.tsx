"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import {
  getCurrentUserProfile,
  upsertUserProfile,
  getSubscriptionPlans,
  getUpcomingEvents,
  getRecentContent,
} from "@/lib/supabase-client";
import { UserProfile, SubscriptionPlan, Event, ContentPost } from "@/lib/types";

export default function TestSupabasePage() {
  const { user } = useUser();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [content, setContent] = useState<ContentPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      testSupabaseConnection();
    }
  }, [user]);

  const testSupabaseConnection = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("Testing Supabase connection...");

      // Test 1: Get subscription plans (should work immediately)
      console.log("1. Fetching subscription plans...");
      const plansData = await getSubscriptionPlans();
      setPlans(plansData);
      console.log("✅ Subscription plans:", plansData);

      if (user) {
        // Test 2: Get or create user profile
        console.log("2. Fetching user profile...");
        let userProfile = await getCurrentUserProfile(user.id);

        if (!userProfile) {
          console.log("2b. Creating user profile...");
          // Create user profile if it doesn't exist
          const newProfile = {
            clerk_user_id: user.id,
            email: user.primaryEmailAddress?.emailAddress || "",
            first_name: user.firstName || "",
            last_name: user.lastName || "",
            avatar_url: user.imageUrl || "",
            role: "member" as const,
            status: "active" as const,
          };

          userProfile = await upsertUserProfile(newProfile);
        }

        setProfile(userProfile);
        console.log("✅ User profile:", userProfile);
      }

      // Test 3: Get events (might be empty but should not error)
      console.log("3. Fetching events...");
      const eventsData = await getUpcomingEvents();
      setEvents(eventsData);
      console.log("✅ Events:", eventsData);

      // Test 4: Get content (might be empty but should not error)
      console.log("4. Fetching content...");
      const contentData = await getRecentContent();
      setContent(contentData);
      console.log("✅ Content:", contentData);

      console.log("🎉 All Supabase tests passed!");
    } catch (err) {
      console.error("❌ Supabase test failed:", err);
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto p-8">
        <h1 className="mb-4 text-2xl font-bold">Supabase Connection Test</h1>
        <p>Please sign in to test the Supabase connection.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto space-y-8 p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Supabase Connection Test</h1>
        <button
          onClick={testSupabaseConnection}
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          disabled={loading}
        >
          {loading ? "Testing..." : "Retry Test"}
        </button>
      </div>

      {error && (
        <div className="rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700">
          <strong>Error:</strong> {error}
        </div>
      )}

      {loading ? (
        <div className="py-8 text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-blue-500"></div>
          <p className="mt-4">Testing Supabase connection...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* User Profile */}
          <div className="bg-background border-white/65 rounded-lg border p-6 shadow">
            <h2 className="mb-4 text-xl font-semibold">User Profile</h2>
            {profile ? (
              <div className="space-y-2">
                <p>
                  <strong>ID:</strong> {profile.id}
                </p>
                <p>
                  <strong>Name:</strong> {profile.first_name}{" "}
                  {profile.last_name}
                </p>
                <p>
                  <strong>Email:</strong> {profile.email}
                </p>
                <p>
                  <strong>Role:</strong> {profile.role}
                </p>
                <p>
                  <strong>Status:</strong> {profile.status}
                </p>
              </div>
            ) : (
              <p className="text-gray-500">No profile found</p>
            )}
          </div>

          {/* Subscription Plans */}
          <div className="bg-background border-white/65 rounded-lg border p-6 shadow">
            <h2 className="mb-4 text-xl font-semibold">
              Subscription Plans ({plans.length})
            </h2>
            <div className="space-y-2">
              {plans.map((plan) => (
                <div key={plan.id} className="rounded border p-3">
                  <p>
                    <strong>{plan.name}</strong>
                  </p>
                  <p className="text-sm text-gray-600">{plan.description}</p>
                  <p className="text-sm">
                    ${plan.price_monthly}/month | ${plan.price_yearly}/year
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Events */}
          <div className="bg-background border-white/65 rounded-lg border p-6 shadow">
            <h2 className="mb-4 text-xl font-semibold">
              Upcoming Events ({events.length})
            </h2>
            {events.length > 0 ? (
              <div className="space-y-2">
                {events.map((event) => (
                  <div key={event.id} className="rounded border p-3">
                    <p>
                      <strong>{event.title}</strong>
                    </p>
                    <p className="text-sm text-gray-600">{event.description}</p>
                    <p className="text-sm">
                      {new Date(event.start_date).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No upcoming events</p>
            )}
          </div>

          {/* Content */}
          <div className="bg-background border-white/65 rounded-lg border p-6 shadow">
            <h2 className="mb-4 text-xl font-semibold">
              Recent Content ({content.length})
            </h2>
            {content.length > 0 ? (
              <div className="space-y-2">
                {content.map((post) => (
                  <div key={post.id} className="rounded border p-3">
                    <p>
                      <strong>{post.title}</strong>
                    </p>
                    <p className="text-sm text-gray-600">{post.content}</p>
                    <p className="text-sm">Type: {post.content_type}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No content found</p>
            )}
          </div>
        </div>
      )}

      {/* Debug Info */}
      <div className="bg-background border-white/65 rounded-lg border p-6 shadow">
        <h3 className="mb-2 font-semibold">Debug Info</h3>
        <p>
          <strong>Clerk User ID:</strong> {user.id}
        </p>
        <p>
          <strong>Email:</strong> {user.primaryEmailAddress?.emailAddress}
        </p>
        <p>
          <strong>Supabase URL:</strong>{" "}
          {process.env.NEXT_PUBLIC_SUPABASE_URL ? "✅ Set" : "❌ Missing"}
        </p>
        <p>
          <strong>Supabase Key:</strong>{" "}
          {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "✅ Set" : "❌ Missing"}
        </p>
      </div>
    </div>
  );
}
