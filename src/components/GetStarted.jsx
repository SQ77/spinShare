import {NavLink} from 'react-router-dom';

const GetStarted = ({ to, children }) => {
    return (
        <div className="flex justify-center items-center py-5">
            <NavLink to={to} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                {children}
            </NavLink>
        </div>
    );
}

export default GetStarted;