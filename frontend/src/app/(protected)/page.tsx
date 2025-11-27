"use client"

import { useAuth } from "@/app/hooks/useAuth"
import { usePermissions } from "@/app/hooks/usePermissions"
import { ChartBar1 } from "@/components/app/chart-bar-1"
import { ChartBar2 } from "@/components/app/chart-bar-2"
import { ChartLineDefault } from "@/components/app/chart-line-default"
import { ChartPieSimple } from "@/components/app/chart-pie-simple"
import { Skeleton } from "@/components/ui/skeleton"

export default function Home() {
  const { currentUserData, isCurrentUserLoading } = useAuth()
  const { canView, isPermissionsLoading } = usePermissions(currentUserData?.data?.user?.role)

  if (isCurrentUserLoading || isPermissionsLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
        <div className="w-full max-w-7xl px-4 py-8">
          <div className="grid gap-6 md:grid-cols-2">
            <Skeleton className="h-96 rounded-lg" />
            <Skeleton className="h-96 rounded-lg" />
            <Skeleton className="h-96 rounded-lg" />
            <Skeleton className="h-96 rounded-lg" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full flex min-h-screen bg-zinc-50 dark:bg-black">
      <main className="w-full">
        <div className="px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-black dark:text-white">
              Dashboard
            </h1>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              Welcome, <span className="font-semibold capitalize">{currentUserData?.data?.user?.role}</span>
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
            {/* Bar Chart 1 */}
            {canView("barChart1") && (
              <div>
                <ChartBar1 />
              </div>
            )}

            {/* Bar Chart 2 */}
            {canView("barChart2") && (
              <div>
                <ChartBar2 />
              </div>
            )}

            {/* Line Chart */}
            {canView("lineChart") && (
              <div>
                <ChartLineDefault />
              </div>
            )}

            {/* Pie Chart */}
            {canView("pieChart") && (
              <div>
                <ChartPieSimple />
              </div>
            )}
          </div>

          {/* No charts available message */}
          {!canView("barChart1") &&
            !canView("barChart2") &&
            !canView("lineChart") &&
            !canView("pieChart") && (
              <div className="rounded-lg border border-zinc-200 bg-white p-8 text-center dark:border-zinc-800 dark:bg-zinc-900">
                <p className="text-zinc-600 dark:text-zinc-400">
                  You do not have access to any charts with your current role.
                </p>
              </div>
            )}
        </div>
      </main>
    </div>
  )
}
