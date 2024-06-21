import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';

const AddClass = ({ addClassSubmit }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const pathname = location.pathname;
    const userId = pathname.substring(pathname.lastIndexOf('/') + 1);

    const rawDate = location.state?.date;
    let formattedDate = '';
    if (rawDate) {
        const day = rawDate.split('.')[0];
        const month = rawDate.split('.')[1];
        formattedDate = `2024-${month}-${day}`;
    } 

    const convertTime = (timeStr) => {
        const time = timeStr.slice(0, -2);
        const modifier = timeStr.slice(-2);
        let [hours, minutes] = time.split(':');
        if (hours === '12') {
           hours = '00';
        }
        if (modifier == 'AM') {
            hours = hours.padStart(2, '0');
        }
        if (modifier === 'PM') {
           hours = parseInt(hours, 10) + 12;
        }
        return `${hours}:${minutes}`;
    };

    let formattedTime = '';
    const rawTime = location.state?.time;
    if (rawTime) {
        formattedTime = convertTime(rawTime);
    }
 
    const [formData, setFormData] = useState({
        date: formattedDate,
        time: formattedTime,
        instructor: location.state?.instructor,
        location: location.state?.location,
        rider: '',
        bike: '',
        notes: location.state?.notes
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        addClassSubmit(formData);
  
        // Reset form fields after submission
        setFormData({
            date: '',
            time: '',
            instructor: '',
            location: '',
            rider: '',
            bike: '',
            notes: ''
        });
        toast.success("Class added successfully");
        return navigate(`/schedule/${userId}`);
    };

    const [selectedOption, setSelectedOption] = useState(location.state?.location);

    const handleSelectChange = (e) => {
        setSelectedOption(e.target.value);
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    return (
        <div className="container mx-auto mt-8 px-8 md:px-1 py-5">
            <h1 className="text-3xl font-bold mb-4 text-center">Add Class</h1>
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
                        <option value="Rev-Suntec">Rev-Suntec</option>
                        <option value="XYCO">XYCO</option>
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
                <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-black font-bold py-2 px-4 rounded">Add Class</button>
            </form>
        </div>
    );
}

export default AddClass;
