import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
    return (
    <nav style={{ padding: "1rem", backgroundColor: "#f8f9fa" }}>
        <Link to="/" style={{ marginRight: "1rem" }}>
        Home
        </Link>
        <Link to="/admin" style={{ marginRight: "1rem" }}>
        Admin Portal
        </Link>
        <Link to="/user">User Portal</Link>
    </nav>
    );
};

export default Navbar;
