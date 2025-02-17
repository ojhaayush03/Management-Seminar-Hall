// import React from "react";
// import { Link } from "react-router-dom";

// const Navbar = () => {
//     return (
//     <nav style={{ padding: "1rem", backgroundColor: "#f8f9fa" }}>
//         <Link to="/" style={{ marginRight: "1rem" }}>
//         Home
//         </Link>
//         <Link to="/admin" style={{ marginRight: "1rem" }}>
//         Admin Portal
//         </Link>
//         <Link to="/user">User Portal</Link>
//     </nav>
//     );
// };

// export default Navbar;
import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo2.png"; // Adjust the path if needed
const Navbar = () => {
    return (
        <nav className="bg-white shadow-md p-4">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                <div className="flex space-x-4">
                    <Link to="/" className="text-gray-800 hover:text-indigo-600 transition-all">Home</Link>
                    <Link to="/admin" className="text-gray-800 hover:text-indigo-600 transition-all">Admin Portal</Link>
                    <Link to="/user" className="text-gray-800 hover:text-indigo-600 transition-all">User Portal</Link>
                </div>
                      {/* College Logo on the Top Right */}
                <div className="flex items-center">
                    <img src={logo} alt="College Logo" className="h-10 w-auto" />
                </div>
            </div>
        </nav>
    );
};

export default Navbar;