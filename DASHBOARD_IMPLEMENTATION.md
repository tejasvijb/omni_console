# Dashboard Charts Implementation

## Overview

Implemented a role-based dashboard with 4 different chart types (2 bar charts, 1 line chart, 1 pie chart) that are conditionally rendered based on user role.

## Files Created

### 1. Chart Components

-   **`chart-bar-1.tsx`** - Sales Bar Chart

    -   Displays monthly sales data
    -   Access: Admin & Analyst roles

-   **`chart-bar-2.tsx`** - Revenue vs Expenses Bar Chart

    -   Compares revenue and expenses with dual bars
    -   Access: Admin only

-   **`chart-line-default.tsx`** (already existed)

    -   Displays line chart with trending data
    -   Access: All roles (admin, analyst, viewer)

-   **`chart-pie-simple.tsx`** (already existed)
    -   Pie chart showing browser distribution
    -   Access: Admin & Analyst roles

### 2. Types & Configuration

-   **`types/index.ts`** - New types file with:
    -   `UserRole` type definition
    -   `ChartAccessConfig` interface
    -   `ChartsPermissions` interface
    -   `CHARTS_PERMISSIONS` configuration object

### 3. Custom Hook

-   **`hooks/useChartAccess.ts`** - New utility hook
    -   `hasAccess(chartKey)` method to check if user has access to specific charts
    -   Takes optional `role` parameter

### 4. Updated Dashboard Page

-   **`app/(protected)/page.tsx`** - Complete rewrite with:
    -   Integration with `useAuth` hook for current user data
    -   Integration with `useChartAccess` hook for permission checking
    -   Loading state with skeleton loaders
    -   Responsive grid layout (2 columns on medium+ screens)
    -   Conditional rendering of charts based on role
    -   Fallback message when user has no chart access

## Role-Based Access Control

| Chart                             | Admin | Analyst | Viewer |
| --------------------------------- | ----- | ------- | ------ |
| Bar Chart 1 (Sales)               | ✅    | ✅      | ❌     |
| Bar Chart 2 (Revenue vs Expenses) | ✅    | ❌      | ❌     |
| Line Chart                        | ✅    | ✅      | ✅     |
| Pie Chart                         | ✅    | ✅      | ❌     |

## Features

1. **Role-Based Rendering** - Charts only display if user's role has access
2. **Loading State** - Skeleton loaders while user data is being fetched
3. **User Greeting** - Displays current user's role in the dashboard header
4. **Responsive Design** - 2-column grid on medium+ screens, 1-column on mobile
5. **Dark Mode Support** - Full Tailwind CSS dark mode support
6. **Fallback Message** - Shows message when user has no chart access
7. **Type-Safe** - Full TypeScript support with proper type definitions

## How to Add New Charts

1. Create a new chart component (e.g., `chart-something.tsx`)
2. Add the chart key to `ChartsPermissions` in `types/index.ts`
3. Define which roles can access it in `CHARTS_PERMISSIONS` object
4. Add conditional rendering in `page.tsx` using `hasAccess()`

Example:

```tsx
{
    hasAccess("newChart") && (
        <div>
            <ChartComponent />
        </div>
    );
}
```

## Future Enhancements

-   Add backend API to manage chart permissions dynamically
-   Add permission management UI for admins
-   Implement chart filtering by date range
-   Add export functionality for charts
-   Implement real-time data updates
