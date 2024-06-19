import Home from "./components/pages/Home"
import ScheduleTable from "./components/ScheduleTable";
import ClassList from "./components/pages/ClassList";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AddClass from "./components/AddClass";
import EditClass from "./components/EditClass";
import Profile from "./components/Profile";
import AddFriends from "./components/AddFriends";
import Mail from "./components/Mail";
import Absolute from "./components/Absolute";
import NotFound from "./components/pages/NotFound";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { db, auth } from './FirebaseConfig';
import { collection, addDoc, deleteDoc, updateDoc, doc, Timestamp } from 'firebase/firestore';

const App = () => {
  const classesCollectionRef = collection(db, "classes");

  // Add new class
  const addClass = async (newClass) => {
    const dateString = newClass.date;
    const timeString = newClass.time;
    const [year, month, day] = dateString.split("-").map(Number);
    const [hours, minutes] = timeString.split(":").map(Number);
    const date = new Date(year, month - 1, day, hours, minutes);

    const res = await addDoc(classesCollectionRef, {
      date: Timestamp.fromDate(date),
      instructor: newClass.instructor,
      location: newClass.location,
      rider: newClass.rider,
      bike: newClass.bike,
      notes: newClass.notes,
      userId: auth?.currentUser?.uid
    })
    {/*
    const res = await fetch('/api/spinClasses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newClass)
    }); */}
    return;
  };

  // Delete class
  const deleteClass = async (id) => {
    const classDoc = doc(db, "classes", id)
    const res = await deleteDoc(classDoc);
    {/*
    const res = await fetch(`/api/spinClasses/${id}`, {
      method: 'DELETE',
    }); */}
    window.location.reload();
    return; 
  }

  // Update class
  const updateClass = async (updatedClass) => {
    const dateString = updatedClass.date;
    const timeString = updatedClass.time;
    const [year, month, day] = dateString.split("-").map(Number);
    const [hours, minutes] = timeString.split(":").map(Number);
    const date = new Date(year, month - 1, day, hours, minutes);

    const classDoc = doc(db, "classes", updatedClass.id);
    const res = await updateDoc(classDoc, {
      date: Timestamp.fromDate(date),
      instructor: updatedClass.instructor,
      location: updatedClass.location,
      rider: updatedClass.rider,
      bike: updatedClass.bike,
      notes: updatedClass.notes,
      userId: auth?.currentUser?.uid
    });
    {/*
    const res = await fetch(`/api/spinClasses/${updatedClass.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatedClass)
    }); */}
    return;
  }

  return (
    <>
      <Navbar />
      <ToastContainer />
      <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/schedule/:userId" element={<ScheduleTable />} />
          <Route path="/classes/:userId" element={<ClassList deleteClass={deleteClass}/>} />
          <Route path="/add-class/:id" element={<AddClass addClassSubmit={addClass}/>} />
          <Route path="/edit-class/:classid/:userid" element={<EditClass updateClassSubmit={updateClass}/>} />
          <Route path="/profile/:userId" element={<Profile />} />
          <Route path="/add-friends/:userId" element={<AddFriends />} />
          <Route path="/mail/:userId" element={<Mail />} />
          <Route path="/absolute/:location" element={<Absolute />} />
          <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
     
    </>
  );
};
export default App;