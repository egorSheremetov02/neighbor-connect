import React, { useState } from "react";
import "./Chatbot.css";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const token = sessionStorage.getItem("TOKEN");
  const API_KEY = "sk-proj-XXX-uyKyqkSQoqQA";

  if (!token) {
    return <Navigate to="/login" />;
  }

  const toggleChat = () => setIsOpen(!isOpen);

  const sendMessage = async () => {
    const userMessage = { text: input, sender: "user" };
    setMessages([...messages, userMessage]);

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: input,
          },
        ],
        temperature: 0.7,
      }),
    });
    const data = await response.json();
    // console.log(data);
    const dataContent = data?.choices[0]?.message?.content;
    // console.log(dataContent);
    const botMessage = { text: dataContent, sender: "bot" };
    setMessages([...messages, userMessage, botMessage]);

    messages.map((message) => console.log(message));

    setInput("");
  };

  return (
    <div className="chatbot">
      <div
        className={`chatbot-icon ${isOpen ? "open" : ""}`}
        onClick={toggleChat}
      >
        💬
      </div>

      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <h4>Chat with AI</h4>
            <button className="close-btn" onClick={toggleChat}>
              ✖
            </button>
          </div>

          <div className="chatbot-messages">
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.sender}`}>
                <p>{msg.text}</p>
              </div>
            ))}
          </div>

          <div className="chatbot-input">
            <input
              type="text"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
