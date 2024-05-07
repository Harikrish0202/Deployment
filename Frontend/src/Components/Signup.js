import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "../Css/Signup.css"; // Import CSS file for styling
import { getSignUp } from "../Store/User/user-action";
import { userActions } from "../Store/User/user-slice";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, errors } = useSelector((state) => state.users);
  console.log(isAuthenticated, errors);
  // State variables to store form input values
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  // Function to handle form submission
  const handleSubmit = (event) => {
    event.preventDefault();
    if (password !== passwordConfirm) {
      return alert("password does not matched");
    }
    dispatch(
      getSignUp({
        name,
        email,
        password,
        passwordConfirm,
      })
    );
  };

  useEffect(() => {
    if (errors && errors.length > 0) {
      alert("Signup failed");
      dispatch(userActions.clearError());
    } else if (isAuthenticated) {
      navigate("/");
      alert("User has logged suceesfully");
    }
  }, [errors, isAuthenticated, dispatch]);

  return (
    <div className="signup-container">
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit} className="signup-form">
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password:</label>
          <input
            type="password"
            id="confirmPassword"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            required
          />
        </div>
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default Signup;
