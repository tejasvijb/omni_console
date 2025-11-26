"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMutation } from "@tanstack/react-query";
import { authQueryOptions } from "@/api-config/queryOptions/authQueries";
import { toast } from "sonner"
import { useRouter } from "next/navigation";


export default function SignInPage() {
  const router = useRouter();

  const { mutate: loginMutate, isPending } = useMutation({
    mutationFn: authQueryOptions.signInOptions.mutationFunction,
    onSuccess: () => {
      toast.success("Signed in successfully!");
      router.push("/");
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast.error(`Sign in failed: ${error.response?.data?.message || error.message}`);
    },
  })


  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const signInData = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    };
    loginMutate({ body: signInData });
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col justify-center gap-10 px-6 py-12 sm:px-10">
        <div className="grid gap-12 rounded-3xl border border-slate-200 bg-white p-8 shadow-2xl shadow-blue-500/5 backdrop-blur lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <p className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-slate-100 px-4 py-1 text-xs uppercase tracking-[0.35em] text-slate-600">
              Admin Console
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
              Sign in to access control panel
            </h1>
            <p className="text-base text-slate-600 sm:text-lg">
              Securely access your admin dashboard to manage roles, permissions, and monitor real-time system observability with full audit trails.
            </p>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-sm text-slate-700">
              <p className="text-xs uppercase tracking-[0.4em] text-slate-500">Admin Features</p>
              <ul className="mt-4 space-y-2">
                <li className="text-slate-700">🔐 Role-Based Access Control (RBAC) for granular permissions.</li>
                <li className="text-slate-700">📊 Real-time observability and system metrics dashboard.</li>
                <li className="text-slate-700">📋 Comprehensive audit logs for security and compliance.</li>
              </ul>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-inner">
            <div className="flex flex-col space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-slate-700">
                Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@team.com"
                required
                className="bg-slate-50 text-slate-900 placeholder:text-slate-400 border-slate-200"
              />
            </div>
            <div className="flex flex-col space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-slate-700">
                Password
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                required
                minLength={8}
                className="bg-slate-50 text-slate-900 placeholder:text-slate-400 border-slate-200"
              />
            </div>
            <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-slate-600">
              <label className="inline-flex items-center gap-2">
                <input
                  type="checkbox"
                  id="remember"
                  name="remember"
                  className="size-4 rounded border border-slate-300 bg-white text-blue-600 accent-blue-600"
                />
                Remember me
              </label>
              <Link
                href="#"
                className="font-medium text-blue-600 transition hover:text-blue-700"
              >
                Forgot password?
              </Link>
            </div>
            <Button disabled={isPending} className="w-full bg-linear-to-r from-blue-600 to-rose-600 text-base text-white shadow-lg shadow-blue-600/20 hover:from-blue-700 hover:to-rose-700">
              {isPending ? "Signing in..." : "Sign in"}
            </Button>
            <p className="text-center text-sm text-slate-600">
              Don&apos;t have an account?{" "}
              <Link href="/sign-up" className="font-semibold text-blue-600 transition hover:text-blue-700">
                Sign up here
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
