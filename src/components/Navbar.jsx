import React, { useState } from 'react';
import logo from '../assets/images/SpinShare.png';
import { NavLink, useLocation } from 'react-router-dom';
import Auth from './Auth';
import { auth } from "../FirebaseConfig";
import CurrentUser from './CurrentUser';
import Hamburger from './Hamburger';

const Navbar = () => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const handleDropdownToggle = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  const handleMouseLeave = () => {
    setDropdownOpen(false);
  };

  return (
    <nav className="bg-blue-800">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="flex h-20 md:items-center md:justify-between">
          <div className="flex flex-1 md:items-stretch md:justify-start">
            {/* <!-- Logo --> */}
            <NavLink to="/" className="flex flex-shrink-0 items-center ml-2 md:ml-0 mr-4">
              <img className="h-11 w-auto" src={logo} alt="SpinShare" />
            </NavLink>
            <Hamburger />
            <div className="ml-auto">
              <div className="hidden md:flex md:space-x-2">
                <NavLink
                  to="/"
                  className={`text-white hover:bg-gray-900 rounded-md px-3 py-2 ${isActive('/') && 'bg-black'}`}>
                  Home
                </NavLink>

                <div className="relative font-[sans-serif] w-max mx-auto group">
                  <button
                    type="button"
                    id="dropdownToggle"
                    className={`text-white hover:bg-gray-900 rounded-md px-3 py-2 ${isDropdownOpen && 'bg-black'}`}
                    onClick={handleDropdownToggle}
                  >
                    Studios
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-3 fill-white inline ml-3" viewBox="0 0 24 24">
                      <path fillRule="evenodd" d="M11.99997 18.1669a2.38 2.38 0 0 1-1.68266-.69733l-9.52-9.52a2.38 2.38 0 1 1 3.36532-3.36532l7.83734 7.83734 7.83734-7.83734a2.38 2.38 0 1 1 3.36532 3.36532l-9.52 9.52a2.38 2.38 0 0 1-1.68266.69734z" clipRule="evenodd" />
                    </svg>
                  </button>

                  {/* Dropdown menu */}
                  <ul id="dropdownMenu" className="absolute hidden group-hover:block shadow-lg bg-white py-2 z-[1000] min-w-full w-max rounded max-h-96 overflow-auto mt-0"> 
                    <NavLink to="/absolute/STV"
                      className={`block text-gray-800 hover:bg-indigo-600 hover:text-white rounded-md px-4 py-2 transition duration-150 ease-in-out ${isActive('/absolute/STV') && 'bg-gray-300 text-black'}`}>
                      Absolute
                    </NavLink>
                    <NavLink to="/ally"
                      className={`block text-gray-800 hover:bg-indigo-600 hover:text-white rounded-md px-4 py-2 transition duration-150 ease-in-out ${isActive('/ally') && 'bg-gray-300 text-black'}`}>
                      Ally
                    </NavLink>
                  </ul>
                </div>

                <CurrentUser auth={auth}>
                  {(user) => (
                    <>
                      {user && <NavLink to={`/schedule/${user?.uid}`} className={`text-white hover:bg-gray-900 rounded-md px-3 py-2 ${isActive(`/schedule/${user?.uid}`) && 'bg-black'}`}>Schedule</NavLink>}
                      {user && <NavLink to={`/classes/${user?.uid}`} className={`text-white hover:bg-gray-900 rounded-md px-3 py-2 ${isActive(`/classes/${user?.uid}`) && 'bg-black'}`}>My Classes</NavLink>}
                      {user && <NavLink to={`/add-class/${user?.uid}`} className={`text-white hover:bg-gray-900 rounded-md px-3 py-2 ${isActive(`/add-class/${user?.uid}`) && 'bg-black'}`}>Add Class</NavLink>}
                    </>
                  )}
                </CurrentUser>
                <Auth />
              </div>
              <div className="flex md:hidden items-center">
                <Auth />
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
