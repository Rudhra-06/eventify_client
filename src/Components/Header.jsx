import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  // Get the user's role from localStorage
  const role = localStorage.getItem("role");

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <header className="bg-black text-beige-100 px-10 py-4 flex justify-between items-center shadow-md">
      <h1 className="font-extrabold text-2xl tracking-wide text-orange-200">
        Eventify
      </h1>

      <nav className="flex gap-8 items-center text-sm font-medium">
        <Link
          to="/home"
          className="text-orange-50 hover:text-orange-300 transition-colors duration-200"
        >
          Home
        </Link>

        <Link
          to="/browse"
          className="text-orange-50 hover:text-orange-300 transition-colors duration-200"
        >
          Events
        </Link>

        {/* Show Create Event only if role is admin */}
        {role === "admin" && (
          <Link
            to="/create"
            className="text-orange-50 hover:text-orange-300 transition-colors duration-200"
          >
            Create Event
          </Link>
        )}

        <button
          onClick={logout}
          className="px-4 py-1.5 rounded-md border border-orange-300 text-orange-300 hover:bg-orange-300 hover:text-black transition-all duration-200"
        >
          Logout
        </button>
      </nav>
    </header>
  );
};

export default Header;
