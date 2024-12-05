// import React, { useState, useEffect, useContext } from "react";
// // import { ChatContext } from "../utilities/ChatContext";
// import {
//   fetchNeighbors,
//   fetchChats,
//   fetchMessages,
//   sendMessage,
//   createGroupChat,
//   fetchChatsIds,
// } from "../assets/APIs";

// const Chat = () => {
//   const [chats, setChats] = useState([]);
//   const [currentChat, setCurrentChat] = useState(null);
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState("");
//   const [neighbors, setNeighbors] = useState([]);
//   const [showNeighbors, setShowNeighbors] = useState(false);
//   const [error, setError] = useState(null);

//   const userid = sessionStorage.getItem("myid");

//   // const {
//   //   sendMessage,
//   //   fetchChats,
//   //   fetchMessages,
//   //   fetchNeighbors,
//   //   createGroupChat,
//   // } = useContext(ChatContext);

//   // Fetch user's chats
//   useEffect(() => {
//     const loadChats = async () => {
//       let chatList = [];
//       try {
//         const data = await fetchChatsIds();
//         for (const chatId of data.chats_ids.filter((id) => id !== 0)) {
//           const chatData = await fetchChats(chatId);
//           chatList.push(chatData);
//         }
//         setChats(chatList);
//       } catch (err) {
//         setError("Failed to fetch chats");
//       }
//     };
//     loadChats();
//   }, []);

//   // Fetch chat messages when a chat is selected
//   useEffect(() => {
//     if (currentChat) {
//       const loadMessages = async () => {
//         try {
//           const data = await fetchMessages(currentChat);
//           const messages = data.messages.map((message) => {
//             if (message.author_id == userid) {
//               message.author_name = "You";
//             }
//             return message;
//           });
//           setMessages(messages);
//         } catch (err) {
//           setError("Failed to load messages");
//         }
//       };
//       loadMessages();
//     }
//   }, [currentChat]);

//   // Fetch neighbors
//   const loadNeighbors = async () => {
//     try {
//       const data = await fetchNeighbors();
//       // console.log(data);
//       setNeighbors(data.users_info);
//       setShowNeighbors(true);
//     } catch (err) {
//       setError("Failed to fetch neighbors");
//     }
//   };

//   // Handle sending a message
//   const handleSendMessage = async (e) => {
//     e.preventDefault();
//     if (!newMessage.trim() || !currentChat) return;
//     try {
//       console.log(currentChat, newMessage);
//       await sendMessage(currentChat, newMessage);
//       setMessages((prev) => [...prev, { content: newMessage, author_name: "You" }]);
//       setNewMessage("");
//     } catch (err) {
//       setError("Failed to send message");
//     }
//   };

//   // Handle creating a group chat
//   const handleCreateChat = async ({neighborId, name}) => {
//     console.log(neighborId, name);
//     try {
//       const newChat = await createGroupChat({id: neighborId, name: name});
//       setChats((prev) => [...prev, newChat]);
//       setShowNeighbors(false);
//     } catch (err) {
//       setError("Failed to create chat");
//     }
//   };

//   return (
//     <div style={styles.container}>
//       <header style={styles.header}>
//         <h2>My Chats</h2>
//         {chats && (chats.length === 0) && (
//           <p style={styles.noChats}>You don't have any group chats.</p>
//         )}
//       </header>

//       <div style={styles.content}>
//         <div style={styles.chatList}>
//           {chats && chats.map((chat) => (
//             <div
//               key={chat.chat_id}
//               style={styles.chatItem}
//               onClick={() => setCurrentChat(chat.chat_id)}
//             >
//               {chat.name}
//             </div>
//           ))}
//           <button style={styles.button} onClick={loadNeighbors}>
//             Create Group Chat
//           </button>
//         </div>

