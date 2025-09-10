"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import {
  getCurrentUserProfile,
  upsertUserProfile,
  getSubscriptionPlans,
  getUpcomingEvents,
  getRecentContent,
  testUserProfilesTable,
  checkUserProfilesTableSchema,
  testDirectInsert,
  testTableExistence,
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
        // Test 1.5: Check if user_profiles table exists
        console.log("1.5. Checking user_profiles table schema...");
        await checkUserProfilesTableSchema();

        // Test 1.6: Check user_profiles table access
        console.log("1.6. Testing user_profiles table access...");
        await testUserProfilesTable();

        // Test 1.7: Check if other tables exist
        console.log("1.7. Testing table existence...");
        await testTableExistence();

        // Test 1.8: Try a direct insert
        console.log("1.8. Testing direct insert...");
        await testDirectInsert();

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
        <h1 className="text-2xl font-bold mb-4">Supabase Connection Test</h1>
        <p>Please sign in to test the Supabase connection.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Supabase Connection Test</h1>
        <button
          onClick={testSupabaseConnection}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          disabled={loading}
        >
          {loading ? "Testing..." : "Retry Test"}
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <strong>Error:</strong> {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4">Testing Supabase connection...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* User Profile */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">User Profile</h2>
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
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">
              Subscription Plans ({plans.length})
            </h2>
            <div className="space-y-2">
              {plans.map((plan) => (
                <div key={plan.id} className="border p-3 rounded">
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
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">
              Upcoming Events ({events.length})
            </h2>
            {events.length > 0 ? (
              <div className="space-y-2">
                {events.map((event) => (
                  <div key={event.id} className="border p-3 rounded">
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
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">
              Recent Content ({content.length})
            </h2>
            {content.length > 0 ? (
              <div className="space-y-2">
                {content.map((post) => (
                  <div key={post.id} className="border p-3 rounded">
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
      <div className="bg-gray-100 p-4 rounded-lg">
        <h3 className="font-semibold mb-2">Debug Info</h3>
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
