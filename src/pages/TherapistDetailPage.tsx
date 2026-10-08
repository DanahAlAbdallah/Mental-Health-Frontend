import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchTherapistSlots } from "../api/availability";
import type { AvailabilitySlot } from "../types";

function TherapistDetailPage() {
  const { id } = useParams();
  const [slots, setSlots] = useState<AvailabilitySlot[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetchTherapistSlots(id).then((data) => {
      setSlots(data);
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return <div className="p-8">Loading available times...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <Link to="/therapists" className="text-blue-600 text-sm">
        ← Back to therapists
      </Link>
      <h1 className="text-2xl font-bold mt-4 mb-6">Available Times</h1>

      {slots.length === 0 ? (
        <p className="text-gray-500">No open times right now.</p>
      ) : (
        <div className="space-y-2">
          {slots.map((slot) => (
            <div key={slot.id} className="bg-white p-3 rounded shadow-sm">
              {slot.date} · {slot.startTime} - {slot.endTime}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TherapistDetailPage;
