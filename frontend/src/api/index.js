import axiosInstance from "./axiosInstance";

// --- Authentication & Users ---
export const login = (email, password) => {
  return axiosInstance.post("/api/login", { email, password });
};

export const logoutUser = async () => {
  try {
    await axiosInstance.post("/api/logout");
  } catch (err) {
    console.error("Logout request error:", err);
  } finally {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  }
};

export const register = (userData) => {
  return axiosInstance.post("/api/createusers", userData);
};

export const getAllUsers = (params) => {
  return axiosInstance.get("/api/getallusers", { params });
};


export const updatePassword = (passwordData) => {
  return axiosInstance.post("/api/updatepassword", passwordData);
};

// --- Stores ---
export const createStore = (storeData) => {
  return axiosInstance.post("/api/createstore", storeData);
};


export const getStoresWithRatings = (params) => {
  return axiosInstance.get("/api/stores-with-ratings", { params });
};

export const getRatingsForStore = () => {
  return axiosInstance.post("/api/getratingsforstore");
};

// --- Ratings ---
export const submitRating = (ratingData) => {
  return axiosInstance.post("/api/createratings", ratingData);
};

// --- Dashboard ---
export const getAdminDashboard = () => {
  return axiosInstance.get("/api/admindashboard");
};
