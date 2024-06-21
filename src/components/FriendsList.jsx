import { useState, useEffect } from 'react';
import { IoIosAddCircleOutline } from "react-icons/io";
import { NavLink } from 'react-router-dom';
import { fetchFriendList, friends } from './FriendsUtil';
import { FiMinusCircle } from "react-icons/fi";
import { db } from '../FirebaseConfig';
import { deleteDoc, doc, getDocs, collection, query, where } from 'firebase/firestore';

export let friendsList = [];

const FriendsList = ({userId}) => {
    const [friendList, setFriendList] = useState([]);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
      fetchFriendList(userId, setFriendList);
      friendsList = friends;
    }, [userId]);

    const removeFriend = async (friendId) => {
      try {
        const confirm = window.confirm("Remove this friend?");
        if (!confirm) return;
        const friendshipsCollectionRef = collection(db, "friendships");
        // Create a query to find the friendship document
        const q1 = query(friendshipsCollectionRef, where('user1id', 'in', [userId, friendId]), where('user2id', 'in', [userId, friendId]));
        const querySnapshot = await getDocs(q1);

        // Delete the document found
        querySnapshot.forEach(async (docSnapshot) => {
          await deleteDoc(doc(db, 'friendships', docSnapshot.id));
        });
        return;
      } catch (error) {
        console.error("Error removing friend", error);
      }
    }
  
    return (
      <div className="relative ">
        <div className="flex">
          {friendList.length > 0 && friendList.map((friend) => (
            <div key={friend.id} className="mr-3 text-center relative">
              <div className="relative w-12 h-12">
                <img src={friend.pic} className="w-12 h-12 rounded-full border border-gray-400 object-cover" alt="profilepic"/>
                <FiMinusCircle onClick={() => removeFriend(friend.id)} className="absolute bottom-0 right-0 text-red-500 bg-white rounded-full size-4 hover:size-5" />
              </div>
              <p className="mt-2">{friend.name}</p>
            </div>
          ))}
          {friendList.length === 0 && <p>No friends yet</p>}
        </div>

        <div className="absolute bottom-5 right-0"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}>
            <NavLink to={`/add-friends/${userId}`}>
              <IoIosAddCircleOutline className={isHovered ? "w-10 h-10" : "w-8 h-8"}/>
            </NavLink>
        </div>
        {isHovered && (
        <div className="hidden md:block absolute bg-white border border-gray-300 p-2 rounded shadow-lg top-0 left-full mt-0 whitespace-nowrap"> 
          Add Friends
        </div>
        )}

      </div>
    );
}

export default FriendsList;
