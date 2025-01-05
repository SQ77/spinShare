import { useState } from 'react';
import { createWorker } from 'tesseract.js';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { IoAlertCircle } from "react-icons/io5";
import { Alert } from "@material-tailwind/react";

const ImageUploader = ({ addClassAuto, userId }) => {
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(true);

  // Handle image file change
  const handleChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
      setButtonDisabled(false);
    }
  };

  // Processes the image with Tesseract.js
  const handleImageAnalysis = async () => {
    if (!image) return;

    setLoading(true);
    // Recognize the text
    const worker = await createWorker('eng');
    await worker.setParameters({
      tessedit_char_whitelist: '0123456789:/-&+abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ ',
    });
    const jobObject = await worker.recognize(image, {layoutBlocks:true});

    setLoading(false);
    if (!jobObject.data.text.trim()) {
      toast.error("No classes detected in the image!");
      return;
    }

    processHOCR(jobObject.data.hocr);

    await worker.terminate();
  };

  // Main function to process the HOCR and store data
  const processHOCR = (hocrHTML) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(hocrHTML, 'text/html');

    // Data extraction
    const columnStarts = extractColumnStarts(doc);
    const words = extractWordsAndBoxes(doc);
    const columns = Array.from({ length: 5 }, () => []); 
    const classInfo = sortedClasses(columns, columnStarts, words, 4);

    if (classInfo.length === 0 || classInfo.every(arr => Array.isArray(arr) && arr.length === 0)) {
      toast.error("No classes detected in the image!");
      return;
    }

    // Data cleaning
    classInfo[0] = cleanDate(classInfo[0]);
    classInfo[1] = cleanSpot(classInfo[1]);
    classInfo[2] = cleanDescription(classInfo[2]);
    classInfo[3] = cleanInstructor(classInfo[3]);
    classInfo[4] = cleanLocation(classInfo[4]);

    // Data storage
    constructAndStoreClass(classInfo);
    toast.success(classInfo[0].length + " classes added successfully");
    return navigate(`/classes/${userId}`);
  }

  const constructAndStoreClass = (classDetails) => {
    for (let i = 0; i < classDetails[0].length; i++) {
      const dateAndTime = getDateAndTime(classDetails[0][i]);
      const newClass = {
        date: formatDate(dateAndTime[0]),
        bike: classDetails[1][i],
        notes: classDetails[2][i], 
        instructor: classDetails[3][i],    
        location: "Absolute-" + classDetails[4][i],       
        time: formatTime(dateAndTime[1]),
        rider: '',
        lastEdited: ''
      }
      addClassAuto(newClass);
    }
  }

  const getDateAndTime = (date) => {
    const dateTimeRegex = /(\w{3}\s*\d{1,2}\/\d{1,2}\/\d{1,2})\s*-*\s*(.*)/;
    const dateTimeMatch = date.trim().match(dateTimeRegex);
    return [dateTimeMatch[1].trim(), dateTimeMatch[2].trim()];
  }

  // Fills the column array that indicates starting pos of each column
  const extractColumnStarts = (doc) => {
    const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const threshold = 10;
    const wordElements = doc.querySelectorAll('.ocrx_word');
    let colStarts = [];

    // Fill in the array based on the bounding box positions
    let prevX1 = 0;
    let startFilling = false; // Flag to indicate when to start looking for columns

    for (const wordElement of wordElements) {
      // Stop when we've found 6 column starts
      if (colStarts.length >= 6) {
        break;
      }

      const wordText = wordElement.textContent.trim();
      const bboxData = wordElement.getAttribute('title').match(/bbox (\d+) (\d+) (\d+) (\d+)/);
      
      if (bboxData) {
        const [_, x0, y0, x1, y1] = bboxData.map(Number);

        // Start filling the array when we reach the first day of the week
        if (daysOfWeek.includes(wordText)) {
          startFilling = true; // Set the flag to true when the first day is encountered
        }

        if (startFilling) {
          if (x0 - prevX1 > threshold) {
            colStarts.push(x0);
          }
          prevX1 = x1; 
        }
      }
    }

    return colStarts;
  };

  // Returns a list of {word, startPos}
  const extractWordsAndBoxes = (doc) => {
    const words = [];
    const wordElements = doc.querySelectorAll('.ocrx_word');
    
    wordElements.forEach(wordElement => {
        const bboxData = wordElement.getAttribute('title').match(/bbox (\d+) (\d+) (\d+) (\d+)/);
        if (bboxData) {
            const [_, x0] = bboxData.map(Number);
            const wordText = wordElement.textContent.trim();
            words.push({ text: wordText, x0 });
        }
    });

    return words;
  };


  // Sorts words into columns
  const sortedClasses = (columns, colStarts, words, margin) => {
    words.forEach(word => {
      const { text, x0 } = word;
  
      // Check each column start point
      for (let i = 0; i < colStarts.length - 1; i++) {
          const colStart = colStarts[i];
          const colEnd = colStarts[i + 1];
  
          // Check if the word's x0 is within the range of the curr column
          if ((x0 >= (colStart - margin) && x0 <= (colStart + margin)) || (x0 > colStart && x0 < colEnd - margin)) {
              columns[i].push(text); 
          }
      }
    });
    return columns;
  }

  const cleanDate = (dates) => {
    const res = [];
    let firstClass = false;
    let temp = [];
    const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  
    for (const date of dates) {
      if (!firstClass && daysOfWeek.some(day => date.startsWith(day))) {
        firstClass = true;
      }
  
      if (firstClass) {
        if (daysOfWeek.some(day => date.startsWith(day))) {
          if (temp.length) {
            res.push(temp.join(' '));  
          }
          temp = [date];  
        } else {
          temp.push(date);  
        }
      }
    }
  
    if (temp.length) {
      res.push(temp.join(' '));
    }
  
    return res;
  };

  const cleanSpot = (spots) => {
    return spots.filter(spot => !isNaN(spot));
  }

  const cleanDescription = (description) => {
    const res = [];
    let firstClass = false;
    let temp = [];
    const ignore = ["EE", "LJ", "CE"];
    const classTypes = ["CYCLE", "PILATES"];
  
    for (const desc of description) {
      if (!firstClass && classTypes.includes(desc)) {
        firstClass = true;
      }
  
      if (firstClass) {
        if (classTypes.includes(desc)) {
          if (temp.length) {
            res.push(temp.join(' '));  
          }
          temp = [desc];  
        } else {
          temp.push(desc);  
        }
      }
    }
  
    if (temp.length) {
      if (ignore.includes(temp[temp.length - 1])) {
        temp.pop();
      }
      res.push(temp.join(' '));
    }
  
    return res;
  };

  const cleanInstructor = (instructors) => {
    const stack = [];
    let i = 0;

    while (i < instructors.length) {
        const instr = instructors[i];
        if (instr === 'Instructor' || (!isNaN(Number(instr)) && instr.trim() !== '')) {
          i += 1;
        } else if (instr === '&') {
          const firstInstr = stack.pop(); 
          const secondInstr = instructors[i + 1];
          stack.push(`${firstInstr} & ${secondInstr}`); 
          i += 2;
      } else {
          stack.push(instr);
          i += 1;
      }
    }
    // Handle edge case: Instructor name is two words
    const outputArray = [];
    for (let i = 0; i < stack.length; i++) {
        if (stack[i] === 'Si' && stack[i + 1] === 'Ling') {
            outputArray.push('Si Ling');
            i++; 
        } else {
            outputArray.push(stack[i]);
        }
    }

    return outputArray;
  }

  const cleanLocation = (locations) => {
    const validLocations = ["STV", "CTP", "MW", "RP", "KTG"];
    const res = locations.filter(location => validLocations.includes(location));
    return res; 
  }

  
  // Changes the date format to prepare for storage
  const formatDate = (dateStr) => {
    // Remove any day of the week and spaces
    const cleanDateStr = dateStr.replace(/[a-zA-Z]+|\s*/g, '');

    // Split the date into day, month, and year parts
    const [day, month, year] = cleanDateStr.split('/').map(num => parseInt(num));

    // Adjust the year to full 4 digits
    const fullYear = year < 100 ? 2000 + year : year;

    // Return the date in "YYYY-MM-DD" format
    return `${fullYear.toString().padStart(4, '0')}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
  }

  // Changes the time format to prepare for storage
  const formatTime = (timeStr) => {
    timeStr = timeStr.replace(/([0-9]{1,2}:[0-9]{2})(AM|PM)/, '$1 $2');
    // Create a new Date object using the time string
    const date = new Date(`1970-01-01 ${timeStr}`);

    // Extract hours and minutes in 24-hour format
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    // Return the formatted time in "HH:MM"
    return `${hours}:${minutes}`;
  }


  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Upload Class Booking Screenshot</h1>
      
      <div className="flex flex-col items-center mb-4">
        <input
          type="file"
          accept="image/*"
          onChange={handleChange}
          className="mb-4"
        />

        {!buttonDisabled && <button
          onClick={handleImageAnalysis}
          className="bg-blue-500 hover:bg-blue-700 text-black font-bold py-2 px-4 rounded"
        >
          {loading ? 'Processing...' : 'Submit'}
        </button>}

        {buttonDisabled && <button disabled className="flex items-center border border-gray-500 bg-white text-gray-500 font-semibold py-2 px-4 rounded">
            Submit
        </button>}
      </div>

      <div className="flex w-full flex-col gap-2 mb-4">
        <Alert variant="ghost" icon={<IoAlertCircle className="w-8 h-8"/>}>
          <p>
            Only screenshots of spin class bookings at Absolute are supported
          </p>
        </Alert>
      </div>

      {image && (
        <div className="flex justify-center mb-4">
          <img src={image} alt="Schedule" className="w-auto h-auto border-2" />
        </div>
      )}
    </div>
  );
};

export default ImageUploader;