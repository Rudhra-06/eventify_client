import { Link } from "react-router-dom";
import userbg from "../assets/userbg.mp4";

const UserDashboard = () => {
  return (
    <div className="relative min-h-screen overflow-hidden text-black">

      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover -z-10"
      >
        <source src={userbg} type="video/mp4" />
      </video>

      <div className="absolute inset-0 bg-beige-50/70 backdrop-blur-xs z-0"></div>

      {/* Centered but slightly upper */}
      <div className="relative z-10 min-h-screen flex flex-col justify-center items-center text-center px-10
                      -translate-y-16 transition-all duration-700 ease-out">
        
        <h2 className="text-5xl font-extrabold mb-10 text-orange-200 tracking-wide
                       transition-all duration-700 ease-out hover:scale-105">
          User Dashboard
        </h2>

        <div className="flex gap-8">
          <Link
            className="px-8 py-4 rounded-lg bg-black text-orange-50 text-lg font-semibold
                       transition-all duration-300 ease-out
                       hover:bg-orange-200 hover:text-black hover:scale-105"
            to="/home"
          >
            Home
          </Link>

          <Link
            className="px-8 py-4 rounded-lg bg-black text-orange-50 text-lg font-semibold
                       transition-all duration-300 ease-out
                       hover:bg-orange-200 hover:text-black hover:scale-105"
            to="/browse"
          >
            Browse Events
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
