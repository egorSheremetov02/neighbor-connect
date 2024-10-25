import React, { useContext, useEffect } from "react";
import { ChatContext } from "../utilities/ChatContext";

export default function ChatMessages({ chatContact }) {
  const { getMessagesFromReceiver } = useContext(ChatContext);

  const messages = getMessagesFromReceiver(chatContact);

  const styles = {
    message: {
      marginBottom: "10px",
      padding: "10px",
      backgroundColor: "#f1f1f1",
      borderRadius: "8px",
      boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
    },
    messageContainer: {
      flexGrow: 1,
      padding: "15px",
      overflowY: "auto",
      maxHeight: "calc(100dvh - 350px)",
      backgroundColor: "#fff",
    },
  };
  return (
    <div style={styles.messageContainer}>
      {messages.length > 0 ? (
        messages.map((message, index) => (
          <div key={message.created_at || index} style={styles.message}>
            <strong style={styles.messageAuthor}>{message.sender}:</strong>{" "}
            {message.content}
            <p className="text-sm text-slate-400">{message.timestamp}</p>
          </div>
        ))
      ) : (
        <div style={styles.noMessages}>
          {chatContact === "Anonymous"
            ? "Select contact to start the conversation"
            : "No messages yet. Start the conversation!"}
        </div>
      )}
    </div>
  );
}
