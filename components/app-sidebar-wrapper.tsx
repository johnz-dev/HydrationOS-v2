"use client";

import { useUser } from "@clerk/nextjs";
import { AppSidebar } from "./app-sidebar";

export function AppSidebarWrapper(
  props: React.ComponentProps<typeof AppSidebar>
) {
  const { user } = useUser();

  // Use Clerk user data or fallback to company info
  const userData = user
    ? {
        name: user.fullName || `${user.firstName} ${user.lastName}` || "User",
        email: user.primaryEmailAddress?.emailAddress || "user@example.com",
        avatar: user.imageUrl || "/logo-hd.svg",
      }
    : {
        name: "Hydration Development",
        email: "info@hydrationdevelopment.com",
        avatar: "/logo-hd.svg",
      };

  return <AppSidebar {...props} userData={userData} />;
}
