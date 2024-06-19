import { useParams } from "react-router-dom";
import { useState, useEffect } from 'react';
import { db } from '../FirebaseConfig';
import { collection, query, where, getDocs, getDoc, doc } from 'firebase/firestore';
import Request from "./Request";
import Message from "./Message";

const Mail = () => {
    const {userId} = useParams();
    const [requestsList, setRequestsList] = useState([]);
    const [messagesList, setMessagesList] = useState([]);

    useEffect(() => {
        const fetchRequestsList = async () => {
            if (userId) {
                try {
                    // Query friendRequests collection for documents where the user's ID appears in receiverId field
                    const friendRequestQuery = query(
                        collection(db, 'friendRequests'),
                        where('receiverId', '==', userId)  
                    );
            
                    const requestSnapshot = await getDocs(friendRequestQuery);
                    const requests = await Promise.all(requestSnapshot.docs.map(async (doc1) => {
                        const sender = doc1.data().senderId;
                        // Fetch the sender's name from the "users" collection based on their userID
                        const senderDoc = await getDoc(doc(db, 'users', sender));
                        return { reqId: doc1.id, id: sender, name: senderDoc.data().name, pic: senderDoc.data().profilepic };
                    }));
                    setRequestsList(requests);
                } catch (error) {
                    console.error('Error fetching requests list:', error);
                }
            }
        };
    
        fetchRequestsList();
    }, [userId]);

    useEffect(() => {
        const fetchMessagesList = async () => {
            if (userId) {
                try {
                    const mailboxRef = collection(db, "users", userId, "mail");
                    const data = await getDocs(mailboxRef);
                    const filteredData = data.docs.map((doc) => ({...doc.data(), id: doc.id}));
                    setMessagesList(filteredData);
                } catch (error) {
                    console.error('Error fetching messages list:', error);
                }
            }
        }
        fetchMessagesList();
    }, [userId]);

  return (
    <>
        <h1 className="text-3xl font-bold mt-8 mb-4 ml-8">Friend Requests</h1>
        <div className="relative ml-8">
            <div className="flex flex-wrap mt-5">
            {requestsList.length > 0 && requestsList.map((request) => (
                <Request key={request?.id} currUserId={userId} requester={request} requestId={request?.reqId}/>
            ))}
            {requestsList.length === 0 && <p className="font-semibold py-5">No pending requests</p>}
            </div>
        </div>
        <h1 className="text-3xl font-bold mt-5 mb-4 ml-8">Messages</h1>
        <div className="ml-8 mb-8">
            {messagesList.map((msg) => (
                <Message key={msg.id} msgId={msg.id} receiverId={userId} content={msg.content} senderId={msg.senderId}/>
            ))}
        </div>
    </>
  )
}

export default Mail;
