import { useEffect, useState } from 'react';
import { db, auth } from '../FirebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import Dropdown from './Dropdown';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Absolute = () => {
    const [schedules, setSchedules] = useState([]);
    const { location } = useParams();
    const navigate = useNavigate();

    let absoluteCollectionRef = collection(db, "absoluteSTV");
    if (location === "CTP") {
        absoluteCollectionRef = collection(db, "absoluteCTP");
    } else if (location == "MW") {
        absoluteCollectionRef = collection(db, "absoluteMW");
    } else if (location == "KTG") {
        absoluteCollectionRef = collection(db, "absoluteKTG");
    }

    useEffect(() => {
      const getClasses = async () => {
        const data = await getDocs(absoluteCollectionRef);
        const filteredData = data.docs.map((doc) => ({...doc.data(), id: doc.id}))
        setSchedules(filteredData);
      };
      getClasses();
    }, []);
  
    // Convert time to a comparable value
    const timeToNumber = (time) => {
        const [hour, minutePart] = time.split(':');
        const minute = minutePart.slice(0, 2);
        const period = minutePart.slice(2);
        let hourNumber = parseInt(hour);
        if (period.toUpperCase() === 'PM' && hourNumber !== 12) {
            hourNumber += 12;
        }
        if (period.toUpperCase() === 'AM' && hourNumber === 12) {
            hourNumber = 0;
        }
        return hourNumber * 60 + parseInt(minute);
    };

    // Grouping and sorting the data by date and time
    const groupedSchedules = schedules.reduce((acc, curr) => {
        const date = curr.date;
        if (!acc[date]) {
            acc[date] = [];
        }
        acc[date].push(curr);
        return acc;
    }, {});

    // Sort dates in increasing order
    const sortedDates = Object.keys(groupedSchedules).sort((a, b) => {
        const [dayA, monthA] = a.split('.');
        const [dayB, monthB] = b.split('.');
        if (monthA > monthB) return 1;
        if (monthA < monthB) return -1;
        return dayA - dayB;
    });

    const dropdownClicked = () => {
        window.location.reload();
    };

    const enroll = (date, classDetails) => {
        if (!auth.currentUser) {
            toast.error("Sign in to add this class to your schedule");
            return;
        }
        const confirm = window.confirm("Add this class to your schedule?");
        if (!confirm) return;
        return navigate(`/add-class/${auth?.currentUser?.uid}`, 
                        {state: {instructor: classDetails.instructor, 
                                notes: classDetails.type,
                                location: `Absolute-${location}`,
                                date: date,
                                time: classDetails.time}});
    }

    const days = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
    
    return (
        <>
            <h1 className="text-3xl font-bold mt-8 mb-4 text-center">Absolute <Dropdown currLocation={location} handleClick={dropdownClicked}/> Schedule</h1> 
            <div className="p-4 ml-5 mt-5 mb-5">
                <div className="grid grid-cols-7 gap-7">
                    {sortedDates.map((date, index) => (
                    <div key={date} className="border p-5">
                        <div className="text-center font-normal">{date} {days[index]}</div>
                        {groupedSchedules[date]
                        .sort((a, b) => timeToNumber(a.time) - timeToNumber(b.time))
                        .map((schedule, index) => (
                            <div key={index} className="mt-5 mb-5">
                            <div onClick={() => enroll(date, schedule)} className="text-s font-bold cursor-pointer hover:underline">{schedule.type}</div>
                            <div className="text-s">{schedule.instructor}</div>
                            <div className="text-s">{schedule.time}</div>
                            </div>
                        ))}
                    </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default Absolute;
