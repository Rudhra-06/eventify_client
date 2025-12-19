const Home = () => {
  return (
    <div className="relative w-full h-screen bg-beige-50 overflow-hidden flex items-center justify-center text-center">
      {/* Background video with blur */}
      <video
        autoPlay
        loop
        muted
        className="absolute w-full h-full object-cover -z-10 filter blur-xs opacity-95"
      >
        <source src="https://cdn.pixabay.com/video/2024/08/09/225661_tiny.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Content */}
      <div className="p-8 bg-black/60 rounded-xl">
        <h2 className="text-4xl font-extrabold mb-4 text-orange-200">
          Welcome to Eventify 🎉
        </h2>
        <p className="text-orange-50 text-lg">
          Create events. Discover events. Book events.
        </p>
      </div>
    </div>
  );
};

export default Home;
