import React from 'react'
import logo from '../assets/images/SpinShare.png'
import { NavLink, useLocation } from 'react-router-dom'
import Auth from './Auth';
import { auth } from "../FirebaseConfig";
import CurrentUser from './CurrentUser';

const Navbar = () => {
  const location = useLocation();
  
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-indigo-700 border-b border-indigo-500">
        <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            <div
              className="flex flex-1 items-center justify-center md:items-stretch md:justify-start"
            >
              {/* <!-- Logo --> */}
              <NavLink to="/" className="flex flex-shrink-0 items-center mr-4">
                <img
                  className="h-11 w-auto"
                  src={logo}
                  alt="SpinShare"
                />
              </NavLink>
              <div className="md:ml-auto">
                <div className="flex space-x-2">
                  <NavLink to="/" className={`text-white hover:bg-gray-900 rounded-md px-3 py-2 ${isActive('/') && 'bg-black'}`}>Home</NavLink>
                  <NavLink to="/absolute/STV" 
                    className={`text-white hover:bg-gray-900 rounded-md px-3 py-2 ${(isActive('/absolute/STV') || isActive('/absolute/CTP') || isActive('/absolute/MW') || isActive('/absolute/KTG')) && 'bg-black'}`}>Absolute</NavLink>
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
              </div>
            </div>
          </div>
        </div>
    </nav>
  )
}

export default Navbar
