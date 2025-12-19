import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import adminBg from "../assets/adminbg.png"; // make sure the path is correct

const AdminDashboard = () => {
  const navigate = useNavigate();

  const [view, setView] = useState("manage"); // manage | create
  const [events, setEvents] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const token = localStorage.getItem("token");

  const fetchEvents = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/events");
      setEvents(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (view === "manage") {
      fetchEvents();
    }
  }, [view]);

  const deleteEvent = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/events/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEvents(events.filter((e) => e._id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  const startEdit = (event) => {
    setEditingId(event._id);
    setEditTitle(event.title);
    setEditDescription(event.description);
  };

  const updateEvent = async (id) => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/events/update/${id}`,
        { title: editTitle, description: editDescription },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setEvents(events.map((e) => (e._id === id ? res.data : e)));
      setEditingId(null);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="relative min-h-screen p-10 text-orange-50 overflow-hidden">
      
      {/* BACKGROUND IMAGE */}
      <div
        className="absolute inset-0 bg-cover bg-center -z-10"
        style={{ backgroundImage: `url(${adminBg})` }}
      />
      
      {/* DARK OVERLAY */}
      <div className="absolute inset-0 bg-black/40 -z-10"></div>

      <h2 className="text-3xl font-extrabold mb-8 text-center text-orange-200 tracking-wide">
        Admin Dashboard
      </h2>

      {/* Top Buttons */}
      <div className="flex justify-center gap-4 mb-10">
        <button
          onClick={() => setView("manage")}
          className={`px-6 py-2 rounded font-medium transition-colors duration-200 ${
            view === "manage"
              ? "bg-black text-orange-50 hover:bg-orange-200 hover:text-black"
              : "bg-black text-orange-50 hover:bg-orange-200 hover:text-black"
          }`}
        >
          Manage Events
        </button>

        <button
          onClick={() => navigate("/create")}
          className="px-6 py-2 rounded bg-black text-orange-50 hover:bg-orange-200 hover:text-black transition-colors duration-200 font-medium"
        >
          Create Event
        </button>
      </div>

      {/* Manage Events */}
      {view === "manage" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.length === 0 ? (
            <p className="col-span-full text-center text-black/50">
              No events available
            </p>
          ) : (
            events.map((event) => (
              <div
                key={event._id}
                className="bg-black/90 p-5 rounded-xl shadow-lg flex flex-col gap-3
                           transition-transform duration-300 ease-in-out
                           hover:-translate-y-2 hover:shadow-[0_0_20px_rgba(255,215,0,0.5)]"
              >
                {editingId === event._id ? (
                  <>
                    <input
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="border border-orange-200 p-2 rounded bg-beige-50 text-black"
                    />
                    <textarea
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      className="border border-orange-200 p-2 rounded bg-beige-50 text-black"
                    />
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => updateEvent(event._id)}
                        className="bg-green-600 text-orange-50 px-3 py-1 rounded hover:bg-green-500 transition-colors duration-200"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="bg-gray-300 text-black px-3 py-1 rounded hover:bg-gray-400 transition-colors duration-200"
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <h3 className="text-xl font-semibold text-orange-50">
                      {event.title}
                    </h3>
                    <p className="text-black/70">{event.description}</p>
                    <div className="flex gap-2 mt-auto">
                      <button
                        className="bg-yellow-400 text-black px-3 py-1 rounded hover:bg-yellow-300 transition-colors duration-200"
                        onClick={() => startEdit(event)}
                      >
                        Edit
                      </button>
                      <button
                        className="bg-red-500 text-orange-50 px-3 py-1 rounded hover:bg-red-400 transition-colors duration-200"
                        onClick={() => deleteEvent(event._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
