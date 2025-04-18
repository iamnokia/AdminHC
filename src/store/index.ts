import { configureStore, combineReducers } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import type { UserSliceModel } from './slices/userSlice'; // Make sure to export this type from userSlice

const rootReducer = combineReducers({
  user: userReducer,
});

export type RootState = {
  user: UserSliceModel;
};

const store = configureStore({
  reducer: rootReducer,
});

export type AppDispatch = typeof store.dispatch;
export default store;