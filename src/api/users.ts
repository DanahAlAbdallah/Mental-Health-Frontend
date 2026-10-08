export interface Therapist {
  id: string;
  name: string;
}
const BASE_URL = `${import.meta.env.VITE_API_URL}/api/users/therapists`;

export async function fetchTherapists(): Promise<Therapist[]> {
  const res = await fetch(BASE_URL);
  if (!res.ok) throw new Error("Failed to fetch therapists");
  return res.json();
}
