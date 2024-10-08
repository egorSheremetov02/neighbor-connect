import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import Neighbors from "./Pages/Neighbors";
import Profile from "./Pages/Profile";
import Wrapper from "./Components/Wrapper";
import "@fontsource/inter";

const App = () => {
  console.log(sessionStorage.getItem("token"));
  return (
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
          path="/neighbors/:id"
          element={
            <Wrapper>
              <Profile />
            </Wrapper>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
