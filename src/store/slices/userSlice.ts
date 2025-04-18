import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserModel } from '../../models/user';

export interface UserSliceModel {
  isLoggedIn: boolean;
  data: UserModel | null;
}

const initialState: UserSliceModel = {
  isLoggedIn: false,
  data: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    loginSuccess: (state, action: PayloadAction<UserModel>) => {
      state.isLoggedIn = true;
      state.data = action.payload;
    },
    clearUserData: (state) => {
      state.isLoggedIn = false;
      state.data = null;
    },
  },
});

export const { loginSuccess, clearUserData } = userSlice.actions;
export default userSlice.reducer;