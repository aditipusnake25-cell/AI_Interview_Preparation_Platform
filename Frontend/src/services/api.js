const API_BASE_URL = import.meta.env.VITE_API_URL ??
  (import.meta.env.DEV ? "http://localhost:5000" : "");

const API_URL = `${API_BASE_URL}/api`;

const request = async (endpoint, options = {}) => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers
    }
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
};

const api = {
  register: (details) =>
    request("/auth/register", {
      method: "POST",
      body: JSON.stringify(details)
    }),

  login: (details) =>
    request("/auth/login", {
      method: "POST",
      body: JSON.stringify(details)
    }),

  getProfile: () => request("/auth/profile"),

  getInterviews: () => request("/interviews"),

  getInterview: (id) => request(`/interviews/${id}`),

  createInterview: (details) =>
    request("/interviews", {
      method: "POST",
      body: JSON.stringify(details)
    }),

  updateInterview: (id, details) =>
    request(`/interviews/${id}`, {
      method: "PATCH",
      body: JSON.stringify(details)
    }),

  deleteInterview: (id) =>
    request(`/interviews/${id}`, {
      method: "DELETE"
    }),

  generateQuestions: (details) =>
    request("/ai/generate-questions", {
      method: "POST",
      body: JSON.stringify(details)
    }),

  evaluateAnswer: (details) =>
    request("/ai/evaluate-answer", {
      method: "POST",
      body: JSON.stringify(details)
    })
};

export default api;