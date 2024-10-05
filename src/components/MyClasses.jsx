import {useState, useEffect} from 'react';
import Spinners from './Spinners';
import { NavLink, useParams } from 'react-router-dom';
import { db } from '../FirebaseConfig';
import { getDocs, addDoc, collection } from 'firebase/firestore';
import { RxCross2 } from "react-icons/rx";
import { TiTick } from "react-icons/ti";
import { fetchFriendList } from './FriendsUtil';
import { toast } from 'react-toastify';

const MyClasses = ({deleteClass}) => {
    const onDeleteClick = (classId) => {
        const confirm = window.confirm("Delete this class?");
        if (!confirm) return;
        deleteClass(classId);
    }

    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [popupOpen, setPopupOpen] = useState(false);
    const [friendList, setFriendList] = useState([]);
    const [currClass, setCurrClass] = useState(undefined);
    const [selectedFriends, setSelectedFriends] = useState([]);
    const {userId} = useParams();

    const togglePopup = (classItem) => {
        setPopupOpen(!popupOpen);
        setSelectedFriends([]);
        setCurrClass(classItem);
    };

    const toggleSelectFriend = (id) => {
        setSelectedFriends((prevSelected) =>
          prevSelected.includes(id)
            ? prevSelected.filter((friendId) => friendId !== id)
            : [...prevSelected, id]
        );
    };

    const inviteFriends = (spinClass) => {
        selectedFriends.map((friend) => {
            const mailboxRef = collection(db, "users", friend, "mail");
            const res = addDoc(mailboxRef, {
                senderId: userId,
                content: `Come join me at ${spinClass.instructor}'s class on ${spinClass.date.toDate().toDateString()} ${spinClass.date.toDate().toLocaleTimeString(undefined, {hour: 'numeric', minute: 'numeric'})} at ${spinClass.location}. I will be on bike ${spinClass.bike}.`,
            });
        })
        toast.success("Invites sent successfully");
        togglePopup(undefined);
        return;
    }

    const classesCollectionRef = collection(db, "classes");

    useEffect(() => {
        fetchFriendList(userId, setFriendList);
      }, [userId]);

    useEffect(() => {
        const fetchClasses = async () => {
            try {
                //const res = await fetch('/api/spinClasses');
                //const data = await res.json();
                const data = await getDocs(classesCollectionRef);
                const filteredData = data.docs
                    .map((doc) => ({...doc.data(), id: doc.id}))
                    .filter((currClass) => currClass.userId === userId);
                setClasses(filteredData);
            } catch (error) {
                console.log("Error fetching data", error);
            } finally {
                setLoading(false);
            }
        }
        fetchClasses();
    }, []);

  return (
    <div className="container mx-auto mt-6 px-8 py-5">
        <h1 className="text-3xl font-bold mb-4">Upcoming Classes</h1>
            {loading ? (<Spinners loading={loading} />) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {classes.filter(item => item.date.toDate() >= new Date()).map((classItem) => (
                        <div key={classItem.id} className="bg-gray-200 p-4 rounded-md shadow-md">
                            <p><strong>Date:</strong> {classItem.date.toDate().toDateString()}</p>
                            <p><strong>Time:</strong> {classItem.date.toDate().toLocaleTimeString(undefined, {hour: 'numeric', minute: 'numeric'})}</p>
                            <p><strong>Instructor:</strong> {classItem.instructor}</p>
                            <p><strong>Location:</strong> {classItem.location}</p>
                            <p><strong>Rider:</strong> {classItem.rider}</p>
                            <p><strong>Bike Number:</strong> {classItem.bike}</p>
                            <p><strong>Notes:</strong> {classItem.notes}</p>
                            <div className="flex justify-end mt-2">
                            <button onClick={() => togglePopup(classItem)} className="bg-green-500 hover:bg-green-600 text-black font-bold py-2 px-4 mr-1 rounded">Invite</button>
                                <div className="flex">
                                    <NavLink to={`/edit-class/${classItem.id}/${userId}`} className="bg-blue-500 hover:bg-blue-700 text-black font-bold py-2 px-4 mr-1 rounded">
                                        Edit
                                    </NavLink>
                                </div>
                                <button onClick={() => onDeleteClick(classItem.id)} className="bg-red-400 hover:bg-red-600 text-black font-bold py-2 px-4 rounded">Delete</button>
                            </div>
                        </div>
                    ))}
                </div>)}

        <h1 className="text-3xl font-bold mb-4 mt-4">Past Classes</h1>
            {loading ? (<Spinners loading={loading} />) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {classes.filter(item => item.date.toDate() <= new Date()).map((classItem) => (
                        <div key={classItem.id} className="bg-gray-200 p-4 mb-2 rounded-md shadow-md">
                            <p><strong>Date:</strong> {classItem.date.toDate().toDateString()}</p>
                            <p><strong>Time:</strong> {classItem.date.toDate().toLocaleTimeString(undefined, {hour: 'numeric', minute: 'numeric'})}</p>
                            <p><strong>Instructor:</strong> {classItem.instructor}</p>
                            <p><strong>Location:</strong> {classItem.location}</p>
                            <p><strong>Rider:</strong> {classItem.rider}</p>
                            <p><strong>Bike Number:</strong> {classItem.bike}</p>
                            <p><strong>Notes:</strong> {classItem.notes}</p>
                            <div className="flex justify-end mt-2">
                                <button onClick={() => onDeleteClick(classItem.id)} className="bg-red-400 hover:bg-red-600 text-black font-bold py-2 px-4 rounded">Delete</button>
                            </div>
                        </div>
                    ))}
                </div>)}

        {popupOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div className="bg-white rounded-lg shadow-lg p-4 w-80">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold">Invite Friends</h2>
                        <button onClick={() => togglePopup(undefined)} className="text-gray-500 hover:text-gray-700">
                            <RxCross2 size={20} />
                        </button>
                    </div>
                    {friendList.length > 0 && friendList.map((friend) => (
                        <div key={friend.id} onClick={() => toggleSelectFriend(friend.id)} className="flex mr-3 items-center">
                            <div className="relative">
                                <img src={friend.pic} className={`cursor-pointer w-12 h-12 rounded-full border ${selectedFriends.includes(friend.id) ? "border-blue-500 border-2" : "border-gray-400"} object-cover mr-2 mb-2`} alt="profilepic"/>
                                {selectedFriends.includes(friend.id) && (
                                    <span className="absolute bottom-2 right-2 w-4 h-4 bg-blue-500 text-white flex items-center justify-center rounded-full">
                                        <TiTick />
                                    </span>
                                )}
                            </div>
                            <p>{friend.name}</p>
                        </div>
                    ))}
                    {friendList.length === 0 && <p>No friends yet</p>}
                    <button disabled={selectedFriends.length === 0} onClick={() => inviteFriends(currClass)} 
                        className={`flex ml-auto py-2 px-2 rounded ${selectedFriends.length === 0 ? 'cursor-not-allowed border-gray-300 bg-gray-200 text-gray-400' : 'bg-blue-500 hover:bg-blue-700 text-black font-bold'}`}>
                            Confirm
                    </button>
                </div>
            </div>
        )}
    </div>
  )
}

export default MyClasses
