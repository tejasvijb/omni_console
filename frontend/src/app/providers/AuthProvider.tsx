"use client";

import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";
import { toast } from "sonner";
import { useAuth } from "../hooks/useAuth";


export default function AuthProvider({ children }: { children: ReactNode }) {

  const router = useRouter();
  const { isCurrentUserLoading, isCurrentUserAuthenticated } = useAuth();

  useEffect(() => {
    if (!isCurrentUserLoading && !isCurrentUserAuthenticated) {
      toast.error("You must be signed in to access this page.");
      router.push("/sign-in");
    }
  }, [isCurrentUserLoading, isCurrentUserAuthenticated, router]);

  if (isCurrentUserLoading) {
    return <div>Loading...</div>
  }

  if (!isCurrentUserAuthenticated) {
    return null;
  }

  return <>{children}</>;



}