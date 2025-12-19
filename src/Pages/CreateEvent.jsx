import { useState } from "react";
import axios from "axios";
import browseBg from "../assets/browsebg.png"; 

const CreateEvent = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "https://eventify-server-nv2g.onrender.com/api/events/create",
        { title, description },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage("Event created successfully!");
      setTitle("");
      setDescription("");
    } catch (err) {
      console.log(err);
      setMessage(err.response?.data?.message || "Error creating event");
    }
  };

  return (
    <div className="p-10 max-w-2xl mx-auto relative">
      {/* BACKGROUND IMAGE */}
      <div
        className="fixed inset-0 -z-10 bg-cover bg-center transition-all duration-1000 ease-in-out transform scale-105"
        style={{ backgroundImage: `url(${browseBg})` }}
      />
      
      {/* SOFT OVERLAY */}
      <div className="fixed inset-0 -z-10 bg-black/50 backdrop-blur-sm" />

      <h2 className="text-3xl font-extrabold mb-6 text-orange-200 drop-shadow-lg transition-colors duration-500">
        Create Event
      </h2>

      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        className="w-full mb-4 p-3 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all duration-300 text-orange-200 bg-black/30 placeholder-orange-300"
      />

      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
        className="w-full mb-4 p-3 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300 transition-all duration-300 text-orange-200 bg-black/30 placeholder-orange-200"
      />

      <button
        onClick={handleSubmit}
        className="bg-orange-300 text-black px-6 py-2 rounded-lg hover:bg-orange-400 transform hover:scale-105 transition-all duration-300 font-semibold shadow-lg"
      >
        Create
      </button>

      {message && (
        <p className="mt-4 text-orange-200 font-medium drop-shadow-md transition-opacity duration-500">
          {message}
        </p>
      )}
    </div>
  );
};

export default CreateEvent;
