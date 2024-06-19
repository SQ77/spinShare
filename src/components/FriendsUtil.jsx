import { db } from '../FirebaseConfig';
import { collection, query, where, getDocs, or, getDoc, doc } from 'firebase/firestore';

export let friends = [];

export const fetchFriendList = async (userId, setFriendList) => {
    if (userId) {
        try {
            // Query friendships collection for documents where the user's ID appears in either user1Id or user2Id fields
            const friendListQuery = query(
              collection(db, 'friendships'),
              or(where('user1id', '==', userId), 
              where('user2id', '==', userId)) 
            );
    
            const friendListSnapshot = await getDocs(friendListQuery);
            friends = await Promise.all(friendListSnapshot.docs.map(async (doc1) => {
                const friendData = doc1.data();
                const friendId = friendData.user1id === userId ? friendData.user2id : friendData.user1id;
                // Fetch the friend's name from the "users" collection based on their userID
                const friendDoc = await getDoc(doc(db, 'users', friendId));
                return { id: friendId, name: friendDoc.data().name, pic: friendDoc.data().profilepic };
            }));
            setFriendList(friends);
          } catch (error) {
            console.error('Error fetching friend list:', error);
          }
    }
};




