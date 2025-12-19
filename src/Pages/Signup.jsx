import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import loginBg from "../assets/loginbg.png";

const Signup = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const signup = async () => {
    try {
      await axios.post("http://localhost:5000/api/auth/signup", form);
      alert("Signup successful! Please login.");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Signup failed");
      console.log(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-beige-50">
      {/* BACKGROUND IMAGE */}
            <div
              className="absolute inset-0 bg-cover bg-center -z-10"
              style={{ backgroundImage: `url(${loginBg})` }}
            />
      
            {/* LIGHT BLACK OVERLAY */}
            <div className="absolute inset-0 bg-black/40 -z-10"></div>
      <div className="bg-black/80 p-8 rounded-xl shadow-lg w-96 backdrop-blur-md">
        <h2 className="text-3xl font-extrabold text-orange-200 text-center mb-6">
          Signup
        </h2>

        <input
          name="name"
          placeholder="Name"
          className="w-full mb-3 p-2 rounded border border-orange-200 bg-beige-100 text-orange-200 placeholder-black/60 focus:outline-none focus:ring-2 focus:ring-orange-200"
          value={form.name}
          onChange={handleChange}
        />

        <input
          name="email"
          placeholder="Email"
          className="w-full mb-3 p-2 rounded border border-orange-200 bg-beige-100 text-orange-200 placeholder-black/60 focus:outline-none focus:ring-2 focus:ring-orange-200"
          value={form.email}
          onChange={handleChange}
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          className="w-full mb-3 p-2 rounded border border-orange-200 bg-beige-100 text-orange-200 placeholder-black/60 focus:outline-none focus:ring-2 focus:ring-orange-200"
          value={form.password}
          onChange={handleChange}
        />

        <select
          name="role"
          className="w-full mb-4 p-2 rounded border border-orange-200 bg-beige-100 text- focus:outline-none focus:ring-2 focus:ring-orange-200"
          value={form.role}
          onChange={handleChange}
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>

        <button
          onClick={signup}
          className="w-full bg-orange-200 text-black py-2 rounded hover:bg-orange-300 transition-colors duration-200"
        >
          Signup
        </button>

        <p className="text-center mt-4 text-sm text-orange-50">
          Already have an account?{" "}
          <Link to="/login" className="text-orange-200 hover:text-orange-300">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
