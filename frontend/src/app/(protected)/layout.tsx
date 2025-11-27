"use client";


import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AuthProvider from "../providers/AuthProvider";
import { AppSidebar } from "@/components/app/app-sidebar";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {

  return <AuthProvider>

    <SidebarProvider>
      <AppSidebar />
      <main className="w-full">
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>


  </AuthProvider>;
}