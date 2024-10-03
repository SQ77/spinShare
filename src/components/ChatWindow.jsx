import React, { useEffect, useState } from 'react';
import { db, auth } from '../FirebaseConfig';
import { collection, getDocs, query, where } from 'firebase/firestore';

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


const ChatWindow = ({ isOpen, onClose }) => {
  const [friendList, setFriendList] = useState([]);
  const [loading, setLoading] = useState(true);

  
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
          friends.push(doc.data());
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

  if (!isOpen) return null; // Don't render if the chat window isn't open
  if (loading) return <div>Loading...</div>; // Optional loading state

  return (
    <div className="chat-window" style={styles.chatWindow}>
      <div style={headerStyle}>
      <button onClick={onClose} style={{ float: 'right', color: 'white', background: 'none', border: 'none', cursor: 'pointer' }}>✖</button>
        <h4>Chat</h4>
      </div>
      <div className="friend-list">
      {friendList.length > 0 && friendList.map((friend) => (
            <div key={friend.id} className="mr-3 text-center relative">
              <div className="relative w-12 h-12">
                <img src={friend.pic} className="w-12 h-12 rounded-full border border-gray-400 object-cover" alt="profilepic"/>
              </div>
              <p className="mt-2">{friend.name}</p>
            </div>
          ))}
          {friendList.length === 0 && <p>No friends yet</p>}
      </div>
    </div>
  );
};

// Add styles for the chat window
const styles = {
  chatWindow: {
    position: 'fixed',
    bottom: '80px', // Above the chat button
    right: '20px',
    width: '300px', // Width of the chat window
    height: '400px', // Height of the chat window
    backgroundColor: 'white', // Background color
    border: '1px solid #ccc', // Border style
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    zIndex: 1000, // Ensure it is on top
    overflowY: 'auto', // Allow scrolling if content overflows
  },
};

export default ChatWindow;
