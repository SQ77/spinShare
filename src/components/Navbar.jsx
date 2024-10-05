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
    <nav className="bg-blue-800 border-b border-blue-600">
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
                  <NavLink to="/absolute/STV" 
                    className={`text-white hover:bg-gray-900 rounded-md px-3 py-2 ${(isActive('/absolute/STV') || isActive('/absolute/CTP') || isActive('/absolute/MW') || isActive('/absolute/KTG')) && 'bg-black'}`}>Absolute</NavLink>
                  <NavLink to="/ally" className={`text-white hover:bg-gray-900 rounded-md px-3 py-2 ${isActive('/ally') && 'bg-black'}`}>Ally</NavLink>
                  {/*<NavLink to="/revo/TP" 
                    className={`text-white hover:bg-gray-900 rounded-md px-3 py-2 ${(isActive('/revo/TP') || isActive('/revo/Orchard') || isActive('/revo/Bugis') || isActive('/revo/Suntec')) && 'bg-black'}`}>Revo</NavLink>*/}
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
