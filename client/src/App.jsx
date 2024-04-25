import React, { useState } from 'react';
import { useTheme, useMediaQuery, AppBar, Toolbar, Button, Typography, Box, IconButton, Menu, MenuItem, Container } from '@mui/material';
import LoginPage from './Pages/LoginPage/LoginPage';
import Profile from './Pages/Profile/Profile';
import Incidents from './Pages/Incidents';
import Chats from './Pages/Chats/Chats';
import Offers from './Pages/Offers/Offers';
import 'react-responsive-modal/styles.css';
import Admin from './Pages/admin/AdminPage';
import RegistrationPage from './Pages/RegistrationPage/RegistrationPage';


const App = () => {
  const [activeComponent, setActiveComponent] = useState("login");
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const renderComponent = () => {
    switch (activeComponent) {
      case "login":
        return <LoginPage />;
      case 'register':
        return <RegistrationPage />;
      case 'profile':
        return <Profile />;
      case "chats":
        return <Chats />;
      case "incidents":
        return <Incidents />;
      case "offers":
        return <Offers />;
      case 'admin':
        return <Admin />;
      default:
        return null;
    }
  };

  const menuItems = [
    { name: "Profile", action: () => setActiveComponent("profile") },
    { name: "Chats", action: () => setActiveComponent("chats") },
    { name: "Incidents", action: () => setActiveComponent("incidents") },
    { name: "Offers", action: () => setActiveComponent("offers") },
    { name: "Admin", action: () => setActiveComponent("admin") },
    { name: "Login", action: () => setActiveComponent("login") },
    { name: "Register", action: () => setActiveComponent("register") },
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
                        setActiveComponent(item.name.toLowerCase());
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
                    onClick={() => setActiveComponent(item.name.toLowerCase())}
                    sx={{
                      backgroundColor:
                        item.name === "Login" ? "blue" : "transparent",
                      color: item.name === "Login" ? "white" : "#1976d2",
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

export default App;
