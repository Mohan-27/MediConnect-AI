import { createSlice } from "@reduxjs/toolkit";

const getStoredAuth = () => {
  const localToken = localStorage.getItem("token");
  const sessionToken = sessionStorage.getItem("token");

  const token = localToken || sessionToken;

  const localUser = localStorage.getItem("user");
  const sessionUser = sessionStorage.getItem("user");

  const userData = localUser || sessionUser;

  let user = null;

  try {
    user = userData ? JSON.parse(userData) : null;
  } catch {
    user = null;
  }

  return {
    token,
    user,
    isAuthenticated: Boolean(token && user),
  };
};

const storedAuth = getStoredAuth();

const initialState = {
  token: storedAuth.token,
  user: storedAuth.user,
  isAuthenticated: storedAuth.isAuthenticated,
};

const authSlice = createSlice({
  name: "auth",

  initialState,

  reducers: {
    setCredentials: (state, action) => {
      const { token, user, rememberMe } = action.payload;

      state.token = token;
      state.user = user;
      state.isAuthenticated = true;

      const storage = rememberMe
        ? localStorage
        : sessionStorage;

      storage.setItem("token", token);
      storage.setItem("user", JSON.stringify(user));
    },

    logout: (state) => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      sessionStorage.removeItem("token");
      sessionStorage.removeItem("user");

      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;

export default authSlice.reducer;