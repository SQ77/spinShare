import { useState, useEffect } from 'react';
import { AiFillLike } from 'react-icons/ai';
import { db } from '../FirebaseConfig';
import { getDoc, doc } from 'firebase/firestore';

const Spin = ({ time, instructor, location, userId }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [mouseOverLike, setMouseOverLike] = useState(false);
  const [user, setUser] = useState(null);

    useEffect(() => {
        const getUserFromId = async () => {
            try {
              const data = await getDoc(doc(db, "users", userId));
              setUser(data.data());
            } catch (error) {
                console.log("Error fetching user data given ID", error);
            }
        };

        getUserFromId();
    }, [userId]);

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`bg-gray-200 p-1 rounded-md shadow-md w-30 border border-black relative ${
          isHovered ? 'hover:bg-gray-300' : ''
        }`}
      >
        <p className="text-lg text-black">{time}</p>
        <p className="text-lg text-black">{instructor}</p>
        <p className="text-lg text-black">{location}</p>
        <img
          src={user?.profilepic}
          className="w-8 h-8 rounded-full border border-2 border-gray-300 mb-2 object-cover absolute top-0 right-0"
          alt="user"
        />
      </div>
      {/*
      {isHovered && (
        <div 
            className="absolute bg-white border border-gray-300 p-4 rounded shadow-lg top-0 left-full mt-0"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
          <AiFillLike color='blue' 
            size={mouseOverLike ? '30' : '25'} 
            onMouseEnter={() => setMouseOverLike(true)}
            onMouseLeave={() => setMouseOverLike(false)}
          />
        </div>
      )} */}
    </div>
  );
};

export default Spin;
