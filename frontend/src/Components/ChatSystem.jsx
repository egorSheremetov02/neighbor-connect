ChatSystem.jsx;

import React, { useState } from "react";
import Chat from "../Pages/Chat"; // Import the existing Chat component
import Neighbors from "./Neighbors"; // Import the neighbors component

const ChatSystem = () => {
  const [selectedChatId, setSelectedChatId] = useState(null); // Manage the selected chat

  const handleSelectChat = (chatId) => {
    setSelectedChatId(chatId);
  };

  return (
    <div style={styles.chatSystemContainer}>
      {/* Left Section: Neighbors */}
      <div style={styles.leftSection}>
        <Neighbors onSelectChat={handleSelectChat} />
      </div>

      {/* Right Section: Chat */}
      <div style={styles.rightSection}>
        {selectedChatId ? (
          <Chat chatId={selectedChatId} />
        ) : (
          <div style={styles.noChatSelected}>
            <h2>Select a neighbor to start chatting</h2>
          </div>
        )}
      </div>
    </div>
  );
};

// Styles for the ChatSystem layout
const styles = {
  chatSystemContainer: {
    display: "flex",
    height: "100vh",
    backgroundColor: "#f4f4f4",
  },
  leftSection: {
    width: "30%",
    borderRight: "1px solid #ccc",
    padding: "10px",
    backgroundColor: "#ffffff",
    overflowY: "auto", // Ensure scrollability if needed
  },
  rightSection: {
    width: "70%",
    padding: "20px",
    backgroundColor: "#f9f9f9",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  noChatSelected: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    color: "#555",
    textAlign: "center",
    height: "100%",
  },
};

export default ChatSystem;
