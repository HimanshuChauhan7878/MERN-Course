const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";

// Helper function to get auth token
const getToken = () => localStorage.getItem("token");

// Helper function for API calls
const apiCall = async (endpoint, options = {}) => {
  const token = getToken();
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Request failed");
    }

    return data;
  } catch (error) {
    throw error;
  }
};

// Auth APIs
export const authAPI = {
  register: (userData) =>
    apiCall("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    }),
  login: (email, password) =>
    apiCall("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),
};

// Violation APIs
export const violationAPI = {
  create: (violationData) =>
    apiCall("/violations", {
      method: "POST",
      body: JSON.stringify(violationData),
    }),
};

// Challan APIs
export const challanAPI = {
  getMyChallans: () => apiCall("/challans/my-challans"),
  getAllChallans: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiCall(`/challans?${query}`);
  },
  getChallanById: (id) => apiCall(`/challans/${id}`),
  getChallanByVehicle: (vehicleNumber) =>
    apiCall(`/challans/vehicle/${vehicleNumber}`),
  updateStatus: (id, status) =>
    apiCall(`/challans/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),
};

// Analytics APIs
export const analyticsAPI = {
  getDashboardStats: () => apiCall("/analytics/dashboard"),
  getHeatmapData: () => apiCall("/analytics/heatmap"),
};

// Payment APIs
export const paymentAPI = {
  create: (challanId) =>
    apiCall("/payments", {
      method: "POST",
      body: JSON.stringify({ challanId }),
    }),
  getHistory: () => apiCall("/payments/history"),
};

// Admin APIs
export const adminAPI = {
  createChallan: (challanData) =>
    apiCall("/admin/challans", {
      method: "POST",
      body: JSON.stringify(challanData),
    }),
  getAllUsers: (search = "") =>
    apiCall(`/admin/users${search ? `?search=${search}` : ""}`),
  searchVehicle: (vehicleNumber) =>
    apiCall(`/admin/vehicles/search?vehicleNumber=${vehicleNumber}`),
};
