import axios from "axios";
import { userActions } from "./user-slice";

export const getSignUp = (user) => async (dispatch) => {
  console.log(user);
  try {
    dispatch(userActions.getSignupRequest());

    const { data } = await axios.post("/api/v1/testing/user/signup", user);

    console.log(data.user);

    dispatch(userActions.getSignupDetails(data.user));
  } catch (error) {
    console.log(error);
    dispatch(userActions.getError(error.response.data.message));
  }
};

export const getLogIn = (user) => async (dispatch) => {
  try {
    dispatch(userActions.getLoginRequest());
    const { data } = await axios.post("/api/v1/testing/user/login", user);

    dispatch(userActions.getLoginDetails(data.user));
  } catch (error) {
    dispatch(userActions.getError(error.response.data.message));
  }
};

export const currentUser = () => async (dispatch) => {
  try {
    dispatch(userActions.getCurrentUserRequest());
    const { data } = await axios.get("/api/v1/testing/user/me");
    console.log(data.user);
    dispatch(userActions.getCurrentUser(data.user));
  } catch (error) {
    dispatch(userActions.getError(error.response.data.message));
  }
};

export const forgotPassword = (email) => async (dispatch) => {
  try {
    await axios.post("/api/v1/testing/user/forgotPassword", {
      email,
    });
  } catch (error) {
    dispatch(userActions.getError(error.response.data.message));
  }
};

export const resetPassword = (repassword, token) => async (dispatch) => {
  try {
    await axios.patch(
      `/api/v1/testing/user/resetPassword/${token}`,
      repassword
    );
  } catch (error) {
    dispatch(userActions.getError(error.response.data.message));
  }
};

export const Logout = () => async (dispatch) => {
  try {
    await axios.get("/api/v1/testing/user/logout");
    dispatch(userActions.getLogout(null));
  } catch (error) {
    dispatch(userActions.getError(error));
  }
};
