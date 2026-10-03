// ARTICLE
export interface Article {
  id: string;
  title: string;
  content: string;
  author: string;
  category: string;
  createdAt: string;
}

// USER
export type UserRole = "client" | "therapist" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

// AVAILABILITY SLOTS
export interface AvailabilitySlot {
  id: string;
  therapistId: string;
  date: string;
  startTime: string;
  endTime: string;
  isBooked: boolean;
}
