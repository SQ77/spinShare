import {useState, useEffect} from 'react';
import Spinners from './Spinners';
import { NavLink, useParams } from 'react-router-dom';
import { db } from '../FirebaseConfig';
import { getDocs, collection } from 'firebase/firestore';

const MyClasses = ({deleteClass}) => {
    const onDeleteClick = (classId) => {
        const confirm = window.confirm("Delete this class?");
        if (!confirm) return;
        deleteClass(classId);
    }

    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const {userId} = useParams();

    const classesCollectionRef = collection(db, "classes");

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
    <div className="container mx-auto mt-8 px-8 py-5">
            <h1 className="text-3xl font-bold mb-4">My Classes</h1>
                {loading ? (<Spinners loading={loading} />) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {classes.map((classItem) => (
                            <div key={classItem.id} className="bg-gray-200 p-4 rounded-md shadow-md">
                                <p><strong>Date:</strong> {classItem.date.toDate().toDateString()}</p>
                                <p><strong>Time:</strong> {classItem.date.toDate().toLocaleTimeString(undefined, {hour: 'numeric', minute: 'numeric'})}</p>
                                <p><strong>Instructor:</strong> {classItem.instructor}</p>
                                <p><strong>Location:</strong> {classItem.location}</p>
                                <p><strong>Rider:</strong> {classItem.rider}</p>
                                <p><strong>Bike Number:</strong> {classItem.bike}</p>
                                <p><strong>Notes:</strong> {classItem.notes}</p>
                                <div className="flex justify-end mt-2">
                                    <div className="flex">
                                        <NavLink to={`/edit-class/${classItem.id}/${userId}`} className="bg-blue-500 hover:bg-blue-700 text-black font-bold py-2 px-4 rounded">
                                            Edit
                                        </NavLink>
                                    </div>
                                    <button onClick={() => onDeleteClick(classItem.id)} className="bg-red-400 hover:bg-red-600 text-black font-bold py-2 px-4 rounded">Delete</button>
                                </div>
                            </div>
                        ))}
                    </div>)}
    </div>
  )
}

export default MyClasses
