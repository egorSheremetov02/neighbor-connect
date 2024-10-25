import React, { useState, useEffect, useContext } from "react";
import { ChatContext } from "../utilities/ChatContext";
import { fabClasses } from "@mui/material";
import ChatMessages from "../Components/ChatMessages";
import ChatContact from "../Components/ChatContact";

const Chat = ({ chatId }) => {
  const [message, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [chatData, setChatData] = useState(null);
  const { addMessage, getMessages } = useContext(ChatContext);
  const [chatInfo, setChatInfo] = useState([]
  );
  const [chatContact, setChatContact] = useState("Anonymous");
  const [loading, setLoading] = useState(true);
  const [messageLoading, setMessageLoading] = useState(false);
  const [error, setError] = useState(null);

  const contacts = [ "Jerry", "Jones", "Bertha" ];

  useEffect(() => {
    if (chatId) {
      setLoading(true);
      setError(null);

      const fetchChatData = async () => {
        try {
          const response = await fetch(
            `http://localhost:8080/chats/${chatId}`,
            {
              headers: {
                Authorization: `Bearer ${sessionStorage
                  .getItem("TOKEN")
                  .substring(1, sessionStorage.getItem("TOKEN").length - 1)}`,
              },
            }
          );
          if (!response.ok) {
            throw new Error("Failed to fetch chat data");
          }
          const data = await response.json();
          setChatData(data);
        } catch (error) {
          console.error("Error fetching chat data:", error);
          setError("Failed to fetch chat data");
        }
      };

      const fetchMessages = async () => {
        try {
          const response = await fetch(
            `http://localhost:8080/chats/${chatId}/messages`,
            {
              headers: {
                Authorization: `Bearer ${sessionStorage
                  .getItem("TOKEN")
                  .substring(1, sessionStorage.getItem("TOKEN").length - 1)}`,
              },
            }
          );
          if (!response.ok) {
            throw new Error("Failed to fetch messages");
          }
          const data = await response.json();
          setMessages(data.messages || []);
        } catch (error) {
          console.error("Error fetching messages:", error);
          setError("Failed to fetch messages");
        } finally {
          setLoading(false);
        }
      };

      fetchChatData();
      fetchMessages();
    } else {
      setLoading(false);
    }
    setChatInfo(getMessages)
  }, [chatId]);

  const selectChatContact = (contact) => {
    setChatContact(contact);
  }

  // const sendMessage = async (e) => {
  //   e.preventDefault();
  //   if (!chatId || !newMessage.trim()) return;

  //   try {
  //     const response = await fetch(`http://localhost:8080/chats/${chatId}/messages`, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         'Authorization': `Bearer ${sessionStorage.getItem('TOKEN').substring(1, sessionStorage.getItem('TOKEN').length - 1)}`
  //       },
  //       body: JSON.stringify({ content: newMessage })
  //     });
  //     if (!response.ok) {
  //       throw new Error('Failed to send message');
  //     }
  //     setNewMessage('');

  //     // Refresh messages
  //     const updatedResponse = await fetch(`http://localhost:8080/chats/${chatId}/messages`, {
  //       headers: {
  //         'Authorization': `Bearer ${sessionStorage.getItem('TOKEN').substring(1, sessionStorage.getItem('TOKEN').length - 1)}`
  //       }
  //     });
  //     const data = await updatedResponse.json();
  //     setMessages(data.messages || []);
  //   } catch (error) {
  //     console.error('Error sending message:', error);
  //     setError('Failed to send message');
  //   }
  // };

  // On Submit Action
  const handleSubmit = async (e) => {
    setMessageLoading(true)
    e.preventDefault();
    if (!newMessage.trim()) return;
    addMessage({ sender: "me", receiver: chatContact, content: newMessage });
    setNewMessage('')
    setMessageLoading(false);
  };

  if (loading) {
    return <div style={styles.loading}>Loading chat data...</div>;
  }

  if (error) {
    return <div style={styles.error}>{error}</div>;
  }

  return (
    <div style={styles.chatContainer}>
      {/* Chat Header */}
      <header style={styles.chatHeader}>
        <h2 style={styles.chatTitle}>
          {chatData
            ? chatData.users_infos.length === 2
              ? `Chat with ${
                  chatData.users_infos.find(
                    (user) =>
                      user.id !== parseInt(localStorage.getItem("userId"))
                  ).name
                }`
              : chatData.name
            : "Select a chat"}
        </h2>
      </header>

      {/* Chat Contacts and Messages */}
      <div className=" xl:flex ">
        <ChatContact contacts={contacts} selectedChatContact={chatContact} selectChatContact={selectChatContact} />
        <ChatMessages chatContact={chatContact} />
      </div>

      {/* Chat Form */}
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          style={styles.input}
        />
        <button disabled={messageLoading} type="submit" style={styles.sendButton}>
          {messageLoading ? "Sending" : "Send"}
        </button>
      </form>
    </div>
  );
};

// Keep the existing styles and add:
const styles = {
  chatContainer: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    backgroundColor: "#f9f9f9",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  },
  chatHeader: {
    padding: "15px",
    borderBottom: "1px solid #ddd",
    backgroundColor: "#fff",
    borderRadius: "8px 8px 0 0",
  },
  chatTitle: {
    margin: 0,
    fontSize: "22px",
    color: "#333",
  },
  messageContainer: {
    flexGrow: 1,
    padding: "15px",
    overflowY: "auto",
    backgroundColor: "#fff",
  },
  message: {
    marginBottom: "10px",
    padding: "10px",
    backgroundColor: "#f1f1f1",
    borderRadius: "8px",
    boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
  },
  messageAuthor: {
    fontWeight: "bold",
    marginRight: "5px",
    color: "#007bff",
  },
  form: {
    display: "flex",
    padding: "10px 15px",
    backgroundColor: "#f9f9f9",
    borderTop: "1px solid #ddd",
    borderRadius: "0 0 8px 8px",
  },
  input: {
    flexGrow: 1,
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    outline: "none",
    marginRight: "10px",
    fontSize: "16px",
  },
  sendButton: {
    padding: "10px 15px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "16px",
  },
  loading: {
    textAlign: "center",
    padding: "50px",
    fontSize: "18px",
    color: "#333",
  },
  error: {
    textAlign: "center",
    padding: "50px",
    fontSize: "18px",
    color: "red",
  },
  noMessages: {
    textAlign: "center",
    padding: "20px",
    color: "#666",
  },
};

export default Chat;
