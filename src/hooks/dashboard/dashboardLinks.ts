// src/components/dashboard/dashboardLinks.ts
import {
  LayoutDashboard,
  FileText,
  CalendarDays,
  CalendarClock,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type DashboardLink = {
  to: string;
  label: string;
  icon: LucideIcon;
  end?: boolean;
};

export const dashboardLinks: DashboardLink[] = [
  { to: "/dashboard", label: "Overview", icon: LayoutDashboard, end: true },
  { to: "/dashboard/articles", label: "My articles", icon: FileText },
  { to: "/dashboard/sessions", label: "My sessions", icon: CalendarDays },
  {
    to: "/dashboard/availability",
    label: "My availability",
    icon: CalendarClock,
  },
];
