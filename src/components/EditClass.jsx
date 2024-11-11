import {useParams} from 'react-router-dom';
import {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Spinners from './Spinners';
import { db } from '../FirebaseConfig';
import { getDoc, doc } from 'firebase/firestore';

const EditClass = ({updateClassSubmit}) => {
    const {classid, userid} = useParams();
    const [currClass, setCurrClass] = useState(null);
    const [selectedOption, setSelectedOption] = useState('');
    const [formData, setFormData] = useState({
        date: '',
        time: '',
        instructor: '',
        location: '',
        rider: '',
        bike: '',
        notes: ''
    });
    

    useEffect(() => {
        const classLoader = async (id) => {
            const classDoc = doc(db, "classes", id);
            const data = await getDoc(classDoc);
            //const res = await fetch(`/api/spinClasses/${id}`);
            //const data = await res.json();
            const filteredData = data.data();
            setCurrClass(filteredData);

            const dateString = filteredData.date.toDate().toDateString();
            const dateObject = new Date(dateString);
            const year = dateObject.getFullYear();
            const month = String(dateObject.getMonth() + 1).padStart(2, '0');
            const day = String(dateObject.getDate()).padStart(2, '0');
            const formattedDate = `${year}-${month}-${day}`;
            
            setFormData({
                id: id,
                date: formattedDate,
                time: filteredData.date.toDate().toLocaleTimeString(undefined, {hour12: false}),
                instructor: filteredData.instructor,
                location: filteredData.location,
                rider: filteredData.rider,
                bike: filteredData.bike,
                notes: filteredData.notes
            });
            setSelectedOption(filteredData.location);
        };
        classLoader(classid);
    }, [classid]);

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        updateClassSubmit(formData);
        toast.success("Class updated successfully");
        return navigate(`/schedule/${userid}`);
    };

    const handleSelectChange = (e) => {
        setSelectedOption(e.target.value);
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    if (!currClass) {
        return <Spinners loading={true} />;
    }

  return (
    <div className="container mx-auto mt-8 px-8 md:px-1 py-5">
            <h1 className="text-3xl font-bold mb-4 text-center">Edit Class</h1>
            <form onSubmit={handleSubmit} className="max-w-lg mx-auto">
                <div className="mb-4">
                    <label htmlFor="date" className="block text-sm font-semibold mb-1">Date</label>
                    <input type="date" id="date" name="date" value={formData.date} onChange={handleChange} className="border border-gray-400 px-4 py-2 rounded-md w-full" required/>
                </div>
                <div className="mb-4">
                    <label htmlFor="time" className="block text-sm font-semibold mb-1">Time</label>
                    <input type="time" id="time" name="time" value={formData.time} onChange={handleChange} className="border border-gray-400 px-4 py-2 rounded-md w-full" required/>
                </div>
                <div className="mb-4">
                    <label htmlFor="instructor" className="block text-sm font-semibold mb-1">Instructor</label>
                    <input type="text" maxLength={25} id="instructor" name="instructor" value={formData.instructor} onChange={handleChange} className="border border-gray-400 px-4 py-2 rounded-md w-full" required/>
                </div>
                <div className="mb-4">
                    <label htmlFor="location" className="block text-sm font-semibold mb-1">Location</label>
                    <select
                        id="location"
                        name="location"
                        className="border border-gray-400 px-4 py-2 rounded-md w-full"
                        value={selectedOption}
                        onChange={handleSelectChange}
                        required
                    >
                        <option value="">Select...</option>
                        <option value="Absolute-STV">Absolute-STV</option>
                        <option value="Absolute-CTP">Absolute-CTP</option>
                        <option value="Absolute-MW">Absolute-MW</option>
                        <option value="Absolute-RP">Absolute-RP</option>
                        <option value="Absolute-KTG">Absolute-KTG</option>
                        <option value="Ally">Ally</option>
                        <option value="Ground Zero">Ground Zero</option>
                        <option value="Rev-Orchard">Rev-Orchard</option>
                        <option value="Rev-TP">Rev-TP</option>
                        <option value="Rev-Bugis">Rev-Bugis</option>
                        <option value="XYCO">XYCO</option>
                        <option value="ELEV8">ELEV8</option>
                        <option value="Vertex">Vertex</option>
                        <option value="Vibe">Vibe</option>
                    </select>
                </div>
                <div className="mb-4">
                    <label htmlFor="rider" className="block text-sm font-semibold mb-1">Rider</label>
                    <input type="text" maxLength={25} id="rider" name="rider" value={formData.rider} onChange={handleChange} className="border border-gray-400 px-4 py-2 rounded-md w-full" required/>
                </div>
                <div className="mb-4">
                    <label htmlFor="bike" className="block text-sm font-semibold mb-1">Bike Number</label>
                    <input type="number" min="1" max="60" id="bike" name="bike" value={formData.bike} onChange={handleChange} className="border border-gray-400 px-4 py-2 rounded-md w-full" required/>
                </div>
                <div className="mb-4">
                    <label htmlFor="notes" className="block text-sm font-semibold mb-1">Notes</label>
                    <textarea maxLength={50} id="notes" name="notes" value={formData.notes} 
                        onChange={handleChange} rows="4" 
                        className="border border-gray-400 px-4 py-2 rounded-md w-full"
                        placeholder='Duration/type of class, etc'
                    ></textarea>
                </div>
                <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-black font-bold py-2 px-4 rounded">Update Class</button>
            </form>
        </div>
  )
}

export default EditClass
