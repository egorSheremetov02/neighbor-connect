// ChatContext.js
import React, { createContext, useState } from 'react';
import { v4 as uuidv4 } from 'uuid'; // For generating unique IDs

// Create the ChatContext
export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  // Load initial messages from localStorage
  const [messages, setMessages] = useState(() => {
    const savedMessages = localStorage.getItem('chatMessages');
    return savedMessages ? JSON.parse(savedMessages) : [];
  });

  // Function to add a new message
  const addMessage = ({ sender, receiver, content }) => {
    const newMessage = {
      id: uuidv4(), // Generate a unique ID for the message
      sender,
      receiver,
      content,
      timestamp: new Date().toLocaleString(),
    };

    // Use functional form of setMessages to make sure we always have the latest state
    setMessages(prevMessages => {
      const updatedMessages = [...prevMessages, newMessage];
      localStorage.setItem('chatMessages', JSON.stringify(updatedMessages));
      return updatedMessages;
    });
  };

  // Function to retrieve all messages
  const getMessages = () => {
    return messages;
  };

  // Function to retrieve all message from a particular receiver
  const getMessagesFromReceiver = (receiver) => {
    return messages.filter((message) => message.receiver === receiver);
  }

  // Clear messages if needed (optional)
  const clearMessages = () => {
    setMessages([]);
    localStorage.removeItem('chatMessages');
  };

  return (
    <ChatContext.Provider value={{ messages, addMessage, getMessages, getMessagesFromReceiver, clearMessages }}>
      {children}
    </ChatContext.Provider>
  );
};
