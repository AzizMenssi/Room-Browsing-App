"use client";
import RoomCard from "@/components/RoomCard";
import { useState, useEffect, useCallback } from "react";

interface Room {
  _id: number;
  name: string;
  type: string;
  price: number;
  currency: string;
  availability: boolean;
  description: string;
  features: {
    bedType: string;
    maxOccupancy: number;
    wifi: boolean;
    airConditioning: boolean;
    tv: boolean;
    minibar: boolean;
  };
  images: string[];
}

const roomTypes = [
  "Single",
  "Double",
  "Suite",
  "Deluxe",
  "Presidential",
  "Studio",
  "Penthouse",
  "Family Room",
  "King",
  "Queen",
];

export default function Home() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const [rooms, setRooms] = useState<Room[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filterType, setFilterType] = useState<string>("");
  const [minPrice, setMinPrice] = useState<number | string>("");
  const [maxPrice, setMaxPrice] = useState<number | string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const fetchRooms = useCallback(async () => {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: "5",
      type: filterType,
      minPrice: minPrice ? minPrice.toString() : "",
      maxPrice: maxPrice ? maxPrice.toString() : "",
      search: searchQuery,
    }).toString();

    const response = await fetch(`${apiUrl}/api/rooms?${queryParams}`);
    const data = await response.json();
    setRooms(data.data);
    setTotalPages(data.totalPages);
  }, [page, filterType, minPrice, maxPrice, searchQuery, apiUrl]);

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterType(e.target.value);
    setPage(1);
  };

  const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMinPrice(e.target.value);
    setPage(1);
  };

  const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMaxPrice(e.target.value);
    setPage(1);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleReset = () => {
    setFilterType("");
    setMinPrice("");
    setMaxPrice("");
    setSearchQuery("");
    setPage(1);
  };

  return (
    <div className="justify-self-center m-6 rounded-md w-full max-w-[calc(100%_-_48px)] h-[calc(100%_-_48px)] text-text place-self-center">
      <div className="flex flex-col md:flex-row gap-4 w-auto h-full min-h-screen">
        {/* Filters */}
        <div className="bg-surface shadow-lg p-6 rounded-lg">
          <h2 className="mb-4 font-semibold text-lg text-text">Filters</h2>

          <div className="grid grid-cols-1 gap-4 min-w-[320px]">
            <div>
              <label
                htmlFor="search"
                className="block font-medium text-secondary"
              >
                Search:
              </label>
              <input
                id="search"
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search rooms"
                className="bg-background p-2 rounded-md w-full text-text focus:ring-2 focus:ring-white"
              />
            </div>
            <div>
              <label
                htmlFor="room-type"
                className="block font-medium text-secondary"
              >
                Room Type:
              </label>
              <select
                id="room-type"
                value={filterType}
                onChange={handleTypeChange}
                className="bg-background p-2 rounded-md w-full text-text focus:ring-2 focus:ring-white"
              >
                <option value="">All</option>
                {roomTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="min-price"
                className="block font-medium text-secondary"
              >
                Min Price ($):
              </label>
              <input
                id="min-price"
                type="number"
                value={minPrice}
                onChange={handleMinPriceChange}
                placeholder="Min Price"
                className="bg-background p-2 rounded-md w-full text-text focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label
                htmlFor="max-price"
                className="block font-medium text-secondary"
              >
                Max Price ($):
              </label>
              <input
                id="max-price"
                type="number"
                value={maxPrice}
                onChange={handleMaxPriceChange}
                placeholder="Max Price"
                className="bg-background p-2 rounded-md w-full text-text focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <button
            onClick={handleReset}
            className="bg-primary hover:opacity-90 mt-4 px-4 py-2 rounded-md w-full font-medium text-black transition"
          >
            Reset Filters
          </button>
        </div>
        <div className="bg-surface shadow-lg p-6 rounded-lg grow">
          <div className="flex flex-row flex-wrap items-center justify-center lg:justify-between gap-4 sm:px-6 pt-4 pb-16">
            <h1 className="font-bold text-4xl text-center text-white">
              Explore Our Rooms
            </h1>
            {/* Pagination Controls */}
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                className="bg-primary hover:opacity-80 disabled:opacity-50 px-4 py-2 rounded-md font-medium text-text transition"
              >
                Previous
              </button>

              <span className="font-medium text-lg text-text">
                Page {page} of {totalPages}
              </span>

              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages}
                className="bg-primary hover:opacity-80 disabled:opacity-50 px-4 py-2 rounded-md font-medium text-text transition"
              >
                Next
              </button>
            </div>
          </div>
          {/* Rooms List */}
          <div className="flex flex-wrap items-center justify-center gap-6">
            {rooms.length > 0 ? (
              rooms.map((room) => <RoomCard key={room._id} room={room} />)
            ) : (
              <p className="pt-6 w-full max-w-96 text-center text-white">
                No rooms available.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
