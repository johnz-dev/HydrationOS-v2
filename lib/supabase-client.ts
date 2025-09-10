import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    "Missing Supabase environment variables. Please check your .env.local file."
  );
  console.error(
    "Required variables: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY"
  );
}

export const supabase = createClient(supabaseUrl || "", supabaseAnonKey || "");

// Helper function to get current user profile
export async function getCurrentUserProfile(clerkUserId: string) {
  try {
    const { data, error } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("clerk_user_id", clerkUserId)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        // No rows found - this is expected for new users
        console.log("No user profile found for:", clerkUserId);
        return null;
      }
      console.error("Error fetching user profile:", error);
      throw error;
    }

    return data;
  } catch (err) {
    console.error("Error in getCurrentUserProfile:", err);
    return null;
  }
}

// Helper function to create or update user profile
export async function upsertUserProfile(profile: {
  clerk_user_id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
  phone?: string;
  role?: "admin" | "staff" | "member";
  status?: "active" | "inactive" | "suspended";
}) {
  try {
    // First try to find existing profile
    const { data: existingProfile } = await supabase
      .from("user_profiles")
      .select("id")
      .eq("clerk_user_id", profile.clerk_user_id)
      .single();

    if (existingProfile) {
      // Update existing profile
      const { data, error } = await supabase
        .from("user_profiles")
        .update(profile)
        .eq("clerk_user_id", profile.clerk_user_id)
        .select()
        .single();

      if (error) {
        console.error("Error updating user profile:", error);
        throw error;
      }

      return data;
    } else {
      // Create new profile with explicit ID
      const profileWithId = {
        id: crypto.randomUUID(),
        ...profile,
      };

      const { data, error } = await supabase
        .from("user_profiles")
        .insert(profileWithId)
        .select()
        .single();

      if (error) {
        console.error("Error inserting user profile:", error);
        throw error;
      }

      return data;
    }
  } catch (err) {
    console.error("Error in upsertUserProfile:", err);
    return null;
  }
}

// Helper function to get subscription plans
export async function getSubscriptionPlans() {
  try {
    const { data, error } = await supabase
      .from("subscription_plans")
      .select("*")
      .eq("is_active", true)
      .order("price_monthly", { ascending: true });

    if (error) {
      console.error("Error fetching subscription plans:", error);
      throw error;
    }

    return data || [];
  } catch (err) {
    console.error("Error in getSubscriptionPlans:", err);
    return [];
  }
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
  try {
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .eq("status", "published")
      .gte("start_date", new Date().toISOString())
      .order("start_date", { ascending: true })
      .limit(limit);

    if (error) {
      // If table doesn't exist, return empty array instead of crashing
      if (error.code === "42P01") {
        return [];
      }
      console.error("Error fetching events:", error);
      throw error;
    }

    return data || [];
  } catch (err) {
    console.error("Error in getUpcomingEvents:", err);
    return [];
  }
}

// Helper function to get recent content
export async function getRecentContent(limit = 10) {
  try {
    const { data, error } = await supabase
      .from("content_posts")
      .select("*")
      .not("published_at", "is", null)
      .order("published_at", { ascending: false })
      .limit(limit);

    if (error) {
      // If table doesn't exist, return empty array instead of crashing
      if (error.code === "42P01") {
        return [];
      }
      console.error("Error fetching content:", error);
      throw error;
    }

    return data || [];
  } catch (err) {
    console.error("Error in getRecentContent:", err);
    return [];
  }
}
