import { useEffect, useState } from "react";
import { db, auth } from "../FirebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Spinners from "./Spinners";

const Ally = () => {
    const [schedules, setSchedules] = useState([]);
    const [expandedRows, setExpandedRows] = useState(Array(7).fill(false));
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();
    const allyCollectionRef = collection(db, "ally");

    useEffect(() => {
        const getClasses = async () => {
            try {
                const data = await getDocs(allyCollectionRef);
                const filteredData = data.docs.map((doc) => ({
                    ...doc.data(),
                    id: doc.id,
                }));
                setSchedules(filteredData);
            } catch {
                toast.error("Error occured when fetching Ally class data!");
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

    // Convert time to a comparable value
    const timeToNumber = (time) => {
        const [hour, minutePart] = time.split(":");
        const minute = minutePart.slice(0, 2);
        const period = minutePart.slice(2);
        let hourNumber = parseInt(hour);
        if (period.toUpperCase() === "PM" && hourNumber !== 12) {
            hourNumber += 12;
        }
        if (period.toUpperCase() === "AM" && hourNumber === 12) {
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
        const [dayA, monthA] = a.split(".");
        const [dayB, monthB] = b.split(".");
        if (monthA > monthB) return 1;
        if (monthA < monthB) return -1;
        return dayA - dayB;
    });

    const enroll = (date, classDetails) => {
        if (!auth.currentUser) {
            toast.error("Sign in to add this class to your schedule");
            return;
        }
        const confirm = window.confirm("Add this class to your schedule?");
        if (!confirm) return;
        return navigate(`/add-class/${auth?.currentUser?.uid}`, {
            state: {
                instructor: classDetails.instructor,
                notes: classDetails.type,
                location: "Ally",
                date: date,
                time: classDetails.time,
                from: "ally",
            },
        });
    };

    const formatTime = (time) => {
        // Adds a space before "PM" or "AM"
        return time.replace(/([AP]M)$/, " $1");
    };

    // Returns the day of the week in short form
    const getDayOfWeek = (dateStr) => {
        const currentYear = new Date().getFullYear();

        const [day, month] = dateStr.split(".").map(Number);
        const date = new Date(currentYear, month - 1, day);

        const dayOfWeek = date
            .toLocaleString("en-SG", { weekday: "short" })
            .toUpperCase();

        return dayOfWeek;
    };

    if (loading) {
        return <Spinners loading={true} />;
    }

    return (
        <>
            <h1 className="text-3xl font-bold mt-8 mb-4 text-center">
                Ally Schedule
            </h1>
            <div className="p-4 ml-5 mt-5 mb-5">
                <div className="hidden md:grid md:grid-cols-7 gap-7">
                    {sortedDates.map((date) => (
                        <div key={date} className="border p-5">
                            <div className="text-center font-bold md:font-normal">
                                {date} {getDayOfWeek(date)}
                            </div>
                            {groupedSchedules[date]
                                .sort(
                                    (a, b) =>
                                        timeToNumber(a.time) -
                                        timeToNumber(b.time)
                                )
                                .map((schedule, index) => (
                                    <div key={index} className="mt-5 mb-5">
                                        <div
                                            onClick={() =>
                                                enroll(date, schedule)
                                            }
                                            className="text-s font-bold cursor-pointer hover:underline"
                                        >
                                            {schedule.type}
                                        </div>
                                        <div className="text-s">
                                            {schedule.instructor}
                                        </div>
                                        <div className="text-s">
                                            {formatTime(schedule.time)}
                                        </div>
                                    </div>
                                ))}
                        </div>
                    ))}
                </div>

                <div className="md:hidden">
                    {sortedDates.map((date, index) => (
                        <div key={index} className="border mb-3">
                            <div
                                className="p-2 border text-center bg-gray-200 cursor-pointer h-auto"
                                onClick={() => toggleExpand(index)}
                            >
                                {date} {getDayOfWeek(date)}
                            </div>
                            {expandedRows[index] && (
                                <div>
                                    {groupedSchedules[date]
                                        .sort(
                                            (a, b) =>
                                                timeToNumber(a.time) -
                                                timeToNumber(b.time)
                                        )
                                        .map((schedule, index) => (
                                            <div
                                                key={index}
                                                className="ml-5 mt-5 mb-5"
                                            >
                                                <div
                                                    onClick={() =>
                                                        enroll(date, schedule)
                                                    }
                                                    className="text-s font-bold cursor-pointer hover:underline"
                                                >
                                                    {schedule.type}
                                                </div>
                                                <div className="text-s">
                                                    {schedule.instructor}
                                                </div>
                                                <div className="text-s">
                                                    {formatTime(schedule.time)}
                                                </div>
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

export default Ally;
