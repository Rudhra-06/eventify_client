import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import browseBg from "../assets/browsebg.png";

const BrowseEvents = () => {
  const role = localStorage.getItem("role");
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);

  const fetchEvents = async () => {
    try {
      const res = await axios.get("https://eventify-server-nv2g.onrender.com/api/events");
      setEvents(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleBookEvent = (event) => {
    const existing = JSON.parse(localStorage.getItem("bookedEvents") || "[]");
    if (existing.find((e) => e.eventId === event._id)) return;

    navigate("/payment", {
      state: {
        eventId: event._id,
        eventName: event.title,
        eventDate: event.date || "TBA",
        eventLocation: event.location || "TBA",
        price: event.price || 499,
      },
    });
  };

  const deleteEvent = async (id) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;

    try {
      await axios.delete(`https://eventify-server-nv2g.onrender.com/api/events/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      fetchEvents();
    } catch (err) {
      console.log(err);
    }
  };

  const updateEvent = async (event) => {
    const newTitle = prompt("Enter new title", event.title);
    const newDescription = prompt("Enter new description", event.description);

    if (!newTitle || !newDescription) return;

    try {
      await axios.put(
        `https://eventify-server-nv2g.onrender.com/api/events/update/${event._id}`,
        { title: newTitle, description: newDescription },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      fetchEvents();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* BACKGROUND IMAGE */}
      <div
        className="fixed inset-0 -z-10 bg-cover bg-center"
        style={{ backgroundImage: `url(${browseBg})` }}
      />

      {/* SOFT OVERLAY */}
      <div className="fixed inset-0 -z-10 bg-beige-50/80 backdrop-blur-sm" />

      {/* CONTENT */}
      <div className="relative min-h-screen p-10 text-orange-50">
        {/* PAGE TITLE */}
        <h2
          className="text-4xl font-extrabold mb-12 text-center text-orange-200 tracking-wide
                     transition-all duration-700 hover:tracking-wider"
        >
          Browse Events
        </h2>


        {/* EVENTS GRID */}
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10
             justify-items-center max-w-7xl mx-auto"
        >

          {events.length === 0 ? (
            <p className="col-span-full text-center text-black/50">
              No events available
            </p>
          ) : (
            events.map((event) => (
              <div
                key={event._id}
                className="group bg-black/90 backdrop-blur-lg
           rounded-2xl shadow-lg p-8
           w-full max-w-sm min-h-[260px]
           flex flex-col
           transition-all duration-500
           hover:-translate-y-2 hover:shadow-2xl"
              >
                <h3
                  className="text-xl font-semibold mb-3 text-orange-50
                             group-hover:text-orange-200 transition"
                >
                  {event.title}
                </h3>

                <p className="text-orange-50/70 mb-6 line-clamp-3">
                  {event.description}
                </p>

                <div className="mt-auto flex flex-col gap-3">
                  {/* SHOW BOOK BUTTON ONLY FOR NON-ADMIN */}
                  {role !== "admin" && (
                    <button
                      onClick={() => handleBookEvent(event)}
                      className="bg-orange-200 text-black py-2 rounded-lg
                                 hover:bg-orange-300 hover:scale-105
                                 transition-all duration-300"
                    >
                      Book Event
                    </button>
                  )}

                  {/* ADMIN BUTTONS */}
                  {role === "admin" && (
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => updateEvent(event)}
                        className="w-full bg-yellow-400 text-black py-1 rounded
                                   hover:bg-yellow-300 transition"
                      >
                        Update
                      </button>

                      <button
                        onClick={() => deleteEvent(event._id)}
                        className="w-full bg-red-500 text-orange-50 py-1 rounded
                                   hover:bg-red-400 transition"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default BrowseEvents;
