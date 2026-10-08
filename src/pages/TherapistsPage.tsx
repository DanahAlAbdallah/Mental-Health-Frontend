import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchTherapists, type Therapist } from "../api/users";

function TherapistsPage() {
  const [therapists, setTherapists] = useState<Therapist[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTherapists().then((data) => {
      setTherapists(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <div className="p-8">Loading therapists...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-2xl font-bold mb-6">Find a Therapist</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {therapists.map((therapist) => (
          <Link
            key={therapist.id}
            to={`/therapists/${therapist.id}`}
            className="bg-white rounded-lg shadow p-5 hover:shadow-md transition"
          >
            <p className="font-semibold">{therapist.name}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default TherapistsPage;
