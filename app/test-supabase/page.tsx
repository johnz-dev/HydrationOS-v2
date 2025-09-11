"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase-client";

export default function TestSupabasePage() {
  const { user } = useUser();
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      runTests();
    }
  }, [user]);

  const runTests = async () => {
    const testResults: any[] = [];

    try {
      setLoading(true);
      setError(null);

      // Test 1: Basic connection
      console.log("Test 1: Testing basic Supabase connection...");
      try {
        const { data, error } = await supabase
          .from("subscription_plans")
          .select("count");
        testResults.push({
          test: "Basic Connection",
          status: error ? "❌" : "✅",
          result: error ? error.message : "Connected successfully",
          data: data,
        });
      } catch (err) {
        testResults.push({
          test: "Basic Connection",
          status: "❌",
          result: err instanceof Error ? err.message : "Unknown error",
        });
      }

      // Test 2: Fetch subscription plans
      console.log("Test 2: Fetching subscription plans...");
      try {
        const { data, error } = await supabase
          .from("subscription_plans")
          .select("*");

        testResults.push({
          test: "Subscription Plans",
          status: error ? "❌" : "✅",
          result: error ? error.message : `Found ${data?.length || 0} plans`,
          data: data,
        });
      } catch (err) {
        testResults.push({
          test: "Subscription Plans",
          status: "❌",
          result: err instanceof Error ? err.message : "Unknown error",
        });
      }

      // Test 3: Check if user profile exists
      if (user) {
        console.log("Test 3: Checking user profile...");
        try {
          const { data, error } = await supabase
            .from("user_profiles")
            .select("*")
            .eq("clerk_user_id", user.id);

          testResults.push({
            test: "User Profile Check",
            status: error ? "❌" : "✅",
            result: error
              ? error.message
              : `Found ${data?.length || 0} profiles`,
            data: data,
          });
        } catch (err) {
          testResults.push({
            test: "User Profile Check",
            status: "❌",
            result: err instanceof Error ? err.message : "Unknown error",
          });
        }

        // Test 4: Try to create user profile
        console.log("Test 4: Creating user profile...");
        try {
          const { data, error } = await supabase
            .from("user_profiles")
            .upsert(
              {
                clerk_user_id: user.id,
                email: user.primaryEmailAddress?.emailAddress || "",
                first_name: user.firstName || "",
                last_name: user.lastName || "",
                avatar_url: user.imageUrl || "",
                role: "member",
                status: "active",
              },
              {
                onConflict: "clerk_user_id",
                ignoreDuplicates: false,
              }
            )
            .select()
            .single();

          testResults.push({
            test: "Create User Profile",
            status: error ? "❌" : "✅",
            result: error
              ? error.message
              : "Profile created/updated successfully",
            data: data,
          });
        } catch (err) {
          testResults.push({
            test: "Create User Profile",
            status: "❌",
            result: err instanceof Error ? err.message : "Unknown error",
          });
        }
      }

      setResults(testResults);
    } catch (err) {
      console.error("Test failed:", err);
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
          onClick={runTests}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          disabled={loading}
        >
          {loading ? "Testing..." : "Run Tests"}
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
          <p className="mt-4">Running tests...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {results.map((result, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow border-l-4 border-l-blue-500"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold">{result.test}</h3>
                <span className="text-2xl">{result.status}</span>
              </div>
              <p className="text-gray-600 mb-2">{result.result}</p>
              {result.data && (
                <details className="mt-2">
                  <summary className="cursor-pointer text-blue-600 hover:text-blue-800">
                    View Data
                  </summary>
                  <pre className="mt-2 p-3 bg-gray-100 rounded text-sm overflow-auto">
                    {JSON.stringify(result.data, null, 2)}
                  </pre>
                </details>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Debug Info */}
      <div className="bg-gray-100 p-4 rounded-lg">
        <h3 className="font-semibold mb-2">Environment Info</h3>
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
