"use client";
import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMutation } from "@tanstack/react-query";
import { authQueryOptions } from "@/api-config/queryOptions/authQueries";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import type { UserRole } from "@/api-config/types";

export default function SignUpPage() {
  const router = useRouter();
  const [role, setRole] = useState<UserRole | undefined>(undefined);

  const { mutate: signUpMutate, isPending } = useMutation({
    mutationFn: authQueryOptions.signUpOptions.mutationFunction,
    onSuccess: () => {
      toast.success("Signed up successfully! Please sign in.");
      router.push("/sign-in");
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast.error(`Sign up failed: ${error.response?.data?.message || error.message}`);
    },
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (!role) {
      toast.error("Please select a role");
      return;
    }

    const signUpData = {
      email: formData.get("email") as string,
      password: password,
      role: role,
    };

    signUpMutate({ body: signUpData });
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col justify-center gap-10 px-6 py-12 sm:px-10">
        <div className="grid gap-12 rounded-3xl border border-slate-200 bg-white p-8 shadow-2xl shadow-rose-500/5 backdrop-blur lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <p className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-slate-100 px-4 py-1 text-xs uppercase tracking-[0.35em] text-slate-600">
              Admin Console
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
              Create admin account
            </h1>
            <p className="text-base text-slate-600 sm:text-lg">
              Set up your admin account to manage system access, enforce security policies, and maintain real-time observability across your organization.
            </p>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
              <p className="text-xs uppercase tracking-[0.4em] text-slate-500">Admin Capabilities</p>
              <div className="mt-4 grid gap-3 text-sm text-slate-700">
                <p>• Enforce RBAC-driven UI rendering with permission-based access.</p>
                <p>• Real-time observability with live system metrics and alerts.</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-inner">
            <div className="flex flex-col space-y-2">
              <label htmlFor="signup-email" className="text-sm font-medium text-slate-700">
                Email address
              </label>
              <Input
                id="signup-email"
                name="email"
                type="email"
                placeholder="you@company.com"
                required
                className="bg-slate-50 text-slate-900 placeholder:text-slate-400 border-slate-200"
              />
            </div>
            <div className="flex flex-col space-y-2">
              <label htmlFor="signup-password" className="text-sm font-medium text-slate-700">
                Password
              </label>
              <Input
                id="signup-password"
                name="password"
                type="password"
                placeholder="Create a strong password"
                required
                minLength={8}
                className="bg-slate-50 text-slate-900 placeholder:text-slate-400 border-slate-200"
              />
            </div>
            <div className="flex flex-col space-y-2">
              <label htmlFor="confirm-password" className="text-sm font-medium text-slate-700">
                Confirm password
              </label>
              <Input
                id="confirm-password"
                name="confirmPassword"
                type="password"
                placeholder="Re-enter password"
                required
                minLength={8}
                className="bg-slate-50 text-slate-900 placeholder:text-slate-400 border-slate-200"
              />
            </div>
            <div className="flex flex-col space-y-2">
              <label htmlFor="role" className="text-sm font-medium text-slate-700">
                Role
              </label>
              <Select value={role || ""} onValueChange={(value) => setRole(value as UserRole)}>
                <SelectTrigger id="role" className="bg-slate-50 text-slate-900 border-slate-200">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="analyst">Analyst</SelectItem>
                  <SelectItem value="viewer">Viewer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <label className="flex items-start gap-3 text-sm text-slate-600">
              <input
                type="checkbox"
                id="terms"
                name="terms"
                required
                className="mt-1 size-4 rounded border border-slate-300 bg-white text-rose-600 accent-rose-600"
              />
              <span>
                I agree to the{" "}
                <Link href="#" className="font-medium text-rose-600 transition hover:text-rose-700">
                  Terms &amp; Conditions
                </Link>
                , including the privacy policy.
              </span>
            </label>
            <Button disabled={isPending} type="submit" className="w-full bg-linear-to-r from-blue-600 to-rose-600 text-base text-white shadow-lg shadow-rose-600/20 hover:from-blue-700 hover:to-rose-700">
              {isPending ? "Creating account..." : "Create account"}
            </Button>
            <p className="text-center text-sm text-slate-600">
              Already have an account?{" "}
              <Link href="/sign-in" className="font-semibold text-blue-600 transition hover:text-blue-700">
                Sign in here
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
