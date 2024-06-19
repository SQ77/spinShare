import Spin from "./Spin";
import {useState, useEffect} from 'react';
import { db } from '../FirebaseConfig';
import { getDocs, collection } from 'firebase/firestore';
import { useParams } from 'react-router-dom';
import { friends } from "./FriendsUtil";

const ScheduleTable = () => {
    const [classes, setClasses] = useState([]);
    const [week, setWeek] = useState(1);
    const classesCollectionRef = collection(db, "classes");
    const { userId } = useParams();

    useEffect(() => {
        const fetchClasses = async () => {
            try {
                //const res = await fetch('/api/spinClasses');
                //const data = await res.json();
                const data = await getDocs(classesCollectionRef);
                const filteredData = data.docs
                    .map((doc) => ({...doc.data(), id: doc.id}))
                    .filter((currClass) => currClass.userId === userId || friends.some(friend => friend.id === currClass.userId));
                setClasses(filteredData);
            } catch (error) {
                console.log("Error fetching data", error);
            } 
        }
        fetchClasses();
    }, []);

    const currentDate = new Date();
    if (week === 2) {
        currentDate.setDate(currentDate.getDate() + 7);
    }

    // Filter out classes that have already passed
    const filteredClasses = classes.filter(classItem => {
        const classDate = new Date(classItem.date.toDate());
        // Get the date parts of the class date and current date
        const classDateOnly = new Date(classDate.getFullYear(), classDate.getMonth(), classDate.getDate());
        const currentDateOnly = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
        return classDateOnly >= currentDateOnly;
    });
    
    // Sort classes by date
    const sortedClasses = filteredClasses.sort((a, b) => {
        return new Date(a.date) - new Date(b.date);
    });

    // Create an object to store classes by date
    const classesByDate = {};
    sortedClasses.forEach(classItem => {
        const classDate = new Date(classItem.date.toDate());
        const dateString = classDate.toDateString();
        if (!classesByDate[dateString]) {
            classesByDate[dateString] = [];
        }
        classesByDate[dateString].push(classItem);
    });

    const currentDayIndex = currentDate.getDay();
    const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

     // Create table headings for the next 7 days
     const tableHeadings = [];
     for (let i = 0; i < 7; i++) {
         const dayIndex = (currentDayIndex + i) % 7;
         const day = daysOfWeek[dayIndex];
         const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + i);
         tableHeadings.push({ day, date });
     }
    

    // Render the table headings along with classes for each day
    const headingsWithClasses = tableHeadings.map((heading, index) => {
        const classesForDay = classesByDate[heading.date.toDateString()] || [];
        const classesList = classesForDay.map((classItem, classIndex) => (
            <div key={classIndex} className='py-2'> 
                <Spin time={classItem.date.toDate().toLocaleTimeString(undefined, {hour: 'numeric', minute: 'numeric'})} 
                    instructor={classItem.instructor} 
                    location={classItem.location} 
                    userId={classItem.userId}/>
            </div>
        ));
        return (
            <th key={index} className={'border-gray-400 border-l border-r px-4 py-2'}>
                <div>
                    {`${heading.day} ${heading.date.getDate()}.${heading.date.getMonth() + 1}`}
                </div>
                <div className='py-5' style={{ fontWeight: 'normal' }}>
                    {classesList}
                </div>
            </th>
        );
    });

    return (
        <>
        <div className="flex justify-between p-4">
            <button disabled={week === 1} onClick={() => {setWeek(1);}} className={`flex items-center border-2 ${
                week === 1 ? 'cursor-not-allowed border-gray-300 bg-gray-200 text-gray-400' : 'border-black-700 bg-white text-black-500 hover:bg-gray-200'} 
                font-semibold mt-5 ml-5 py-2 px-4 rounded-full`}>
                Previous Week 
            </button>
            <button disabled={week === 2} onClick={() => {setWeek(2);}} className={`flex items-center border-2 ${
                week === 2 ? 'cursor-not-allowed border-gray-300 bg-gray-200 text-gray-400' : 'border-black-700 bg-white text-black-500 hover:bg-gray-200'} 
                font-semibold mt-5 mr-5 py-2 px-4 rounded-full`}>
                Next Week
            </button>
        </div>
        <div className="w-full overflow-x-auto px-8 py-8">
            <table className="table-auto w-full">
                {headingsWithClasses}
            </table>
        </div>
        </>
    );
}

export default ScheduleTable;
