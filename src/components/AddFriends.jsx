import { useState, useEffect } from 'react';
import { db } from '../FirebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import { useParams } from 'react-router-dom';
import FriendCard from './FriendCard';
import { friendsList } from './FriendsList';

const AddFriends = () => {
    const [usersList, setUsersList] = useState([]);
    const usersCollectionRef = collection(db, "users");
    const {userId} = useParams();

    useEffect(() => {
      const fetchUsersList = async () => {
        try {
            const data = await getDocs(usersCollectionRef);
            const filteredData = data.docs
                .map((doc) => ({...doc.data(), id: doc.id}))
                .filter((user) => user.id !== userId && !friendsList.some(friend => friend.id === user.id));
            setUsersList(filteredData);        
        } catch (error) {
            console.error('Error fetching users list:', error);
        }
        
      };
      fetchUsersList();
    }, [friendsList]);

  return (
    <>
      <h1 className="text-3xl font-bold mt-8 mb-4 ml-8">Add Friends</h1>
      <div className="relative ml-8"> 
          <div className="flex flex-wrap mt-5">
              {usersList.length > 0 && usersList.map((user) => (
                  <FriendCard key={user.id} currUserId={userId} potentialFriend={user}/>
              ))}
              {usersList.length === 0 && <p className="font-semibold mb-3">No friends to add</p>}
          </div>
      </div>
    </>

  )
}

export default AddFriends;
