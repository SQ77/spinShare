import { useState, useEffect } from 'react';
import { db } from '../FirebaseConfig';
import { getDoc, doc } from 'firebase/firestore';
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";

const Spin = ({ classInfo, userId }) => {
  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUserFromId = async () => {
      try {
        const data = await getDoc(doc(db, "users", userId));
        setUser(data.data());
      } catch (error) {
          console.log("Error fetching user data given ID", error);
      } finally {
        setLoading(false);
      }
    };

    getUserFromId();
  }, [userId]);

  const handleOpen = () => setOpen(!open);

  if (loading) {
    return <div>loading...</div>
  }

  return (
    <>
      <div className="relative">
        <div
          className= "bg-gray-200 p-1 rounded-md shadow-md w-30 border border-black relative text-center cursor-pointer hover:bg-gray-300"
          onClick={handleOpen}
        >
          <p className="text-lg text-black">{classInfo.date.toDate().toLocaleTimeString(undefined, {hour: 'numeric', minute: 'numeric'})}</p>
          <p className="text-lg text-black">{classInfo.instructor}</p>
          <p className="text-lg text-black">{classInfo.location}</p>
          <img
            src={user?.profilepic}
            className="w-8 h-8 rounded-full border-2 border-gray-300 mb-2 object-cover absolute top-0 right-0"
            alt="user"
          />
        </div>

      </div>

      <Dialog open={open} handler={handleOpen} size="xs">
      <DialogHeader className="ml-4 mt-2">{`${user?.name}'s Class`}</DialogHeader>
      <DialogBody className="text-black ml-4">
        <p><span className="font-bold">Date: </span> {classInfo.date.toDate().toDateString()}</p>
        <p><span className="font-bold">Time: </span> {classInfo.date.toDate().toLocaleTimeString(undefined, {hour: 'numeric', minute: 'numeric'})}</p>
        <p><span className="font-bold">Instructor: </span> {classInfo.instructor}</p>
        <p><span className="font-bold">Location: </span> {classInfo.location}</p>
        <p><span className="font-bold">Rider: </span> {classInfo.rider}</p>
        <p><span className="font-bold">Bike Number: </span> {classInfo.bike}</p>
      </DialogBody>
      <DialogFooter>
        <Button
          variant="gradient"
          color="red"
          onClick={handleOpen}
          className="mr-1"
        >
          <span>Close</span>
        </Button>
      </DialogFooter>
      </Dialog>
    </>
  );
};

export default Spin;
