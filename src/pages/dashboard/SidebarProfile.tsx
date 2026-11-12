// src/components/dashboard/SidebarProfile.tsx
import React from "react";

interface SidebarProfileProps {
  user: {
    name?: string;
    avatarUrl?: string;
  } | null;
}

export const SidebarProfile: React.FC<SidebarProfileProps> = ({ user }) => {
  return (
    <div className="mb-4 hidden items-center gap-3 border-b border-primary/15 pb-4 md:flex">
      {user?.avatarUrl ? (
        <img
          src={user.avatarUrl}
          alt=""
          className="h-11 w-11 rounded-full object-cover"
        />
      ) : (
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-base font-semibold text-button-text">
          {user?.name?.charAt(0).toUpperCase()}
        </div>
      )}
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-heading">
          {user?.name}
        </p>
        <p className="text-xs text-muted">Therapist dashboard</p>
      </div>
    </div>
  );
};
