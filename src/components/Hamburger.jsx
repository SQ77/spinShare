import { useState } from 'react';
import { GiHamburgerMenu } from "react-icons/gi";
import { NavLink } from 'react-router-dom';
import { auth } from "../FirebaseConfig";
import CurrentUser from './CurrentUser';

const Hamburger = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative">
      {/* Hamburger button */}
      <button 
        id="menu"
        aria-label="menu"
        className="md:hidden p-2 focus:outline-none" 
        onClick={toggleMenu}
      >
        <GiHamburgerMenu className="h-10 w-10 mt-2 text-white"/>
      </button>

      {/* Menu items */}
      <div className={`absolute top-12 left-2 w-auto bg-gray-500 shadow-md z-50 rounded-md mt-2 md:hidden ${isOpen ? 'block' : 'hidden'}`}>
        <div className="flex flex-col items-start p-2" onClick={toggleMenu}>
            <NavLink to="/" className="text-white rounded-md px-2 py-2">Home</NavLink>
            <NavLink to="/absolute/STV" className="text-white rounded-md px-2 py-2">Absolute</NavLink>
            <NavLink to="/ally" className="text-white rounded-md px-2 py-2">Ally</NavLink>
            <NavLink to="/revo/TP" className="text-white rounded-md px-2 py-2">Revo</NavLink>
            <CurrentUser auth={auth} >
                {(user) => (
                    <>
                    {user && <NavLink to={`/schedule/${user?.uid}`} className="text-white rounded-md px-2 py-2">Schedule</NavLink>}
                    {user && <NavLink to={`/classes/${user?.uid}`} className="text-white rounded-md px-2 py-2">My Classes</NavLink>}
                    {user && <NavLink to={`/add-class/${user?.uid}`} className="text-white rounded-md px-2 py-2">Add Class</NavLink>}
                    {user && <NavLink to={`/profile/${user?.uid}`} className="text-white rounded-md px-2 py-2">Profile</NavLink>}
                    </>)}
            </CurrentUser>
        </div>
      </div>
    </div>
  );
};

export default Hamburger;