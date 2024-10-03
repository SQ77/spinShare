import { useState } from 'react';
import { createWorker } from 'tesseract.js';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';

const ImageUploader = ({ addClassAuto }) => {
  const navigate = useNavigate();
  const {userId} = useParams();
  const [image, setImage] = useState(null);
  const [ocrResult, setOcrResult] = useState('');
  const [loading, setLoading] = useState(false);

  // Handle image file change
  const handleChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  // Process the image with Tesseract.js
  const handleImageAnalysis = async () => {
    if (!image) return;

    setLoading(true);
    // Recognize the text
    const worker = await createWorker('eng');
    await worker.setParameters({
      tessedit_char_whitelist: '0123456789:/-&abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ ',
    });
    const { data: { text } } = await worker.recognize(image);

    // Set the recognized text
    setOcrResult(text);
    setLoading(false);
    if (!text.trim()) {
      toast.error("No classes detected in the image!");
      return;
    }
    extractDetails(text);

    // Terminate the worker
    await worker.terminate();
  };

  // Organises output from Tesseract into individual classes
  const extractDetails = (text) => {
    const lines = text.split('\n');
    const dayPrefixes = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const formattedEntries = [];
  
    let currentEntry = '';
  
    lines.forEach((line) => {
      const trimmedLine = line.trim();
  
      // Check if the line starts with a day prefix (indicating a new class)
      const isNewClass = dayPrefixes.some((prefix) => trimmedLine.startsWith(prefix));
  
      if (isNewClass) {
        if (currentEntry) {
          formattedEntries.push(currentEntry.trim());
        }
        // Start a new entry for the class
        currentEntry = trimmedLine;
      } else if (trimmedLine.match(/\d{1,2}:\d{2} (?:AM|PM)/)) {
        currentEntry += ` ${trimmedLine}`;
      }
    });
  
    // Push the last class entry if exists
    if (currentEntry) {
      formattedEntries.push(currentEntry.trim());
    }

    // Process the entries to remove unwanted words
    const cleanedEntries = formattedEntries.map(entry => {
        return entry
        .replace(/Rhythm/g, '')     
        .replace(/Cycling/g, '')    
        .replace(/Guest of/g, '')   
        .replace(/Enrolled/g, '')   
        .replace(/\s+/g, ' ')       // Replace multiple spaces with a single space
        .trim();                    
    });
  
    processClasses(cleanedEntries);
  };

  // Changes the date format to prepare for storage
  const formatDate = (dateStr) => {
    // Remove any day of the week and spaces
    const cleanDateStr = dateStr.replace(/[a-zA-Z]+|\s/g, '');

    // Split the date into day, month, and year parts
    const [day, month, year] = cleanDateStr.split('/').map(num => parseInt(num));

    // Adjust the year to full 4 digits
    const fullYear = year < 100 ? 2000 + year : year;

    // Return the date in "YYYY-MM-DD" format
    return `${fullYear.toString().padStart(4, '0')}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
  }

  // Changes the time format to prepare for storage
  const formatTime = (timeStr) => {
    // Create a new Date object using the time string
    const date = new Date(`1970-01-01 ${timeStr}`);

    // Extract hours and minutes in 24-hour format
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    // Return the formatted time in "HH:MM"
    return `${hours}:${minutes}`;
  }
  

  // Splits the cleaned data into the required fields
  const processClasses = (entries) => {
    const dataFields = entries.map(entry => {
        // Standard format
        const perfectFormatRegex = /^(.*?)\s*-\s*(\d+)\s+CYCLE\s+(-?[\w\s+:]+)\s+(\w+)\s+(\w+)\s+(\d{1,2}:\d{2} (?:AM|PM))\s*(.*)$/;
        const perfectMatch = entry.match(perfectFormatRegex);
        
        if (perfectMatch) {
            return {
                date: formatDate(perfectMatch[1].trim()),
                bike: perfectMatch[2].trim(),
                notes: "CYCLE " + perfectMatch[3].trim(),
                instructor: perfectMatch[4].trim(),
                location: perfectMatch[5].trim(),
                time: formatTime(perfectMatch[6].trim()),
                rider: '',
            };
        }

        // Handle edge case: two instructors, long class name
        // "Thu 30/5/24 - 1 CYCLE Duo 45: Gen X Oldies Jocelyn & MW 6:30 PM VS Gen Z Oldies Jelina"
        const edgeCase1Regex = /^(.*?)(?=-)- (\d{1,2}) (.*)\s(\w+)\s& (.*?)(?=\d)([\d:]+\s?[APM]*)\s(.*)\s(\w+)$/;
        const edgeCase1Match = entry.match(edgeCase1Regex);
        if (edgeCase1Match) {
            return {
                date: formatDate(edgeCase1Match[1].trim()),
                bike: edgeCase1Match[2].trim(),
                notes: edgeCase1Match[3].trim() + ' ' + edgeCase1Match[7].trim(), 
                instructor: edgeCase1Match[4].trim() + ' & ' + edgeCase1Match[8].trim(),     
                location: edgeCase1Match[5].trim(),       
                time: formatTime(edgeCase1Match[6].trim()),
                rider: '',
            };
        }

        // Handle edge case: one instructor, long class name
        // "Thu 30/5/24 - 1 CYCLE Theme 45: Gen X Oldies Jocelyn MW 6:30 PM VS Gen Z Oldies"
        const edgeCase2Regex = /^(.*?)(?=-)- (\d{1,2}) (.*)\s(\w+)\s([\d:]+\s?[APM]*)\s(.*)$/;        
        const edgeCase2Match = entry.match(edgeCase2Regex);
        if (edgeCase2Match) {
            const classNameAndInst = edgeCase2Match[3].trim().split(' ');
            const instName = classNameAndInst.pop();
            const classNamePart = classNameAndInst.join(' ');
            return {
                date: formatDate(edgeCase2Match[1].trim()),
                bike: edgeCase2Match[2].trim(),
                notes: classNamePart + ' ' + edgeCase2Match[6].trim(),
                instructor: instName,   
                location: edgeCase2Match[4].trim(), 
                time: formatTime(edgeCase2Match[5].trim()),
                rider: '',
            };
        }

        return null; // Regex doesn't match any case
    }).filter(Boolean); // Filter out null entries

    if (dataFields.length === 0) {
      toast.error("No classes detected in the image!");
      return;
    }
    
    dataFields.forEach(newClass => addClassAuto(newClass));
    toast.success("Classes added successfully");
    return navigate(`/classes/${userId}`);
  }
  

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Upload Class Booking Screenshot</h1>
      
      <input type="file" accept="image/*" onChange={handleChange} className="mb-4" />
      
      <button
        onClick={handleImageAnalysis}
        className="bg-blue-500 hover:bg-blue-700 text-black font-bold py-2 px-4 rounded mb-4"
      >
        {loading ? 'Processing...' : 'Submit'}
      </button>

      {image && <img src={image} alt="Schedule" className="w-auto h-auto mb-4 border-2" />}

    </div>
  );
};

export default ImageUploader;