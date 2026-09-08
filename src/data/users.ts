import type { User } from "../types";

export const mockUsers: (User & { password: string })[] = [
  {
    id: "1",
    name: "Sarah Khalil",
    email: "therapist@test.com",
    password: "1234",
    role: "therapist",
  },
  {
    id: "2",
    name: "Admin User",
    email: "admin@test.com",
    password: "1234",
    role: "admin",
  },
  {
    id: "3",
    name: "Client User",
    email: "client@test.com",
    password: "1234",
    role: "client",
  },
];
