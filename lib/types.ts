// Supabase Database Types for Hydration OS

export interface UserProfile {
  id: string;
  clerk_user_id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
  phone?: string;
  date_of_birth?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
  };
  emergency_contact?: {
    name?: string;
    phone?: string;
    relationship?: string;
  };
  preferences?: Record<string, unknown>;
  role: "admin" | "staff" | "member";
  status: "active" | "inactive" | "suspended";
  created_at: string;
  updated_at: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  description?: string;
  price_monthly?: number;
  price_yearly?: number;
  stripe_price_id?: string;
  features: string[];
  max_events_per_month?: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserSubscription {
  id: string;
  user_id: string;
  plan_id: string;
  stripe_subscription_id?: string;
  status: "active" | "canceled" | "past_due" | "trialing";
  current_period_start?: string;
  current_period_end?: string;
  cancel_at_period_end: boolean;
  created_at: string;
  updated_at: string;
  plan?: SubscriptionPlan;
}

export interface Event {
  id: string;
  title: string;
  description?: string;
  event_type: "general" | "member_only" | "vip_only" | "public";
  start_date: string;
  end_date?: string;
  location?: string;
  max_attendees?: number;
  price?: number;
  stripe_price_id?: string;
  cover_image_url?: string;
  status: "draft" | "published" | "canceled";
  created_by?: string;
  created_at: string;
  updated_at: string;
  rsvp_count?: number;
}

export interface EventRSVP {
  id: string;
  event_id: string;
  user_id: string;
  status: "attending" | "maybe" | "not_attending";
  payment_status: "pending" | "paid" | "refunded";
  stripe_payment_intent_id?: string;
  guest_count: number;
  special_requests?: string;
  created_at: string;
  updated_at: string;
  event?: Event;
  user?: UserProfile;
}

export interface ContentPost {
  id: string;
  title: string;
  content?: string;
  content_type: "post" | "event_announcement" | "offer" | "news";
  media_urls?: string[];
  visibility: "public" | "members" | "vip_only";
  is_featured: boolean;
  published_at?: string;
  expires_at?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
  engagement_count?: number;
  created_by_profile?: UserProfile;
}

export interface ContentEngagement {
  id: string;
  content_id: string;
  user_id: string;
  engagement_type: "like" | "view" | "share";
  created_at: string;
}

// Database schema type
export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: UserProfile;
        Insert: Omit<UserProfile, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<UserProfile, "id" | "created_at" | "updated_at">>;
      };
      subscription_plans: {
        Row: SubscriptionPlan;
        Insert: Omit<SubscriptionPlan, "id" | "created_at" | "updated_at">;
        Update: Partial<
          Omit<SubscriptionPlan, "id" | "created_at" | "updated_at">
        >;
      };
      user_subscriptions: {
        Row: UserSubscription;
        Insert: Omit<UserSubscription, "id" | "created_at" | "updated_at">;
        Update: Partial<
          Omit<UserSubscription, "id" | "created_at" | "updated_at">
        >;
      };
      events: {
        Row: Event;
        Insert: Omit<Event, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<Event, "id" | "created_at" | "updated_at">>;
      };
      event_rsvps: {
        Row: EventRSVP;
        Insert: Omit<EventRSVP, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<EventRSVP, "id" | "created_at" | "updated_at">>;
      };
      content_posts: {
        Row: ContentPost;
        Insert: Omit<ContentPost, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<ContentPost, "id" | "created_at" | "updated_at">>;
      };
      content_engagement: {
        Row: ContentEngagement;
        Insert: Omit<ContentEngagement, "id" | "created_at">;
        Update: Partial<Omit<ContentEngagement, "id" | "created_at">>;
      };
    };
  };
}
