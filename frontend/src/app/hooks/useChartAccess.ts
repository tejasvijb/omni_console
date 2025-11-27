"use client";

import { CHARTS_PERMISSIONS, UserRole } from "@/types";

export const useChartAccess = (role?: UserRole) => {
    const hasAccess = (chartKey: keyof typeof CHARTS_PERMISSIONS): boolean => {
        if (!role) return false;
        return CHARTS_PERMISSIONS[chartKey].includes(role);
    };

    return { hasAccess };
};
