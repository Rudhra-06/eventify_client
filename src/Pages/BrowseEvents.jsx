import { useEffect, useState } from "react";
import axios from "axios";

const BrowseEvents = () => {
  const role = localStorage.getItem("role");

  const [events, setEvents] = useState([]);
  const [bookedEvents, setBookedEvents] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [showPanel, setShowPanel] = useState(false);

  const fetchEvents = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/events");
      setEvents(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleBookEvent = (event) => {
    const alreadyBooked = bookedEvents.find((e) => e._id === event._id);
    if (alreadyBooked) return;

    setBookedEvents([...bookedEvents, event]);
    setShowPopup(true);
    setShowPanel(true);

    setTimeout(() => setShowPopup(false), 2000);
  };

  const deleteEvent = async (id) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/events/delete/${id}`, {
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
        `http://localhost:5000/api/events/update/${event._id}`,
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
    
    <div className="relative p-10 min-h-screen bg-beige-50 text-orange-50">
        
      <h2 className="text-3xl font-extrabold mb-8 text-center text-orange-200 tracking-wide">
        Browse Events
      </h2>

      {/* POPUP */}
      {showPopup && (
        <div className="fixed top-5 right-5 bg-green-600 text-orange-50 px-6 py-3 rounded shadow-lg z-50">
          Event booked successfully ✅
        </div>
      )}

      {/* RIGHT PANEL */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-beige-100 shadow-xl p-6 transition-transform duration-300 z-40
        ${showPanel ? "translate-x-0" : "translate-x-full"}`}
      >
        <h3 className="text-xl font-bold mb-4 text-orange-200">Booked Events</h3>

        {bookedEvents.length === 0 ? (
          <p className="text-black/60">No events booked yet</p>
        ) : (
          <ul className="space-y-2">
            {bookedEvents.map((e) => (
              <li
                key={e._id}
                className="border p-2 rounded bg-beige-50 text-black"
              >
                {e.title}
              </li>
            ))}
          </ul>
        )}

        <button
          onClick={() => setShowPanel(false)}
          className="mt-6 w-full bg-black text-orange-50 py-2 rounded hover:bg-orange-200 hover:text-black transition-colors duration-200"
        >
          Close
        </button>
      </div>

      {/* EVENTS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {events.length === 0 ? (
          <p className="col-span-full text-center text-black/50">
            No events available
          </p>
        ) : (
          events.map((event) => (
            <div
              key={event._id}
              className="bg-black rounded-xl shadow-lg hover:shadow-2xl transition p-5 flex flex-col justify-between"
            >
              <h3 className="text-xl font-semibold mb-2 text-orange-50">{event.title}</h3>
              <p className="text-black/70 mb-4 line-clamp-3">{event.description}</p>

              <div className="mt-auto flex flex-col gap-2">
                <button
                  onClick={() => handleBookEvent(event)}
                  className="bg-orange-200 text-black py-2 rounded hover:bg-orange-300 transition-colors duration-200"
                >
                  Book Event
                </button>

                {role === "admin" && (
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => updateEvent(event)}
                      className="w-full bg-yellow-400 text-black py-1 rounded hover:bg-yellow-300 transition-colors duration-200"
                    >
                      Update
                    </button>

                    <button
                      onClick={() => deleteEvent(event._id)}
                      className="w-full bg-red-500 text-orange-50 py-1 rounded hover:bg-red-400 transition-colors duration-200"
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
  );
};

export default BrowseEvents;
