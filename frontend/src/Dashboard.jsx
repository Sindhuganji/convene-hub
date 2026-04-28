import './ui.css';

import {
  useEffect,
  useState,
} from 'react';

import { useNavigate } from 'react-router-dom';

const API_BASE = "http://localhost:5000/api";

const initialForm = { title: "", description: "", date: "" };

function EventModal({ open, onClose, formData, setFormData, onSubmit, saving, isEdit }) {
  if (!open) return null;

  const onChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <h2>{isEdit ? "Edit Event" : "Create Event"}</h2>
        <p className="subtitle">Fill details and save your event.</p>

        <form onSubmit={onSubmit} className="form-stack">
          <input
            type="text"
            name="title"
            placeholder="Event title"
            value={formData.title}
            onChange={onChange}
            required
          />
          <textarea
            name="description"
            placeholder="Event description"
            rows={4}
            value={formData.description}
            onChange={onChange}
          />
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={onChange}
            required
          />

          <div className="modal-actions">
            <button type="button" className="btn-outline" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? "Saving..." : isEdit ? "Update Event" : "Create Event"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [openModal, setOpenModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(initialForm);

  const token = localStorage.getItem("token");

  const authHeaders = (withJson = false) => ({
    ...(withJson ? { "Content-Type": "application/json" } : {}),
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  });

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/events`, {
        headers: authHeaders(false),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch events");
      setEvents(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setEditingId(null);
    setFormData(initialForm);
    setOpenModal(true);
  };

  const openEdit = (event) => {
    setEditingId(event._id);
    setFormData({
      title: event.title || "",
      description: event.description || "",
      date: event.date ? new Date(event.date).toISOString().slice(0, 10) : "",
    });
    setOpenModal(true);
  };

  const closeModal = () => {
    setOpenModal(false);
    setEditingId(null);
    setFormData(initialForm);
  };

  const saveEvent = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const isEdit = Boolean(editingId);
      const url = isEdit ? `${API_BASE}/events/${editingId}` : `${API_BASE}/events`;
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: authHeaders(true),
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to save event");

      closeModal();
      await fetchEvents();
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this event?")) return;
    try {
      const res = await fetch(`${API_BASE}/events/${id}`, {
        method: "DELETE",
        headers: authHeaders(false),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to delete event");
      setEvents((prev) => prev.filter((e) => e._id !== id));
    } catch (err) {
      setError(err.message || "Something went wrong");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <main className="page dashboard-page">
      <div className="bg-blob blob-1" />
      <div className="bg-blob blob-2" />
      <div className="bg-blob blob-3" />

      <div className="dashboard-container">
        <header className="topbar glass-card">
          <h1>Convene Hub</h1>
          <div className="topbar-actions">
            <button className="btn-primary" onClick={openCreate}>
              + Create Event
            </button>
            <button className="btn-outline" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </header>

        {error && <div className="error-box mt-16">{error}</div>}

        <section className="events-section">
          {loading ? (
            <div className="glass-card empty-card">
              <p>Loading events...</p>
            </div>
          ) : events.length === 0 ? (
            <div className="glass-card empty-card">
              <h2>No events found</h2>
              <p>Create your first event to get started.</p>
              <button className="btn-primary" onClick={openCreate}>
                Create Event
              </button>
            </div>
          ) : (
            <div className="events-grid">
              {events.map((event) => (
                <article key={event._id} className="glass-card event-card">
                  <h3>{event.title}</h3>
                  <p>{event.description || "No description provided."}</p>
                  <span>
                    {event.date ? new Date(event.date).toLocaleDateString() : "No date"}
                  </span>

                  <div className="event-actions">
                    <button className="btn-outline" onClick={() => openEdit(event)}>
                      Edit
                    </button>
                    <button className="btn-outline" onClick={() => handleDelete(event._id)}>
                      Delete
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>

      <EventModal
        open={openModal}
        onClose={closeModal}
        formData={formData}
        setFormData={setFormData}
        onSubmit={saveEvent}
        saving={saving}
        isEdit={Boolean(editingId)}
      />
    </main>
  );
}