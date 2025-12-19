import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import Home from "./Pages/Home";
import BrowseEvents from "./Pages/BrowseEvents";
import CreateEvent from "./Pages/CreateEvent";
import Booking from "./Pages/Booking";

import AdminDashboard from "./Dashboards/AdminDashboard";
import UserDashboard from "./Dashboards/UserDashboard";

import Header from "./Components/Header";
import Footer from "./Components/Footer";

const App = () => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  return (
    <BrowserRouter>
      {token && <Header />}

      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route
          path="/admin"
          element={role === "admin" ? <AdminDashboard /> : <Navigate to="/login" />}
        />

        <Route
          path="/user"
          element={role === "user" ? <UserDashboard /> : <Navigate to="/login" />}
        />

        <Route path="/home" element={<Home />} />
        <Route path="/browse" element={<BrowseEvents />} />
        <Route path="/create" element={<CreateEvent />} />
        <Route path="/booking" element={<Booking />} />
      </Routes>

      {token && <Footer />}
    </BrowserRouter>
  );
};

export default App;
