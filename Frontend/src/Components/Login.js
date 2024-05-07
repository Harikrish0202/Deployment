import React, { useEffect, useState } from "react";
import "../Css/Login.css"; // Import CSS file for styling
import { Link, useNavigate } from "react-router-dom";
import { getLogIn } from "../Store/User/user-action";
import { useDispatch, useSelector } from "react-redux";
import { userActions } from "../Store/User/user-slice";

const Login = () => {
  const navigate = useNavigate();
  const { isAuthenticated, errors } = useSelector((state) => state.users);
  console.log(errors);
  const dispatch = useDispatch();
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const { email, password } = user;

  const submit = (e) => {
    e.preventDefault();
    dispatch(getLogIn(user));
  };

  useEffect(() => {
    if (errors && errors.length > 0) {
      alert(errors);
      dispatch(userActions.clearError());
    } else if (isAuthenticated) {
      navigate("/");
      alert("User has logged suceesfully");
    }
  }, [isAuthenticated, errors, dispatch, navigate]);

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form className="login-form">
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
            placeholder="Enter your email"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setUser({ ...user, password: e.target.value })}
            placeholder="Enter your password"
            required
          />
        </div>
        <div className="form-group">
          <button type="submit" onClick={submit}>
            Login
          </button>
        </div>
        <div className="form-links">
          <Link to="/forgotpassword">Forgot Password?</Link>
          <span>|</span>
          <Link to="/signup"> Sign Up</Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
