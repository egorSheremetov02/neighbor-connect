import React, { useState } from 'react';
import { useTheme, useMediaQuery, AppBar, Toolbar, Button, Typography, Box, IconButton, Menu, MenuItem, Container } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Profile from './Profile/Profile';
import Incidents from './Incidents';
import Chats from './Chats/Chats';
import Offers from './Offers/Offers';
import 'react-responsive-modal/styles.css';
import Admin from './admin/AdminPage';
import { Navigate } from "react-router-dom";
import { useAuth } from '../auth/index'; // Import useAuth hook

const Home = () => {
  const [activeComponent, setActiveComponent] = useState("profile");
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { setToken, logout, token } = useAuth(); // Access setAuthToken function from useAuth

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const renderComponent = () => {
    switch (activeComponent) {
      case 'profile':
        return <Profile />;
      case "chats":
        return <Chats />;
      case "incidents":
        return <Incidents />;
      case "offers":
        return <Offers />;
    //   case 'admin':
    //     return <Admin />;
      default:
        return null;
    }
  };

  const handleLogout = () => {
    console.log("hiii")
    sessionStorage.removeItem('token'); 
    window.location.href = "http://localhost:5173/login";
  };

  const menuItems = [
    { name: "Profile", action: () => setActiveComponent("profile") },
    { name: "Chats", action: () => setActiveComponent("chats") },
    { name: "Incidents", action: () => setActiveComponent("incidents") },
    { name: "Offers", action: () => setActiveComponent("offers") },
    // { name: "Admin", action: () => setActiveComponent("admin") },
    { name: "Logout", action: handleLogout },
  ];

  return (
    <div>
        <AppBar position="static" color="default">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Neighbor Connect
            </Typography>
            {isMobile ? (
              <>
                <IconButton
                  size="large"
                  edge="end"
                  color="inherit"
                  aria-label="menu"
                  onClick={handleMenu}
                >
                  <MenuIcon />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  open={open}
                  onClose={handleClose}
                >
                  {menuItems.map((item) => (
                    <MenuItem
                      key={item.name}
                      onClick={() => {
                        item.action(); // Call action function associated with the menu item
                        handleClose();
                      }}
                    >
                      {item.name}
                    </MenuItem>
                  ))}
                </Menu>
              </>
            ) : (
              <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
                {menuItems.map((item) => (
                  <Button
                    key={item.name}
                    color="inherit"
                    onClick={item.action} // Just pass the function reference
                    sx={{
                      width: "100px",
                      height: "40px",
                    }}
                  >
                    {item.name}
                  </Button>
                ))}
              </Box>
            )}
          </Toolbar>
        </AppBar>
        <Container>{renderComponent()}</Container>
      </div>
  );
};

export default Home;
