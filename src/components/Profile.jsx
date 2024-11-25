import { NavLink, useParams } from 'react-router-dom';
import defaultPic from '../assets/images/birthdayRat.png';
import { auth } from "../FirebaseConfig";
import CurrentUser from './CurrentUser';
import FriendsList from './FriendsList';
import { IoIosMail, IoIosMailUnread, IoIosAddCircleOutline } from "react-icons/io";
import { unreadMessages } from './Auth';
import { Tooltip } from '@material-tailwind/react';

const Profile = () => {
    const {userId} = useParams();

  return (
    <>
    <h1 className="text-3xl font-bold mt-8 mb-4 text-center">My Profile</h1>
    <div className="max-w-md mx-auto mt-5 mb-8 p-6 border border-gray-300 rounded-lg shadow-lg relative">
        <Tooltip content="Mailbox">
            <div className="absolute top-0 right-0 mt-2 mr-2">
                <NavLink to={`/mail/${userId}`}>
                    {!unreadMessages && <IoIosMail className="w-8 h-8"/>}
                    {unreadMessages && <IoIosMailUnread className="w-8 h-8"/>}
                </NavLink>
            </div>
        </Tooltip>
        <CurrentUser auth={auth} >
            {(user) => (<>
                <div className="flex items-center justify-center">
                    <img
                    src={user?.photoURL || defaultPic} 
                    alt="Profile"
                    className="w-24 h-24 rounded-full border border-gray-400 object-cover"
                    />
                </div>
                <div className="flex items-center justify-center mt-4">
                    <p className="text-xl font-semibold">{user?.displayName}</p>
                </div>
                <div className="mt-6 flex">
                    <h2 className="text-lg font-semibold">Friends</h2>
                    <Tooltip content="Add Friends">
                        <div className="ml-2">
                            <NavLink to={`/add-friends/${userId}`}>
                                <IoIosAddCircleOutline className="w-8 h-8"/>
                            </NavLink>
                        </div>
                    </Tooltip>
                </div> 
                <div className="mt-2">
                    <FriendsList userId={user?.uid}/>
                </div>
            </>)}
        </CurrentUser> 
    </div>
    </>
  )
}

export default Profile

