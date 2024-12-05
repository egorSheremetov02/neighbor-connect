const API_BASE_URL = import.meta.env.VITE_BASE_URL_PROD;
const token = sessionStorage.getItem("TOKEN");

// Helper function for making fetch requests
const fetchRequest = async (url, method = "GET", body = null) => {
  console.log(token);
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
    console.error("Fetch request failed:", error.toString());
    throw error;
  }
};

// API call implementations
export const fetchNeighbors = (params) => {
  const query = new URLSearchParams(params).toString();
  return fetchRequest(`${API_BASE_URL}/users/users?${query}`);
};

export const fetchChatsIds = () => fetchRequest(`${API_BASE_URL}/chats`);

export const fetchChats = (id) => fetchRequest(`${API_BASE_URL}/chats/${id}`);

export const fetchMessages = (chatId) =>
  fetchRequest(`${API_BASE_URL}/chats/${chatId}/messages`);

export const sendMessage = (chatId, data) => {
  const payload = {
    "content": data,
  }
  fetchRequest(`${API_BASE_URL}/chats/${chatId}/messages`, "POST", payload);
};

export const createGroupChat = ({ id, name }) => {
  const userid = sessionStorage.getItem("myid");
  console.log(userid);
  const payload = {
    name: name,
    description: "new chat",
    tags: ["string"],
    users: [id, userid],
  };
  fetchRequest(`${API_BASE_URL}/chats/`, "POST", payload);
};
