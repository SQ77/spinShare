import { IoPersonAdd } from "react-icons/io5";
import { useState, useEffect } from 'react';
import { db } from '../FirebaseConfig';
import { collection, addDoc } from 'firebase/firestore';

const FriendCard = ({ currUserId, potentialFriend }) => {
    const [buttonDisabled, setButtonDisabled] = useState(false);
    const friendRequestsCollectionRef = collection(db, "friendRequests");

    useEffect(() => {
        const isButtonDisabled = localStorage.getItem(`buttonDisabled/${potentialFriend.id}`);
    
        if (isButtonDisabled === 'true') {
          setButtonDisabled(true);
        }
      }, []);

    const sendRequest = async () => {
        // Add new friend request
        await addDoc(friendRequestsCollectionRef, {
            senderId: currUserId,
            receiverId: potentialFriend.id,
        });
        setButtonDisabled(true);
        localStorage.setItem(`buttonDisabled/${potentialFriend.id}`, 'true');
        return;
    }

  return (
    <div key={potentialFriend?.id} className="border border-black rounded p-4 mb-4 mr-4 flex flex-col items-center relative"> 
        <img src={potentialFriend?.profilepic} className="w-12 h-12 rounded-full border-2 border-gray-300 mb-2 object-cover" alt="profilepic"/> 
        <p className="text-gray-800 mb-2 font-semibold">{potentialFriend?.name}</p> 
        {!buttonDisabled && <button onClick={() => sendRequest()} className="flex items-center border border-blue-400 bg-white text-blue-500 hover:bg-blue-50 font-semibold py-2 px-4 rounded-full">
            Add Friend
            <IoPersonAdd className="ml-2" />
        </button>}
        {buttonDisabled && <button disabled className="flex items-center border border-gray-500 bg-white text-gray-500 font-semibold py-2 px-4 rounded-full">
            Request Sent
        </button>}
    </div>
  )
}

export default FriendCard
