import React, { useEffect, useState } from 'react';
import { db, auth } from '../FirebaseConfig';
import { collection, getDocs, query, where } from 'firebase/firestore';

const ChatWindow = ({ isOpen, onClose }) => {
  const [friendList, setFriendList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Styles for the chat window and its components
  const chatWindowStyle = {
    position: 'fixed',
    bottom: '80px', // Position it above the chat button
    right: '20px',
    width: '300px',
    height: '400px',
    backgroundColor: '#fff',
    border: '1px solid #ccc',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    zIndex: 1000,
    overflow: 'hidden',
  };

  const headerStyle = {
    backgroundColor: '#007bff',
    color: 'white',
    padding: '10px',
    textAlign: 'center',
  };

  const bodyStyle = {
    padding: '10px',
    height: 'calc(100% - 50px)', // Adjust height for header
    overflowY: 'auto',
  };

  // Fetch the friends list from the Firestore
  useEffect(() => {
    const fetchFriends = async () => {
      if (!auth.currentUser) return; // If there's no user logged in

      const userId = auth.currentUser.uid; // Get the current user's ID
      const friendshipsCollectionRef = collection(db, "friendships");
      const q = query(friendshipsCollectionRef, where('user1id', '==', userId)); // Adjust query as needed

      try {
        const querySnapshot = await getDocs(q);
        const friends = [];
        querySnapshot.forEach((doc) => {
          friends.push({ id: doc.id, ...doc.data() }); // Add friend ID to the data
        });
        setFriendList(friends);
      } catch (error) {
        console.error("Error fetching friends:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFriends();
  }, []);

  if (!isOpen) return null; 

  return (
    <div className="chat-window" style={chatWindowStyle}>
      <div style={headerStyle}>
        <button onClick={onClose} style={{ float: 'right', color: 'white', background: 'none', border: 'none', cursor: 'pointer' }}>
          ✖
        </button>
        <h4>Chat</h4>
      </div>
      <div className="friend-list" style={bodyStyle}>
        {friendList.length > 0 ? (
          friendList.map((friend) => (
            <div key={friend.id} className="mr-3 text-center relative">
              <div className="relative w-12 h-12">
                <img src={friend.pic} className="w-12 h-12 rounded-full border border-gray-400 object-cover" alt="profilepic"/>
              </div>
              <p className="mt-2">{friend.name}</p>
            </div>
          ))
        ) : (
          <p>No friends yet</p>
        )}
      </div>
    </div>
  );
};

// Export the ChatWindow component
export default ChatWindow;
