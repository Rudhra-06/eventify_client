import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import loginBg from "../assets/loginbg.png"; // make sure the path is correct

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const login = async () => {
    if (!email || !password) {
      alert("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        "https://eventify-server-nv2g.onrender.com/api/auth/login",
        { email, password }
      );

      const { token, role } = res.data;

      if (!token || !role) {
        throw new Error("Invalid response from server");
      }

      localStorage.setItem("token", token);
      localStorage.setItem("role", role);

      if (role === "admin") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/user", { replace: true });
      }
    } catch (err) {
      console.log("Login error:", err);
      alert(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">

      {/* BACKGROUND IMAGE */}
      <div
        className="absolute inset-0 bg-cover bg-center -z-10"
        style={{ backgroundImage: `url(${loginBg})` }}
      />

      {/* LIGHT BLACK OVERLAY */}
      <div className="absolute inset-0 bg-black/40 -z-10"></div>

      {/* LOGIN CARD */}
      <div className="bg-black/80 p-8 rounded-xl shadow-lg w-96 backdrop-blur-md relative left-10">
        <h2 className="text-3xl font-extrabold text-orange-200 text-center mb-6">
          Login
        </h2>

        <input
          className="w-full mb-4 p-2 rounded border border-orange-200 bg-beige-100 text-black placeholder-black/60 focus:outline-none focus:ring-2 focus:ring-orange-200"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="w-full mb-4 p-2 rounded border border-orange-200 bg-beige-100 text-black placeholder-black/60 focus:outline-none focus:ring-2 focus:ring-orange-200"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={login}
          disabled={loading}
          className={`w-full py-2 rounded text-black ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-orange-200 hover:bg-orange-300 transition-colors duration-200"
          }`}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="text-center mt-4 text-sm text-orange-50">
          New user?{" "}
          <Link to="/signup" className="text-orange-200 hover:text-orange-300">
            Signup
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