//         <div style={styles.chatWindow}>
//           {currentChat ? (
//             <>
//               <header style={styles.chatHeader}>{currentChat.name}</header>
//               <div style={styles.messages}>
//                 {messages.map((msg, idx) => (
//                   <div key={idx} style={styles.message}>
//                     <strong>{msg.author_name}: </strong>
//                     {msg.content}
//                   </div>
//                 ))}
//               </div>
//               <form onSubmit={handleSendMessage} style={styles.form}>
//                 <input
//                   type="text"
//                   value={newMessage}
//                   onChange={(e) => setNewMessage(e.target.value)}
//                   placeholder="Type a message..."
//                   style={styles.input}
//                 />
//                 <button type="submit" style={styles.sendButton}>
//                   Send
//                 </button>
//               </form>
//             </>
//           ) : (
//             <p style={styles.noSelection}>Select a chat to view messages</p>
//           )}
//         </div>
//       </div>

//       {showNeighbors && (
//         <div style={styles.neighbors}>
//           <h3>Select a Neighbor</h3>
//           {neighbors?.map((neighbor) => (
//             <div
//               key={neighbor.id}
//               style={styles.neighborItem}
//               onClick={() => handleCreateChat({neighborId: neighbor.id, name: neighbor.name})}
//             >
//               {neighbor.name}
//             </div>
//           ))}
//           <button onClick={() => setShowNeighbors(false)} style={styles.button}>
//             Close
//           </button>
//         </div>
//       )}

//       {error && <p style={styles.error}>{error}</p>}
//     </div>
//   );
// };

// const styles = {
//   container: { padding: "20px", fontFamily: "Arial, sans-serif" },
//   header: { marginBottom: "10px" },
//   content: { display: "flex", gap: "20px" },
//   chatList: { width: "30%", borderRight: "1px solid #ccc", padding: "10px" },
//   chatWindow: { flex: 1, display: "flex", flexDirection: "column" },
//   chatItem: {
//     padding: "10px",
//     cursor: "pointer",
//     borderBottom: "1px solid #ccc",
//   },
//   chatHeader: { fontWeight: "bold", marginBottom: "10px" },
//   messages: { flex: 1, overflowY: "auto", marginBottom: "10px" },
//   message: { marginBottom: "5px" },
//   form: { display: "flex", gap: "10px" },
//   input: { flex: 1, padding: "10px" },
//   sendButton: { padding: "10px" },
//   button: { marginTop: "10px", padding: "10px" },
//   noChats: { color: "#777" },
//   noSelection: { color: "#777", marginTop: "20px" },
//   neighbors: {
//     position: "absolute",
//     top: "50px",
//     right: "50px",
//     background: "#fff",
//     padding: "20px",
//     border: "1px solid #ccc",
//   },
//   neighborItem: {
//     padding: "10px",
//     cursor: "pointer",
//     borderBottom: "1px solid #ccc",
//   },
//   error: { color: "red", marginTop: "10px" },
// };

// export default Chat;


import React, { useState, useEffect } from "react";
import {
  fetchNeighbors,
  fetchChats,
  fetchMessages,
  sendMessage,
  createGroupChat,
  fetchChatsIds,
} from "../assets/APIs";

