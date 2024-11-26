import React from 'react';

const SearchBar = ({ placeholder, onSearch }) => {
  return (
    <div className="relative mb-4">
      <input
        type="text"
        className="w-full p-3 pl-10 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-color1"
        placeholder={placeholder}
        onChange={(e) => onSearch(e.target.value)}
      />
      <svg
        className="absolute left-3 top-3 w-5 h-5 text-gray-400"
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1111.546 3.032l4.387 4.387a1 1 0 01-1.414 1.414l-4.387-4.387A6 6 0 012 8z"
          clipRule="evenodd"
        />
      </svg>
    </div>
  );
};

export default SearchBar;