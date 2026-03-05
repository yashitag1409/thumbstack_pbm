"use client";

import axios from "axios";
import { toast } from "sonner";
import { logout } from "../redux/slices/authSlice";
import { store } from "../redux/store";
import { BASE_URL, TEST_URL } from "../helper/BASE_URL";

// 🔥 Router bridge (no separate file)
let routerPush = null;

export const navigate = (path) => {
  if (routerPush) routerPush(path);
};

// Create Axios instance
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// REQUEST
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error),
);

// RESPONSE
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      toast.error("Network Error", {
        description: "Unable to reach the server.",
      });
      return Promise.reject(error);
    }

    const status = error.response.status;
    const msg = error.response.data?.message || "Something went wrong.";

    if (status === 401) {
      toast.error("Unauthorized", { description: msg });
      store.dispatch(logout());
    } else if (status === 403) {
      toast.error("Access Denied", { description: msg });
      store.dispatch(logout());

      // ⭐ Now this works because we registered the router
      navigate("/unauthorized");
    } else if (status === 404) {
      toast.error("Access Denied", { description: msg });
      store.dispatch(logout());

      // ⭐ Now this works because we registered the router
      navigate("/not-found");
    } else {
      toast.error(`Error ${status}`, { description: msg });
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
