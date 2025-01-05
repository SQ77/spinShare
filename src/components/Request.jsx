import { db } from '../FirebaseConfig';
import { collection, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { useState } from 'react';
import { toast } from 'react-toastify';

const Request = ({ currUserId, requester, requestId }) => {
    const [isVisible, setIsVisible] = useState(true);
    const friendshipsCollectionRef = collection(db, "friendships");

    const acceptRequest = async () => {
        // Add new friendship
        await addDoc(friendshipsCollectionRef, {
          user1id: currUserId,
          user2id: requester?.id
        });

        // Delete request from friendRequests collection
        await deleteDoc(doc(db, "friendRequests", requestId));

        // Add new message to mail collection
        await addDoc(collection(db, "users", requester?.id, "mail"), {
          content: "I have accepted your friend request!",
          senderId: currUserId
        });

        setIsVisible(false);
        toast.success("You are now friends with " + requester?.name);
        return;
    }

    const rejectRequest = async () => {
      // Delete request from friendRequests collection
      await deleteDoc(doc(db, "friendRequests", requestId));
      setIsVisible(false);
      return;
    }

    if (!isVisible) {
      return null;
    }


  return (
    <div className="border border-black rounded p-4 mb-4 mr-4 flex flex-col items-center relative">
      <img src={requester?.pic} className="w-12 h-12 rounded-full border border-gray-400 object-cover" alt="senderpic"/>
      <p className="font-semibold py-2">{requester?.name}</p>
      <button onClick={acceptRequest} className="bg-green-500 hover:bg-green-600 text-black font-semibold py-2 px-4 mb-2 rounded-full">Accept</button>
      <button onClick={rejectRequest} className="bg-red-500 hover:bg-red-600 text-black font-semibold py-2 px-4 rounded-full">Reject</button>
    </div>
  )
}

export default Request;
