import { auth, googleProvider} from "../FirebaseConfig";
import { signInWithPopup, signOut } from "firebase/auth";
import { NavLink, useNavigate } from 'react-router-dom';
import { db } from '../FirebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';
import CurrentUser from "./CurrentUser";
import { RiErrorWarningFill } from "react-icons/ri";

export let unreadMessages = false;

const Auth = () => {
    const navigate = useNavigate();

    const signInWithGoogle = async () => {
        try {
            await signInWithPopup(auth, googleProvider);
            checkForRequests(auth?.currentUser?.uid);
        } catch (error) {
            console.error(error);
        } finally {
          return navigate(`/schedule/${auth?.currentUser?.uid}`);
        }
    }

    const signout = async () => {
        try {
            const confirm = window.confirm("Sign Out?");
            if (!confirm) return;
            await signOut(auth);
            // localStorage.clear(); // For testing purposes
        } catch (error) {
            console.error(error);
        } finally {
          return navigate('/');
        }
    }

    // Checks for any friend requests to the userId
    const checkForRequests = async (id) => {
        try {
            // Query friendRequests collection for documents where the user's ID appears in receiverId field
            const friendRequestQuery = query(
                collection(db, 'friendRequests'),
                where('receiverId', '==', id)  
            );
    
            const requestSnapshot = await getDocs(friendRequestQuery);
            const requests = requestSnapshot.docs.map(doc => doc.data());
            if (requests.length > 0) {
              unreadMessages = true;
            }
        } catch (error) {
            console.error('Error fetching requests list:', error);
        }
      
    };

  return (
    <div className="flex space-x-2">
      <CurrentUser auth={auth} >
        {(user) => (
          <>
          {!user && (
            <button onClick={signInWithGoogle} className="text-white bg-red-500 hover:bg-red-700 rounded-md px-3 py-2">Sign In With Google</button>
          )}
          {user && (
            <>
              <NavLink to={`/profile/${auth?.currentUser?.uid}`} className="hidden md:block text-black bg-gray-400 hover:bg-gray-500 rounded-md px-3 py-2">
                <div className="flex">
                  Welcome {user.displayName}
                  {unreadMessages && <RiErrorWarningFill className="l-1 w-5 h-5"/>}
                </div>
              </NavLink>
              <button onClick={signout} className="text-white bg-red-500 hover:bg-red-700 rounded-md mt-5 md:mt-0 px-3 py-2">Sign Out</button>
            </>
          )}
        </>)}
      </CurrentUser>
    </div>
  )
}

export default Auth
