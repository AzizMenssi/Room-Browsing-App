import { useEffect, useState } from "react";
interface Room {
  name: string;
  description: string;
  price: number;
  currency: string;
  type: string;
  availability: boolean;
  images: string[];
  features: {
    bedType: string;
    maxOccupancy: number;
    wifi: boolean;
    airConditioning: boolean;
    tv: boolean;
    minibar: boolean;
  };
}
const RoomCard = ({ room }: { room: Room }) => {
  const [imageIndex, setImageIndex] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setImageIndex((prevIndex) =>
        prevIndex === room.images.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000);
    return () => clearInterval(interval);
  }, [room.images]);
  return (
    <div className="flex flex-col bg-background shadow-lg rounded-lg w-[30%] min-w-[320px] max-w-[500px] text-white transform transition-transform overflow-hidden">
      <img
        className="w-full h-48 transition-opacity duration-500 object-cover"
        src={room.images[imageIndex]}
        alt={room.name}
      />
      <div className="p-4">
        <div className="flex flex-row items-center justify-start gap-2 mb-2">
          <h5 className="font-semibold text-xl">{room.name}</h5>
          <p className="font-medium text-primary text-xl">
            ({room.price} {room.currency})
          </p>
        </div>
        <p className="text-gray-300">{room.description}</p>
      </div>
      {/* Features Section */}
      <div className="flex md:flex-row flex-wrap items-center justify-around gap-2 md:gap-0 mt-auto px-4 py-3 border-t border-gray-600 text-gray-300">
        <p className="px-2">Type: {room.type}</p>
        <p className="px-2">Max Occupancy: {room.features.maxOccupancy}</p>
      </div>
      {/* Boolean Features Section */}
      <div className="flex items-center justify-around px-4 py-2 border-t border-gray-600 text-gray-300">
        <p className="px-2"> {room.features.bedType} Bed</p>
        {room.features.wifi && (
          <div className="flex items-center gap-1">
            <span>WiFi</span>
          </div>
        )}
        {room.features.airConditioning && (
          <div className="flex items-center gap-1">
            <span>AC</span>
          </div>
        )}
        {room.features.tv && (
          <div className="flex items-center gap-1">
            <span>TV</span>
          </div>
        )}
        {room.features.minibar && (
          <div className="flex items-center gap-1">
            <span>Minibar</span>
          </div>
        )}
      </div>
      {/* Availability Section */}
      <div className="px-4 py-3 border-t border-gray-600 text-center text-gray-300">
        <p>
          <span
            className={room.availability ? "text-green-400" : "text-red-400"}
          >
            {room.availability ? "Available" : "Not Available"}
          </span>
        </p>
      </div>
    </div>
  );
};
export default RoomCard;
