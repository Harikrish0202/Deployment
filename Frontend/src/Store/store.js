import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./User/user-slice";

const store = configureStore({
  reducer: { users: userSlice.reducer },
});

export default store;
