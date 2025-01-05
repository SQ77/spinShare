import { useState, useEffect } from 'react';
import { db } from '../FirebaseConfig';
import { getDoc, doc, deleteDoc } from 'firebase/firestore';
import { RiDeleteBin6Line } from "react-icons/ri";

const Message = ({ msgId, receiverId, content, senderId }) => {
    const [sender, setSender] = useState(null);
    const [isDeleted, setIsDeleted] = useState(false);

    useEffect(() => {
        const getUserFromId = async () => {
            try {
              const data = await getDoc(doc(db, "users", senderId));
              setSender(data.data());
            } catch (error) {
                console.log("Error fetching user data given ID", error);
            }
        };

        getUserFromId();
    }, [senderId]);

    const deleteMessage = async () => {
      // Delete message from user's mail
      await deleteDoc(doc(db, "users", receiverId, "mail", msgId));
      setIsDeleted(true);
      return;
    }

    if (isDeleted) {
      return null;
    }

  return (
    <div className="bg-white rounded-lg shadow-md p-2 mb-4 mr-8 flex items-center relative">
      <img 
          src={sender?.profilepic} 
          className="w-12 h-12 rounded-full border border-gray-400 object-cover mr-4" 
          alt="senderpic"
      />
      <div className="flex-1">
          <p className="text-black">{content}</p>
          <p className="text-sm text-black">Sent by: {sender?.name}</p>
      </div>
      <RiDeleteBin6Line onClick={deleteMessage} className="absolute bottom-2 right-2 cursor-pointer text-gray-600 size-5 hover:text-gray-800 hover:size-8" />
    </div>
  )
}

export default Message
