import React, { useEffect, useState } from "react";
import "../Css/ForgotPassword.css"; // Import CSS file for styling
import { useDispatch, useSelector } from "react-redux";
import { forgotPassword } from "../Store/User/user-action";
import { userActions } from "../Store/User/user-slice";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const { errors } = useSelector((state) => state.users);
  const dispatch = useDispatch();
  const handleSubmit = (event) => {
    event.preventDefault();
    dispatch(forgotPassword(email));
    alert("Requset has been send in your email");
  };

  useEffect(() => {
    if (errors && errors.length !== 0) {
      alert(errors);
      dispatch(userActions.clearError());
    }
  }, [errors]);

  return (
    <div className="forgot-password-container">
      <h2>Forgot Password</h2>
      <form className="forgot-password-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
        </div>
        <div className="form-group">
          <button type="submit">Submit</button>
        </div>
      </form>
    </div>
  );
};

export default ForgotPassword;
