import { Link } from "react-router-dom";

const UserDashboard = () => {
  return (
    <div className="p-10 min-h-screen bg-beige-50 text-black">
      <h2 className="text-3xl font-extrabold mb-8 text-orange-200 tracking-wide">
        User Dashboard
      </h2>

      <div className="flex gap-6">
        <Link
          className="px-4 py-2 rounded-md bg-black text-orange-50 hover:bg-orange-200 hover:text-black transition-colors duration-200 font-medium"
          to="/home"
        >
          Home
        </Link>

        <Link
          className="px-4 py-2 rounded-md bg-black text-orange-50 hover:bg-orange-200 hover:text-black transition-colors duration-200 font-medium"
          to="/browse"
        >
          Browse Events
        </Link>

        {/* <Link
          className="px-4 py-2 rounded-md bg-black text-beige-200 hover:bg-orange-200 hover:text-black transition-colors duration-200 font-medium"
          to="/create"
        >
          Create Event
        </Link> */}
      </div>
    </div>
  );
};

export default UserDashboard;
