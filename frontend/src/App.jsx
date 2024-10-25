import "@fontsource/inter";
import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Wrapper from "./Components/Wrapper";
import Chat from "./Pages/Chat";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Neighbors from "./Pages/Neighbors";
import Profile from "./Pages/Profile";
import Signup from "./Pages/Signup";
import { ChatProvider } from "./utilities/ChatContext";

const App = () => {
  console.log(sessionStorage.getItem("token"));
  return (
    <ChatProvider>
      <Router basename="/">
        <Routes>
          <Route
            path="/home"
            exact
            element={
              <Wrapper>
                <Home />
              </Wrapper>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/neighbors"
            element={
              <Wrapper>
                <Neighbors />
              </Wrapper>
            }
          />
          <Route
            path="/chats"
            element={
              <Wrapper>
                <Chat />
              </Wrapper>
            }
          />
          <Route
            path="/neighbors/:userid"
            element={
              <Wrapper>
                <Profile />
              </Wrapper>
            }
          />
          <Route
            path="/profile/:userid"
            element={
              <Wrapper>
                <Profile />
              </Wrapper>
            }
          />
        </Routes>
      </Router>
    </ChatProvider>
  );
};

export default App;
