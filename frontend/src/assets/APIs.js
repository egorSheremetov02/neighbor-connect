const API_BASE_URL = import.meta.env.VITE_BASE_URL_PROD;
const token = sessionStorage.getItem("TOKEN");

// Helper function for making fetch requests
const fetchRequest = async (url, method = "GET", body = null) => {
  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `bearer ${token.substring(1, token.length - 1)}`,
    },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url, options);
    // console.log(url, response);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Fetch request failed:", error);
    throw error;
  }
};

// API call implementations
export const fetchNeighbors = (params) => {
  const query = new URLSearchParams(params).toString();
  return fetchRequest(`${API_BASE_URL}/users/users?${query}`);
};

export const fetchChats = () => fetchRequest(`${API_BASE_URL}/chats/own`);

export const fetchMessages = (chatId) =>
  fetchRequest(`${API_BASE_URL}/chats/${chatId}`);

export const sendMessage = (chatId, data) =>
  fetchRequest(`${API_BASE_URL}/chats/${chatId}/messages`, "POST", data);

export const createGroupChat = (data) =>
  fetchRequest(`${API_BASE_URL}/chats/`, "POST", data);
