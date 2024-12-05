import React, { useState, useEffect, useContext } from "react";
// import { ChatContext } from "../utilities/ChatContext";
import {
  fetchNeighbors,
  fetchChats,
  fetchMessages,
  sendMessage,
  createGroupChat,
} from "../assets/APIs";

const Chat = () => {
  const [chats, setChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [neighbors, setNeighbors] = useState([]);
  const [showNeighbors, setShowNeighbors] = useState(false);
  const [error, setError] = useState(null);

  // const {
  //   sendMessage,
  //   fetchChats,
  //   fetchMessages,
  //   fetchNeighbors,
  //   createGroupChat,
  // } = useContext(ChatContext);

  // Fetch user's chats
  useEffect(() => {
    const loadChats = async () => {
      try {
        const data = await fetchChats();
        setChats(data);
      } catch (err) {
        setError("Failed to fetch chats");
      }
    };
    loadChats();
  }, []);

  // Fetch chat messages when a chat is selected
  useEffect(() => {
    if (currentChat) {
      const loadMessages = async () => {
        try {
          const data = await fetchMessages(currentChat.id);
          setMessages(data);
        } catch (err) {
          setError("Failed to load messages");
        }
      };
      loadMessages();
    }
  }, [currentChat]);

  // Fetch neighbors
  const loadNeighbors = async () => {
    try {
      const data = await fetchNeighbors();
      // console.log(data);
      setNeighbors(data.users_info);
      setShowNeighbors(true);
    } catch (err) {
      setError("Failed to fetch neighbors");
    }
  };

  // Handle sending a message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentChat) return;
    try {
      await sendMessage(currentChat.id, newMessage);
      setMessages((prev) => [...prev, { content: newMessage, sender: "You" }]);
      setNewMessage("");
    } catch (err) {
      setError("Failed to send message");
    }
  };

  // Handle creating a group chat
  const handleCreateChat = async (neighborId) => {
    try {
      const newChat = await createGroupChat(neighborId);
      setChats((prev) => [...prev, newChat]);
      setShowNeighbors(false);
    } catch (err) {
      setError("Failed to create chat");
    }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h2>My Chats</h2>
        {chats.length === 0 && (
          <p style={styles.noChats}>You don't have any group chats.</p>
        )}
      </header>

      <div style={styles.content}>
        <div style={styles.chatList}>
          {chats.map((chat) => (
            <div
              key={chat.id}
              style={styles.chatItem}
              onClick={() => setCurrentChat(chat)}
            >
              {chat.name}
            </div>
          ))}
          <button style={styles.button} onClick={loadNeighbors}>
            Create Group Chat
          </button>
        </div>

        <div style={styles.chatWindow}>
          {currentChat ? (
            <>
              <header style={styles.chatHeader}>{currentChat.name}</header>
              <div style={styles.messages}>
                {messages.map((msg, idx) => (
                  <div key={idx} style={styles.message}>
                    <strong>{msg.sender}: </strong>
                    {msg.content}
                  </div>
                ))}
              </div>
              <form onSubmit={handleSendMessage} style={styles.form}>
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  style={styles.input}
                />
                <button type="submit" style={styles.sendButton}>
                  Send
                </button>
              </form>
            </>
          ) : (
            <p style={styles.noSelection}>Select a chat to view messages</p>
          )}
        </div>
      </div>

      {showNeighbors && (
        <div style={styles.neighbors}>
          <h3>Select a Neighbor</h3>
          {neighbors?.map((neighbor) => (
            <div
              key={neighbor.id}
              style={styles.neighborItem}
              onClick={() => handleCreateChat(neighbor.id)}
            >
              {neighbor.name}
            </div>
          ))}
          <button onClick={() => setShowNeighbors(false)} style={styles.button}>
            Close
          </button>
        </div>
      )}

      {error && <p style={styles.error}>{error}</p>}
    </div>
  );
};

const styles = {
  container: { padding: "20px", fontFamily: "Arial, sans-serif" },
  header: { marginBottom: "10px" },
  content: { display: "flex", gap: "20px" },
  chatList: { width: "30%", borderRight: "1px solid #ccc", padding: "10px" },
  chatWindow: { flex: 1, display: "flex", flexDirection: "column" },
  chatItem: {
    padding: "10px",
    cursor: "pointer",
    borderBottom: "1px solid #ccc",
  },
  chatHeader: { fontWeight: "bold", marginBottom: "10px" },
  messages: { flex: 1, overflowY: "auto", marginBottom: "10px" },
  message: { marginBottom: "5px" },
  form: { display: "flex", gap: "10px" },
  input: { flex: 1, padding: "10px" },
  sendButton: { padding: "10px" },
  button: { marginTop: "10px", padding: "10px" },
  noChats: { color: "#777" },
  noSelection: { color: "#777", marginTop: "20px" },
  neighbors: {
    position: "absolute",
    top: "50px",
    right: "50px",
    background: "#fff",
    padding: "20px",
    border: "1px solid #ccc",
  },
  neighborItem: {
    padding: "10px",
    cursor: "pointer",
    borderBottom: "1px solid #ccc",
  },
  error: { color: "red", marginTop: "10px" },
};

export default Chat;
