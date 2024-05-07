import React from "react";
import "../Css/Navbar.css"; // Import CSS file for styling
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Logout } from "../Store/User/user-action";

const Navbar = () => {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.users);
  console.log(user);

  const logout = () => {
    dispatch(Logout());
    alert("Logout succesfully");
  };
  return (
    <>
      <nav className="navbar">
        <ul className="nav-links">
          <li>
            <Link to="/">Home</Link>
          </li>
          {user ? (
            <li>
              <button onClick={logout}>Logout</button>
            </li>
          ) : (
            <li>
              <Link to="/login">Login</Link>
            </li>
          )}
        </ul>
      </nav>
      <h1>Welcome To My Page</h1>
      {!loading && user && (
        <>
          <h2>Name : {user.name}</h2>
          <h2>Email: {user.email}</h2>
        </>
      )}
    </>
  );
};

export default Navbar;
