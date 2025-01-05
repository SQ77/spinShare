import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { db } from '../FirebaseConfig';
import { setDoc, doc } from 'firebase/firestore';

function CurrentUser({ auth, children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
            setUser(user);
            // Add new user to database
            const addUser = async () => {
              const userDocRef = doc(db, "users", user?.uid);
              await setDoc(userDocRef, {
                name: user?.displayName,
                email: user?.email,
                profilepic: user?.photoURL
              })
              return;
            }; 
            addUser();
        } else {
            setUser(null);
        }
    });

    return () => unsubscribe();
  }, []);

  return children(user);
}

export default CurrentUser;