const Chat = () => {
  const [chats, setChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [neighbors, setNeighbors] = useState([]);
  const [showNeighbors, setShowNeighbors] = useState(false);
  const [error, setError] = useState(null);

  const userid = sessionStorage.getItem("myid");

  useEffect(() => {
    const loadChats = async () => {
      let chatList = [];
      try {
        const data = await fetchChatsIds();
        for (const chatId of data.chats_ids.filter((id) => id !== 0)) {
          const chatData = await fetchChats(chatId);
          chatList.push(chatData);
        }
        setChats(chatList);
      } catch (err) {
        setError("Failed to fetch chats");
      }
    };
    loadChats();
  }, []);

  useEffect(() => {
    if (currentChat) {
      const loadMessages = async () => {
        try {
          const data = await fetchMessages(currentChat);
          const messages = data.messages.map((message) => {
            if (message.author_id == userid) {
              message.author_name = "You";
            }
            return message;
          });
          setMessages(messages);
        } catch (err) {
          setError("Failed to load messages");
        }
      };
      loadMessages();
    }
  }, [currentChat]);

  const loadNeighbors = async () => {
    try {
      const data = await fetchNeighbors();
      setNeighbors(data.users_info);
      setShowNeighbors(true);
    } catch (err) {
      setError("Failed to fetch neighbors");
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentChat) return;
    try {
      await sendMessage(currentChat, newMessage);
      setMessages((prev) => [...prev, { content: newMessage, author_name: "You" }]);
      setNewMessage("");
    } catch (err) {
      setError("Failed to send message");
    }
  };

  const handleCreateChat = async ({ neighborId, name }) => {
    try {
      const newChat = await createGroupChat({ id: neighborId, name: name });
      setChats((prev) => [...prev, newChat]);
      setShowNeighbors(false);
    } catch (err) {
      setError("Failed to create chat");
    }
  };

  return (
    <div className="p-4 bg-[#efeffb] min-h-screen flex flex-col">
      <header className="mb-4 text-2xl font-semibold text-gray-800">My Chats</header>
      {chats && chats.length === 0 && (
        <p className="text-sm text-gray-500">You don't have any group chats.</p>
      )}
      <div className="flex flex-col md:flex-row md:gap-4 flex-1">
        {/* Chat List */}
        <div className="w-full md:w-1/3 bg-white p-4 rounded-lg shadow md:overflow-y-auto md:h-full">
          <div className="flex md:flex-col gap-4 overflow-x-auto pb-2 md:pb-0">
            {chats.map((chat) => (
              <div
                key={chat.chat_id}
                className={`p-2 border rounded cursor-pointer hover:bg-[#efeffb] ${
                  chat.chat_id === currentChat ? " bg-[#d5d5f5]" : ""}`}
                onClick={() => setCurrentChat(chat.chat_id)}
              >
                {chat.name}
              </div>
            ))}
          </div>
          <button
            className="mt-4 w-full bg-[#6363ab] text-white px-4 py-2 rounded hover:bg-[#5656ab]"
            onClick={loadNeighbors}
          >
            Create Group Chat
          </button>
        </div>

        {/* Chat Window */}
        <div className="flex-1 bg-white p-4 rounded-lg shadow flex flex-col">
          {error && <p className="text-red-500 mt-4">{error}</p>}
          {currentChat ? (
            <>
              <header className="font-bold text-lg mb-4">{currentChat.name}</header>
              <div className="flex-1 overflow-y-auto">
                {messages.map((msg, idx) => (
                  <div key={idx} className="mb-2 p-2 border rounded-md bg-[#d5d5f5]">
                    <strong className="text-sm text-gray-600">{msg.author_name}:</strong> {msg.content}
                  </div>
                ))}
              </div>
              <form onSubmit={handleSendMessage} className="flex gap-2 mt-4">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 p-2 border rounded"
                />
                <button
                  type="submit"
                  className="bg-[#6363ab] text-white px-4 py-2 rounded hover:bg-[#5656ab]"
                >
                  Send
                </button>
              </form>
            </>
          ) : (
            <p className="text-gray-500">Select a chat to view messages</p>
          )}
        </div>
      </div>

      {/* Neighbors Modal */}
      {showNeighbors && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow w-1/3">
            <h3 className="font-bold text-lg mb-4">Select a Neighbor</h3>
            {neighbors.map((neighbor) => (
              <div
                key={neighbor.id}
                className="p-2 border-b cursor-pointer hover:bg-gray-100"
                onClick={() => handleCreateChat({ neighborId: neighbor.id, name: neighbor.name })}
              >
                {neighbor.name}
              </div>
            ))}
            <button
              onClick={() => setShowNeighbors(false)}
              className="mt-4 w-full bg-red-500 text-white py-2 rounded hover:bg-red-600"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* {error && <p className="text-red-500 mt-4">{error}</p>} */}
    </div>
  );
};

export default Chat;

