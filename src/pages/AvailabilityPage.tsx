import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import {
  createSlot,
  fetchTherapistSlots,
  deleteSlot,
} from "../api/availability";
import type { AvailabilitySlot } from "../types";

function AvailabilityPage() {
  const { user } = useAuth();
  const [slots, setSlots] = useState<AvailabilitySlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  useEffect(() => {
    if (!user) return;
    fetchTherapistSlots(user.id).then((data) => {
      setSlots(data);
      setLoading(false);
    });
  }, [user]);

async function handleAddSlot(e: React.FormEvent) {
  e.preventDefault();
  try {
    const newSlot = await createSlot({ date, startTime, endTime });
    setSlots([...slots, newSlot]);
    setDate("");
    setStartTime("");
    setEndTime("");
  } catch (err) {
    alert(err instanceof Error ? err.message : "Something went wrong");
  }
}

  async function handleDelete(id: string) {
    await deleteSlot(id);
    setSlots(slots.filter((slot) => slot.id !== id));
  }

  if (loading) {
    return <div className="p-8">Loading availability...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-2xl font-bold mb-6">My Availability</h1>

      <form onSubmit={handleAddSlot} className="flex gap-3 mb-8 flex-wrap">
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border rounded p-2"
          required
        />
        <input
          type="time"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          className="border rounded p-2"
          required
        />
        <input
          type="time"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          className="border rounded p-2"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add Slot
        </button>
      </form>

      <div className="space-y-2">
        {slots.map((slot) => (
          <div
            key={slot.id}
            className="flex justify-between items-center bg-white p-3 rounded shadow-sm"
          >
            <span>
              {slot.date} · {slot.startTime} - {slot.endTime}
              {slot.isBooked && (
                <span className="ml-2 text-xs text-red-500">(Booked)</span>
              )}
            </span>
            {!slot.isBooked && (
              <button
                onClick={() => handleDelete(slot.id)}
                className="text-red-500 text-sm hover:underline"
              >
                Delete
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default AvailabilityPage;
