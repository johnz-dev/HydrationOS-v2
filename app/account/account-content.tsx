"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  getCurrentUserProfile,
  upsertUserProfile,
  getSubscriptionPlans,
  getUserSubscription,
} from "@/lib/supabase-client";
import { UserProfile, SubscriptionPlan, UserSubscription } from "@/lib/types";
import {
  IconUser,
  IconCreditCard,
  IconSettings,
  IconBell,
} from "@tabler/icons-react";

export function AccountContent() {
  const { user } = useUser();
  const searchParams = useSearchParams();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [subscription, setSubscription] = useState<UserSubscription | null>(
    null
  );
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);

  // Form state for profile editing
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
  });

  const loadAccountData = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Load user profile
      let userProfile = await getCurrentUserProfile(user.id);

      if (!userProfile) {
        // Create profile if it doesn't exist
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

      if (userProfile) {
        setFormData({
          first_name: userProfile.first_name || "",
          last_name: userProfile.last_name || "",
          email: userProfile.email || "",
          phone: userProfile.phone || "",
        });

        // Load subscription data
        const userSub = await getUserSubscription(userProfile.id);
        setSubscription(userSub);
      }

      // Load available plans
      const availablePlans = await getSubscriptionPlans();
      setPlans(availablePlans);
    } catch (error) {
      console.error("Error loading account data:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      loadAccountData();
    }
  }, [user, loadAccountData]);

  const handleSaveProfile = async () => {
    if (!user || !profile) return;

    try {
      setSaving(true);

      const updatedProfile = {
        clerk_user_id: user.id,
        email: formData.email,
        first_name: formData.first_name,
        last_name: formData.last_name,
        phone: formData.phone,
        avatar_url: user.imageUrl || "",
        role: profile.role,
        status: profile.status,
      };

      const result = await upsertUserProfile(updatedProfile);
      if (result) {
        setProfile(result);
        setEditMode(false);
      }
    } catch (error) {
      console.error("Error saving profile:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Get the default tab from URL params
  const defaultTab = searchParams.get("tab") || "profile";

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p>Please sign in to access your account.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-6">
      <div className="mx-auto w-full max-w-6xl">
        <div className="flex items-center gap-4 mb-6">
          <Avatar className="h-16 w-16">
            <AvatarImage src={user.imageUrl} alt={user.firstName || ""} />
            <AvatarFallback>
              {user.firstName?.[0]}
              {user.lastName?.[0]}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold">Account Settings</h1>
            <p className="text-muted-foreground">
              Manage your profile, subscription, and preferences
            </p>
          </div>
        </div>

        <Tabs defaultValue={defaultTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <IconUser className="h-4 w-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger
              value="subscription"
              className="flex items-center gap-2"
            >
              <IconCreditCard className="h-4 w-4" />
              Subscription
            </TabsTrigger>
            <TabsTrigger
              value="notifications"
              className="flex items-center gap-2"
            >
              <IconBell className="h-4 w-4" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <IconSettings className="h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>
                      Update your personal details and contact information
                    </CardDescription>
                  </div>
                  <Button
                    variant={editMode ? "outline" : "default"}
                    onClick={() => setEditMode(!editMode)}
                  >
                    {editMode ? "Cancel" : "Edit Profile"}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {loading ? (
                  <div className="space-y-4">
                    <div className="h-4 bg-muted rounded animate-pulse" />
                    <div className="h-4 bg-muted rounded animate-pulse" />
                    <div className="h-4 bg-muted rounded animate-pulse" />
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="first_name">First Name</Label>
                      <Input
                        id="first_name"
                        value={formData.first_name}
                        onChange={(e) =>
                          handleInputChange("first_name", e.target.value)
                        }
                        disabled={!editMode}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="last_name">Last Name</Label>
                      <Input
                        id="last_name"
                        value={formData.last_name}
                        onChange={(e) =>
                          handleInputChange("last_name", e.target.value)
                        }
                        disabled={!editMode}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                        disabled={!editMode}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) =>
                          handleInputChange("phone", e.target.value)
                        }
                        disabled={!editMode}
                        placeholder="(555) 123-4567"
                      />
                    </div>
                  </div>
                )}

                {editMode && (
                  <>
                    <Separator />
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setEditMode(false)}
                      >
                        Cancel
                      </Button>
                      <Button onClick={handleSaveProfile} disabled={saving}>
                        {saving ? "Saving..." : "Save Changes"}
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Account Details */}
            <Card>
              <CardHeader>
                <CardTitle>Account Details</CardTitle>
                <CardDescription>
                  View your account status and role information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label className="text-sm font-medium">
                      Account Status
                    </Label>
                    <div className="mt-1">
                      <Badge
                        variant={
                          profile?.status === "active" ? "default" : "secondary"
                        }
                      >
                        {profile?.status || "Unknown"}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Role</Label>
                    <div className="mt-1">
                      <Badge variant="outline">
                        {profile?.role || "Member"}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Member Since</Label>
                    <div className="mt-1 text-sm text-muted-foreground">
                      {profile?.created_at
                        ? new Date(profile.created_at).toLocaleDateString()
                        : "N/A"}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Subscription Tab */}
          <TabsContent value="subscription" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Current Subscription</CardTitle>
                <CardDescription>
                  Manage your subscription plan and billing
                </CardDescription>
              </CardHeader>
              <CardContent>
                {subscription ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-semibold">
                          {subscription.plan?.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {subscription.plan?.description}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge>{subscription.status}</Badge>
                          <span className="text-sm text-muted-foreground">
                            ${subscription.plan?.price_monthly}/month
                          </span>
                        </div>
                      </div>
                      <Button variant="outline">Manage Billing</Button>
                    </div>

                    {subscription.current_period_end && (
                      <div className="text-sm text-muted-foreground">
                        Next billing date:{" "}
                        {new Date(
                          subscription.current_period_end
                        ).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <h3 className="font-semibold mb-2">
                      No Active Subscription
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Choose a plan to get started with premium features
                    </p>
                    <Button>Choose a Plan</Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Available Plans */}
            {plans.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Available Plans</CardTitle>
                  <CardDescription>
                    Upgrade or change your subscription plan
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {plans.map((plan) => (
                      <div
                        key={plan.id}
                        className="border rounded-lg p-4 space-y-3"
                      >
                        <div>
                          <h3 className="font-semibold">{plan.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {plan.description}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <div className="text-2xl font-bold">
                            ${plan.price_monthly}
                            <span className="text-sm font-normal text-muted-foreground">
                              /month
                            </span>
                          </div>
                          {plan.price_yearly && (
                            <div className="text-sm text-muted-foreground">
                              or ${plan.price_yearly}/year
                            </div>
                          )}
                        </div>
                        <Button
                          className="w-full"
                          variant={
                            subscription?.plan_id === plan.id
                              ? "outline"
                              : "default"
                          }
                          disabled={subscription?.plan_id === plan.id}
                        >
                          {subscription?.plan_id === plan.id
                            ? "Current Plan"
                            : "Select Plan"}
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>
                  Choose how you want to be notified about updates and events
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center py-8 text-muted-foreground">
                    Notification settings coming soon...
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>
                  Manage your account preferences and security settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center py-8 text-muted-foreground">
                    Additional settings coming soon...
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

