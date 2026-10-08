export interface Therapist {
  id: string;
  name: string;
}

export async function fetchTherapists(): Promise<Therapist[]> {
  const res = await fetch("http://localhost:3001/api/users/therapists");
  if (!res.ok) throw new Error("Failed to fetch therapists");
  return res.json();
}
