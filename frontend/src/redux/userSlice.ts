import { createSlice } from "@reduxjs/toolkit";
import type {PayloadAction} from "@reduxjs/toolkit";


interface User {
  _id: string;
  name: string;
  email: string;
}

interface UserState {
  userData: User | null;
  currentCity: string | null;
}

const initialState: UserState = {
  userData: null,
  currentCity: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserData: (state, action: PayloadAction<User | null>) => {
      state.userData = action.payload;
    },
  },
});

export const { setUserData } = userSlice.actions;
export default userSlice.reducer;