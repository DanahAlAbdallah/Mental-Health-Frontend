// src/components/dashboard/dashboardLinks.ts
import {
  LayoutDashboard,
  FileText,
  CalendarDays,
  CalendarClock,
  BookOpen,
  Users,
  UserRound,
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

export const exploreLinks: DashboardLink[] = [
  { to: "/articles", label: "Browse articles", icon: BookOpen },
  { to: "/therapists", label: "Find therapists", icon: Users },
];

export const generalLinks: DashboardLink[] = [
  { to: "/profile", label: "My profile", icon: UserRound },
];


