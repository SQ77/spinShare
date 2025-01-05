import { useState, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { FaChevronDown } from "react-icons/fa";

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
    <div className="relative inline-block" ref={dropdownRef}>
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
          <FaChevronDown
            className={`-mr-1 ml-2 h-4 w-4 transform transition-transform duration-300 ${
                isOpen ? "rotate-180" : "rotate-0"
            }`}
          />
        </button>
      </div>
      
      {isOpen && (
        <div
          className="origin-top-left absolute left-0 text-left mt-2 w-56 rounded-md shadow-lg bg-gray-200 ring-1 ring-black ring-opacity-5"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="options-menu"
        >
            <div className="py-1" role="none">
                {locations.filter(loc => loc !== currLocation).map((location, index) => (
                    <div role="menuitem" key={index} onClick={() => handleClick()}>
                    <NavLink 
                      to={`/${studio}/${location}`}
                      className="block px-4 py-2 text-sm text-black hover:bg-gray-300"
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
