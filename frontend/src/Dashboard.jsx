import {
  useEffect,
  useMemo,
  useState,
} from 'react';

import { useNavigate } from 'react-router-dom';

const API_BASE = "http://localhost:5000/api";

const initialFormState = {
  title: "",
  description: "",
  date: "",
};

function EventModal({
  isOpen,
  onClose,
  onSubmit,
  formData,
  setFormData,
  saving,
  isEdit,
}) {
  if (!isOpen) return null;

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md">
      <div className="w-full max-w-md rounded-3xl border border-white/20 bg-white/10 p-8 shadow-[0_25px_80px_rgba(0,0,0,0.8)] backdrop-blur-2xl">

        <h3 className="text-2xl font-bold text-white mb-2">
          {isEdit ? "Edit Event" : "Create Event"}
        </h3>
        <p className="text-sm text-gray-300 mb-6">
          {isEdit ? "Update your event details." : "Fill details to create event."}
        </p>

        <form onSubmit={onSubmit} className="space-y-4">
          <input
            type="text"
            name="title"
            required
            value={formData.title}
            onChange={handleChange}
            placeholder="Event Title"
            className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-400"
          />

          <textarea
            name="description"
            rows={4}
            value={formData.description}
            onChange={handleChange}
            placeholder="Event Description"
            className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400"
          />

          <input
            type="date"
            name="date"
            required
            value={formData.date}
            onChange={handleChange}
            className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />

          <div className="flex justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-white/20 bg-white/10 hover:bg-white/20"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 hover:scale-105 transition"
            >
              {saving ? "Saving..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const token = useMemo(() => localStorage.getItem("token"), []);

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEventId, setEditingEventId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState(initialFormState);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/events`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error("Failed to fetch events");
      setEvents(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) return navigate("/login");
    fetchEvents();
  }, []);

  const handleSubmitEvent = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const endpoint = editingEventId
        ? `${API_BASE}/events/${editingEventId}`
        : `${API_BASE}/events`;

      const method = editingEventId ? "PUT" : "POST";

      await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      fetchEvents();
      setIsModalOpen(false);
      setFormData(initialFormState);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-900 to-indigo-900 text-white p-6">

      {/* Navbar */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Convene Hub</h1>

        <div className="flex gap-3">
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-gradient-to-r from-pink-500 to-purple-500 px-4 py-2 rounded-xl hover:scale-105 transition"
          >
            + Create Event
          </button>

          <button
            onClick={() => {
              localStorage.clear();
              navigate("/login");
            }}
            className="bg-red-500 px-4 py-2 rounded-xl hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Empty / Events */}
      {loading ? (
        <p>Loading...</p>
      ) : events.length === 0 ? (
        <div className="flex justify-center">
          <div className="bg-white/10 p-8 rounded-2xl text-center backdrop-blur-xl">
            <h2 className="text-xl font-semibold">No events found</h2>
            <button
              onClick={() => setIsModalOpen(true)}
              className="mt-4 bg-gradient-to-r from-pink-500 to-purple-500 px-4 py-2 rounded-xl"
            >
              Create Event
            </button>
          </div>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {events.map((event) => (
            <div
              key={event._id}
              className="bg-white/10 p-5 rounded-2xl backdrop-blur-xl hover:scale-105 transition"
            >
              <h3 className="text-lg font-bold">{event.title}</h3>
              <p className="text-gray-300">{event.description}</p>
              <p className="text-sm text-gray-400 mt-2">{event.date}</p>
            </div>
          ))}
        </div>
      )}

      <EventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmitEvent}
        formData={formData}
        setFormData={setFormData}
        saving={saving}
        isEdit={false}
      />
    </div>
  );
}