

const API_BASE_URL = "https://ticket-service-767515572560.europe-north2.run.app/api"; 

const apiService = {
  request: async (endpoint, method = "GET", data = null, headers = {}) => {
    const options = {
      method,
      headers: {
        ...headers,
      },
      body: null,
    };
  
    if (data instanceof FormData) {
      options.body = data;
    } else if (data) {
      options.headers["Content-Type"] = "application/json";
      options.body = JSON.stringify(data);
    }
  
    const token = localStorage.getItem("bearer");
    if (token) {
      options.headers["Authorization"] = `Bearer ${token.trim()}`;
    }
  
    try {
      const response = await fetch(`${API_BASE_URL}/${endpoint}`, options);

      if (!response.ok) {
        var body = await response.json();
        return { status: response.status, body: body };
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
