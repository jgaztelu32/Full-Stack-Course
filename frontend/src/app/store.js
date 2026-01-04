import { configureStore, createSlice } from '@reduxjs/toolkit';

const appSlice = createSlice({
  name: "My Full-Stack App",
  initialState: {},
  reducers: {},
});

export const store = configureStore({
  reducer: {
    app: appSlice.reducer,
  },
});
