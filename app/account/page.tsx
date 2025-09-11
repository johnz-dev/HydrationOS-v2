import { Suspense } from "react";
import { AppSidebarWrapper } from "@/components/app-sidebar-wrapper";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AccountContent } from "./account-content";

function AccountPageLoading() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-6">
      <div className="mx-auto w-full max-w-6xl">
        <div className="flex items-center gap-4 mb-6">
          <div className="h-16 w-16 rounded-full bg-muted animate-pulse" />
          <div className="space-y-2">
            <div className="h-8 w-64 bg-muted rounded animate-pulse" />
            <div className="h-4 w-96 bg-muted rounded animate-pulse" />
          </div>
        </div>
        <div className="h-96 bg-muted rounded animate-pulse" />
      </div>
    </div>
  );
}

export default function AccountPage() {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebarWrapper variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <Suspense fallback={<AccountPageLoading />}>
          <AccountContent />
        </Suspense>
      </SidebarInset>
    </SidebarProvider>
  );
}
