import { createClient } from "@supabase/supabase-js";
import { Database } from "./types";

// Connection test function
export async function testSupabaseConnection() {
  try {
    const { error } = await supabase
      .from("subscription_plans")
      .select("count")
      .limit(1);

    if (error) {
      console.error("Supabase connection test failed:", error);
      return false;
    }

    console.log("✅ Supabase connection successful");
    return true;
  } catch (err) {
    console.error("❌ Supabase connection test error:", err);
    return false;
  }
}

// Test user_profiles table access
export async function testUserProfilesTable() {
  try {
    console.log("Testing user_profiles table access...");

    const { data, error } = await supabase
      .from("user_profiles")
      .select("id, clerk_user_id, email")
      .limit(1);

    if (error) {
      console.error("❌ user_profiles table test failed:", error);
      console.error("Full error object:", JSON.stringify(error, null, 2));
      console.error("Error code:", error.code);
      console.error("Error message:", error.message);
      return false;
    }

    console.log("✅ user_profiles table accessible");
    console.log("Sample data:", data);
    return true;
  } catch (err) {
    console.error("❌ user_profiles table test error:", err);
    return false;
  }
}

// Check if user_profiles table exists by checking table schema
export async function checkUserProfilesTableSchema() {
  try {
    console.log("Checking user_profiles table schema...");

    // Simple count query to check if table exists and is accessible
    const { count, error } = await supabase
      .from("user_profiles")
      .select("*", { count: "exact", head: true });

    if (error) {
      console.error("❌ user_profiles table not accessible:", error);
      return false;
    }

    console.log("✅ user_profiles table exists, row count:", count);

    // Try to get a sample record to see the structure
    const { data: sampleData, error: sampleError } = await supabase
      .from("user_profiles")
      .select("*")
      .limit(1);

    if (!sampleError && sampleData && sampleData.length > 0) {
      console.log(
        "✅ Sample user_profiles record structure:",
        Object.keys(sampleData[0])
      );
    } else {
      console.log("✅ user_profiles table is empty but accessible");
    }

    return true;
  } catch (err) {
    console.error("❌ Schema check error:", err);
    return false;
  }
}

// Test table existence for events and content_posts
export async function testTableExistence() {
  console.log("Testing table existence...");

  const tables = ["events", "content_posts"];
  const results = {};

  for (const tableName of tables) {
    try {
      const { count, error } = await supabase
        .from(tableName)
        .select("*", { count: "exact", head: true });

      if (error) {
        console.log(
          `❌ Table '${tableName}' error:`,
          error.code,
          error.message
        );
        results[tableName] = { exists: false, error: error.code };
      } else {
        console.log(`✅ Table '${tableName}' exists with ${count} rows`);
        results[tableName] = { exists: true, count };
      }
    } catch (err) {
      console.log(`❌ Table '${tableName}' exception:`, err.message);
      results[tableName] = { exists: false, error: "exception" };
    }
  }

  console.log("📊 Table existence summary:", results);
  return results;
}

// Simple direct insert test
export async function testDirectInsert() {
  try {
    console.log("Testing direct insert into user_profiles...");

    // Test with explicit ID first
    const testProfileWithId = {
      id: crypto.randomUUID(),
      clerk_user_id: `test_with_id_${Date.now()}`,
      email: `test${Date.now()}@example.com`,
      first_name: "Test",
      last_name: "User",
      role: "member",
      status: "active",
    };

    console.log("Attempting insert with explicit ID:", testProfileWithId);

    const { data: dataWithId, error: errorWithId } = await supabase
      .from("user_profiles")
      .insert(testProfileWithId)
      .select()
      .single();

    if (errorWithId) {
      console.error("❌ Insert with ID failed:", errorWithId);
      console.error("Full error object:", JSON.stringify(errorWithId, null, 2));
    } else {
      console.log("✅ Insert with explicit ID successful:", dataWithId);
      // Clean up
      await supabase.from("user_profiles").delete().eq("id", dataWithId.id);
      console.log("✅ Test record with ID cleaned up");
    }

    // Now test without explicit ID (should use default)
    const testProfile = {
      clerk_user_id: `test_auto_id_${Date.now()}`,
      email: `test${Date.now()}@example.com`,
      first_name: "Test",
      last_name: "User",
      role: "member",
      status: "active",
    };

    console.log("Attempting insert without ID (auto-generate):", testProfile);

    const { data, error } = await supabase
      .from("user_profiles")
      .insert(testProfile)
      .select()
      .single();

    if (error) {
      console.error("❌ Auto-ID insert failed:", error);
      console.error("Full error object:", JSON.stringify(error, null, 2));
      return false;
    }

    console.log("✅ Auto-ID insert successful:", data);

    // Clean up the test record
    await supabase.from("user_profiles").delete().eq("id", data.id);

    console.log("✅ Auto-ID test record cleaned up");
    return true;
  } catch (err) {
    console.error("❌ Direct insert test error:", err);
    return false;
  }
}

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

export const supabase = createClient<Database>(
  supabaseUrl || "",
  supabaseAnonKey || ""
);

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
  role?: string;
  status?: string;
}) {
  try {
    console.log("Attempting to upsert profile:", profile);

    // First try to find existing profile
    const { data: existingProfile } = await supabase
      .from("user_profiles")
      .select("id")
      .eq("clerk_user_id", profile.clerk_user_id)
      .single();

    if (existingProfile) {
      // Update existing profile
      console.log("Updating existing profile with ID:", existingProfile.id);
      const { data, error } = await supabase
        .from("user_profiles")
        .update(profile)
        .eq("clerk_user_id", profile.clerk_user_id)
        .select()
        .single();

      if (error) {
        console.error("Error updating user profile:", error);
        console.error("Full error object:", JSON.stringify(error, null, 2));
        throw error;
      }

      console.log("Successfully updated profile:", data);
      return data;
    } else {
      // Create new profile with explicit ID
      console.log("Creating new profile...");
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
        console.error("Full error object:", JSON.stringify(error, null, 2));
        throw error;
      }

      console.log("Successfully created profile:", data);
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
      console.error("Error fetching events:", error);
      console.error("Full error object:", JSON.stringify(error, null, 2));
      // If table doesn't exist, return empty array instead of crashing
      if (error.code === "42P01") {
        console.log(
          "ℹ️ Events table doesn't exist yet - returning empty array"
        );
        return [];
      }
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
    // First, try a simple query without joins
    const { data, error } = await supabase
      .from("content_posts")
      .select("*")
      .not("published_at", "is", null)
      .order("published_at", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("Error fetching content:", error);
      console.error("Full error object:", JSON.stringify(error, null, 2));
      // If table doesn't exist, return empty array instead of crashing
      if (error.code === "42P01") {
        console.log(
          "ℹ️ Content_posts table doesn't exist yet - returning empty array"
        );
        return [];
      }
      throw error;
    }

    console.log("✅ Successfully fetched content posts:", data?.length || 0);
    return data || [];
  } catch (err) {
    console.error("Error in getRecentContent:", err);
    return [];
  }
}
