import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";

import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import Home from "./Pages/Home";
import BrowseEvents from "./Pages/BrowseEvents";
import CreateEvent from "./Pages/CreateEvent";
import Booking from "./Pages/Booking";
import Payment from "./Pages/Payment";
import MyEvents from "./Pages/MyEvents";

import AdminDashboard from "./Dashboards/AdminDashboard";
import UserDashboard from "./Dashboards/UserDashboard";

import Header from "./Components/Header";
import Footer from "./Components/Footer";

// Inner layout re-reads localStorage on every route change via useLocation
const AppLayout = () => {
  useLocation(); // triggers re-render on every navigation
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  return (
    <>
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
        <Route path="/payment" element={<Payment />} />
        <Route path="/myevents" element={<MyEvents />} />
      </Routes>

      {token && <Footer />}
    </>
  );
};

const App = () => (
  <BrowserRouter>
    <AppLayout />
  </BrowserRouter>
);

export default App;
