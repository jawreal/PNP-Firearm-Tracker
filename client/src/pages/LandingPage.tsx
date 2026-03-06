import Navbar from "@/layouts/Navbar";

const LandingPage = () => {
  return (
    <div className="flex flex-col">
      <Navbar />
      <div className="grid grid-cols-2 px-4 md:px-10 lg:px-20 xl:px-32 relative h-screen">
        <div className="flex flex-col h-full justify-center py-24">
          <img
            src="/police_img.jpg"
            className="absolute inset-0 w-full h-full object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-blue-900/50 backdrop-blur-sm"></div>

          <div className="flex flex-col z-10">
            <h1 className="font-bold text-3xl md:text-4xl lg:text-5xl leading-tight text-white">
              SJDM PNP Logistics System
            </h1>
            <p className="text-gray-100 text-base lg:text-lg max-w-2xl">
              A centralized platform for registering, tracking, and managing
              police firearms, dedicated to the Logistics Department of the City
              Police Station in San Jose del Monte, Bulacan. The system ensures
              accurate records, accountability, and efficient monitoring of
              firearm assets.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
