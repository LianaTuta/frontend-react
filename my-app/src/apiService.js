// apiService.js

const API_BASE_URL = "https://localhost:44304/api"; // Update with your backend URL

const apiService = {
  request: async (endpoint, method = "GET", data = null, headers = {}) => {
    const options = {
      method,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      body: data ? JSON.stringify(data) : null,
    };
    const token = localStorage.getItem("bearer");

    if (token) {
      options.headers["Authorization"] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/${endpoint}`, options);

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const contentType = response.headers.get("content-type");
      let responseBody = null;

      if (contentType && contentType.includes("application/json")) {
        responseBody = await response.json();
      }

      return { status: response.status, body: responseBody };
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  },

  post: (endpoint, data, headers) => {
    return apiService.request(endpoint, "POST", data, headers);
  },

  put: (endpoint, data, headers) => {
    return apiService.request(endpoint, "PUT", data, headers);
  },

  get: (endpoint, headers) => {
    return apiService.request(endpoint, "GET", null, headers);
  },

  delete: (endpoint, headers) => {
    return apiService.request(endpoint, "DELETE", null, headers);
  },

  setAuthToken: (token) => {
    if (token) {
      apiService.defaults.headers["Authorization"] = `Bearer ${token}`;
    } else {
      delete apiService.defaults.headers["Authorization"];
    }
  },
};

export default apiService;
