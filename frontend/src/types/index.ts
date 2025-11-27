export type UserRole = "admin" | "analyst" | "viewer";

export interface ChartAccessConfig {
    role: UserRole;
    visible: boolean;
}

export interface ChartsPermissions {
    barChart1: UserRole[];
    barChart2: UserRole[];
    lineChart: UserRole[];
    pieChart: UserRole[];
}

export const CHARTS_PERMISSIONS: ChartsPermissions = {
    barChart1: ["admin", "analyst"],
    barChart2: ["admin"],
    lineChart: ["admin", "analyst", "viewer"],
    pieChart: ["admin", "analyst"],
};
