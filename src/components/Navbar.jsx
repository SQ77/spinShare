import React from 'react'
import logo from '../assets/images/SpinShare.png'
import { NavLink, useLocation } from 'react-router-dom'
import Auth from './Auth';
import { auth } from "../FirebaseConfig";
import CurrentUser from './CurrentUser';
import Hamburger from './Hamburger';

const Navbar = () => {
  const location = useLocation();
  
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-indigo-700 border-b border-indigo-500">
        <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
          <div className="flex h-20 md:items-center md:justify-between">
            <div
              className="flex flex-1 md:items-stretch md:justify-start"
            >
              {/* <!-- Logo --> */}
              <NavLink to="/" className="flex flex-shrink-0 items-center ml-2 md:ml-0 mr-4">
                <img
                  className="h-11 w-auto"
                  src={logo}
                  alt="SpinShare"
                />
              </NavLink>
              <Hamburger />
              <div className="ml-auto">
                <div className="hidden md:flex md:space-x-2">
                  <NavLink to="/" className={`text-white hover:bg-gray-900 rounded-md px-3 py-2 ${isActive('/') && 'bg-black'}`}>Home</NavLink>
                  {/* Studios Dropdown */}
                  <div className="relative group">
                  <button className="text-white hover:bg-gray-900 rounded-md px-3 py-2">
                    Studios
                  </button>
                  <div className="absolute left-0 hidden group-hover:block bg-white shadow-lg rounded-md z-10 mt-0 transition duration-150 ease-in-out">
                    <NavLink to="/absolute/STV" 
                      className={`block text-gray-800 hover:bg-indigo-600 hover:text-white rounded-md px-4 py-2 transition duration-150 ease-in-out ${isActive('/absolute/STV') && 'bg-black text-white'}`}>
                      Absolute
                    </NavLink>
                    <NavLink to="/ally" 
                      className={`block text-gray-800 hover:bg-indigo-600 hover:text-white rounded-md px-4 py-2 transition duration-150 ease-in-out ${isActive('/ally') && 'bg-black text-white'}`}>
                      Ally
                    </NavLink>
                    </div>
                  </div>
                  <CurrentUser auth={auth} >
                    {(user) => (
                      <>
                        {user && <NavLink to={`/schedule/${user?.uid}`} className={`text-white hover:bg-gray-900 rounded-md px-3 py-2 ${isActive(`/schedule/${user?.uid}`) && 'bg-black'}`}>Schedule</NavLink>}
                        {user && <NavLink to={`/classes/${user?.uid}`} className={`text-white hover:bg-gray-900 rounded-md px-3 py-2 ${isActive(`/classes/${user?.uid}`) && 'bg-black'}`}>My Classes</NavLink>}
                        {user && <NavLink to={`/add-class/${user?.uid}`} className={`text-white hover:bg-gray-900 rounded-md px-3 py-2 ${isActive(`/add-class/${user?.uid}`) && 'bg-black'}`}>Add Class</NavLink>}
                      </>)}
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
  )
}

export default Navbar
