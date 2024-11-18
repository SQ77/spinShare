import { useState, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';

const Dropdown = ({ currLocation, handleClick, studio }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    let locations = [];
    if (studio === "absolute") {
      locations = ["STV", "CTP", "MW", "KTG"];
    } else {
      locations = ["TP", "Orchard", "Bugis"];
    }

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
          setIsOpen(false);
        }
      };
    
    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <div>
        <button
          type="button"
          className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-bold text-black hover:bg-gray-100 focus:outline-none"
          id="options-menu"
          aria-expanded="true"
          aria-haspopup="true"
          onClick={toggleDropdown}
        >
          {currLocation}
          <svg
            className="-mr-1 ml-2 h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06 0L10 10.94l3.71-3.73a.75.75 0 111.06 1.06l-4 4a.75.75 0 01-1.06 0l-4-4a.75.75 0 010-1.06z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
      
      {isOpen && (
        <div
          className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="options-menu"
        >
            <div className="py-1" role="none">
                {locations.filter(loc => loc !== currLocation).map((location, index) => (
                    <div role="menuitem" key={index} onClick={() => handleClick()}>
                    <NavLink to={`/${studio}/${location}`}
                    className="block px-4 py-2 text-sm text-black hover:bg-gray-200"
                    >
                        {location}
                    </NavLink> 
                    </div>
                ))}
            </div>
        </div>
      )}
    </div>
  )
}

export default Dropdown;
