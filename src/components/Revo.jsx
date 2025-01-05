import { useEffect, useState } from 'react';
import { db, auth } from '../FirebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Dropdown from './Dropdown';
import Spinners from './Spinners';

const Revo = () => {
    const [schedules, setSchedules] = useState([]);
    const [expandedRows, setExpandedRows] = useState(Array(7).fill(false));
    const [loading, setLoading] = useState(true);

    const { location } = useParams();
    const navigate = useNavigate();

    const validLocations = {
        TP: "revoTP",
        Orchard: "revoOrchard",
        Bugis: "revoBugis",
    };

    if (!validLocations[location]) {
        useEffect(() => {
            navigate("/not-found");
        }, [navigate]); 
        return;
    }

    const revoCollectionRef = collection(db, validLocations[location]);

    useEffect(() => {
      const getClasses = async () => {
        try {
            const data = await getDocs(revoCollectionRef);
            const filteredData = data.docs.map((doc) => ({...doc.data(), id: doc.id}))
            setSchedules(filteredData);
        } catch {
            toast.error("Error occured when fetching Revolution class data!");
        } finally {
            setLoading(false);
        }
      };
      getClasses();
    }, []);

    const toggleExpand = (index) => {
        setExpandedRows((prev) => {
            const newExpandedRows = [...prev];
            newExpandedRows[index] = !newExpandedRows[index];
            return newExpandedRows;
        });
    };

    // Converts time to a comparable value
    const timeToNumber = (time) => {
        const [hour, minute] = time.split(':').map(Number);
        return hour * 60 + minute;
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

    // Sorts dates in increasing order
    const sortedDates = Object.keys(groupedSchedules).sort((a, b) => {
        return new Date(a) - new Date(b);
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
                                location: `Rev-${location}`,
                                date: date,
                                time: classDetails.time,
                                from: "revo"}});
    }

    // Converts date from YYYY-MM-DD to DD.MM 
    const convertDateFormat = (date) => {
        const [year, month, day] = date.split('-');
        return `${day}.${month}`;
    };

    // Converts time from HH:MM:SS to H:MM AM/PM
    const convertTimeFormat = (time) => {
        let [hour, minute] = time.split(':');
        hour = parseInt(hour);
        const period = hour >= 12 ? 'PM' : 'AM';
        hour = hour % 12 || 12;
        
        return `${hour}:${minute} ${period}`;
    };

    const days = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

    if (loading) {
        return <Spinners loading={true} />
    }
    
    return (
        <>
            <h1 className="text-3xl font-bold mt-8 mb-4 text-center">Revolution <Dropdown currLocation={location} handleClick={dropdownClicked} studio="revo"/> Schedule</h1> 
            <div className="p-4 ml-5 mt-5 mb-5">
                <div className="hidden md:grid md:grid-cols-7 gap-7">
                    {sortedDates.map((date, index) => (
                    <div key={date} className="border p-5">
                        <div className="text-center font-bold md:font-normal">{convertDateFormat(date)} {days[index]}</div>
                        {groupedSchedules[date]
                        .sort((a, b) => timeToNumber(a.time) - timeToNumber(b.time))
                        .map((schedule, index) => (
                            <div key={index} className="mt-5 mb-5">
                            <div onClick={() => enroll(convertDateFormat(date), schedule)} className="text-s font-bold cursor-pointer hover:underline">{schedule.type}</div>
                            <div className="text-s">{schedule.instructor}</div>
                            <div className="text-s">{convertTimeFormat(schedule.time)}</div>
                            </div>
                        ))}
                    </div>
                    ))}
                </div>
                
                {/* Small screens */}
                <div className="md:hidden">
                    {sortedDates.map((date, index) => (
                    <div key={index} className="border mb-3">
                        <div 
                        className="p-2 border text-center bg-gray-200 cursor-pointer h-auto"
                        onClick={() => toggleExpand(index)}
                        >
                        {convertDateFormat(date)} {days[index]}
                        </div>
                        {expandedRows[index] && (
                            <div> 
                            {groupedSchedules[date]
                            .sort((a, b) => timeToNumber(a.time) - timeToNumber(b.time))
                            .map((schedule, index) => (
                                <div key={index} className="ml-5 mt-5 mb-5">
                                    <div onClick={() => enroll(convertDateFormat(date), schedule)} className="text-s font-bold cursor-pointer hover:underline">{schedule.type}</div>
                                    <div className="text-s">{schedule.instructor}</div>
                                    <div className="text-s">{convertTimeFormat(schedule.time)}</div>
                                </div>
                            ))}
                            </div>
                        )}
                    </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default Revo;
