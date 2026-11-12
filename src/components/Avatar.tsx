// src/components/common/Avatar.tsx
import React from 'react';

interface AvatarProps {
  name: string;
  size?: string;
}

export const Avatar: React.FC<AvatarProps> = ({ name, size = "h-10 w-10" }) => (
  <span
    className={`flex ${size} shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-button-text`}
  >
    {name.charAt(0).toUpperCase()}
  </span>
); 