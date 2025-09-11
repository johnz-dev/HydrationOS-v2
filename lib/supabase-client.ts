import { createClient } from "@supabase/supabase-js";
import { Database } from "./types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Helper function to get current user profile
export async function getCurrentUserProfile(clerkUserId: string) {
  const { data, error } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("clerk_user_id", clerkUserId)
    .single();

  if (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }

  return data;
}

// Helper function to create or update user profile
export async function upsertUserProfile(
  profile: Database["public"]["Tables"]["user_profiles"]["Insert"]
) {
  const { data, error } = await supabase
    .from("user_profiles")
    .upsert(profile, { onConflict: "clerk_user_id" })
    .select()
    .single();

  if (error) {
    console.error("Error upserting user profile:", error);
    return null;
  }

  return data;
}

// Helper function to get subscription plans
export async function getSubscriptionPlans() {
  const { data, error } = await supabase
    .from("subscription_plans")
    .select("*")
    .eq("is_active", true)
    .order("price_monthly", { ascending: true });

  if (error) {
    console.error("Error fetching subscription plans:", error);
    return [];
  }

  return data;
}

// Helper function to get user's current subscription
export async function getUserSubscription(userId: string) {
  const { data, error } = await supabase
    .from("user_subscriptions")
    .select(
      `
      *,
      plan:subscription_plans(*)
    `
    )
    .eq("user_id", userId)
    .eq("status", "active")
    .single();

  if (error) {
    console.error("Error fetching user subscription:", error);
    return null;
  }

  return data;
}

// Helper function to get upcoming events
export async function getUpcomingEvents(limit = 10) {
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("status", "published")
    .gte("start_date", new Date().toISOString())
    .order("start_date", { ascending: true })
    .limit(limit);

  if (error) {
    console.error("Error fetching events:", error);
    return [];
  }

  return data;
}

// Helper function to get recent content
export async function getRecentContent(limit = 10) {
  const { data, error } = await supabase
    .from("content_posts")
    .select(
      `
      *,
      created_by_profile:user_profiles!content_posts_created_by_fkey(
        first_name,
        last_name,
        avatar_url
      )
    `
    )
    .not("published_at", "is", null)
    .order("published_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching content:", error);
    return [];
  }

  return data;
}
