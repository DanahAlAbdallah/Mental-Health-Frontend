// src/components/dashboard/articles/ArticleComponents.tsx
import { Link } from "react-router-dom";
import type { LucideIcon } from "lucide-react";

export function Stat({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string | number;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-border bg-surface p-4 shadow-sm">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <Icon className="h-5 w-5" />
      </span>
      <div className="min-w-0">
        <p className="truncate text-xl font-bold leading-none text-heading">
          {value}
        </p>
        <p className="mt-1 text-xs text-muted">{label}</p>
      </div>
    </div>
  );
}

export function IconAction({
  to,
  onClick,
  label,
  danger = false,
  disabled = false,
  children,
}: {
  to?: string;
  onClick?: () => void;
  label: string;
  danger?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  const className = `flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-muted transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
    danger
      ? "hover:bg-red-50 hover:text-red-600"
      : "hover:bg-primary/10 hover:text-primary"
  }`;

  if (to) {
    return (
      <Link to={to} aria-label={label} title={label} className={className}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className={className}
    >
      {children}
    </button>
  );
}

export function ArticlesSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="h-10 w-48 rounded-xl bg-black/5" />
      <div className="grid grid-cols-3 gap-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-20 rounded-2xl bg-black/5" />
        ))}
      </div>
      <div className="space-y-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-28 rounded-2xl bg-black/5" />
        ))}
      </div>
    </div>
  );
}