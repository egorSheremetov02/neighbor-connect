import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiSearch } from "react-icons/fi";

const Searchbar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleSearch = (event) => {
    event.preventDefault();
    if (!searchTerm.trim()) return;

    navigate(`/search/${encodeURIComponent(searchTerm.trim())}`);
    setSearchTerm("");
  };

  return (
    <form
      onSubmit={handleSearch}
      className="p-2 text-gray-400 focus-within:text-gray-600"
      role="search"
    >
      <label htmlFor="search-field" className="sr-only">
        Search for content
      </label>
      <div className="flex items-center">
        {/* <FiSearch aria-hidden="true" className="w-5 h-5 ml-4" /> */}
        <input
          type="search"
          id="search-field"
          name="search"
          className="flex-1 bg-transparent border-none placeholder-gray-500 outline-none text-base text-white p-4"
          // placeholder="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          // aria-label="Search for content"
          disabled
        />
      </div>
    </form>
  );
};

export default Searchbar;
