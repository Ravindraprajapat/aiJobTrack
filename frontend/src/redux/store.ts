import { configureStore } from "@reduxjs/toolkit";
import userSlice from './userSlice'
import applicationReducer from './applicationSlice'

export const store = configureStore({
  reducer: {
    user:userSlice,
    application : applicationReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;