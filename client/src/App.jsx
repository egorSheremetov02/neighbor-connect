import React, { useState } from 'react';
import LoginPage from './Pages/LoginPage/LoginPage';
import Profile from './Pages/Profile/Profile';
import Container from '@mui/material/Container';
import Incidents from './Pages/Incidents';
import Chats from './Pages/Chats/';
import Offers from './Pages/Offers';
import { Button } from "@mui/material";


const App = () => {
  const [activeComponent, setActiveComponent] = useState('login');

  const renderComponent = () => {
    switch (activeComponent) {
      case 'login':
        return <LoginPage />;
      case 'profile':
        return <Profile />;
      case 'chats':
        return <Chats />;
      case 'incidents':
        return <Incidents />;
      case 'offers':
        return <Offers />;
      default:
        return null;
    }
  };

  return (
    <div>
      <p className="mt-5 mr-5 sm:text-xl text-lg flex justify-end font-bold mb-4 mr-4 absolute top-0 right-0">
        Neighbor Connect
      </p>
      <div style={{ position: 'relative' }}>
        <Container>
          <div className="mb-10 mt-10 flex justify-center items-end space-x-3 sm:space-x-2 sm:flex-wrap sm:space-y-2">
            <Button variant="outlined" style={{backgroundColor: activeComponent === 'login' ? 'blue' : 'transparent', color: activeComponent === 'login' ? 'white' : '#1976d2' }} onClick={() => setActiveComponent('login')} sx={{ width: '100px', height: '40px' }}>Login</Button>
            <Button variant="outlined" style={{backgroundColor: activeComponent === 'profile' ? 'blue' : 'transparent', color: activeComponent === 'profile' ? 'white' : '#1976d2' }} onClick={() => setActiveComponent('profile')} sx={{ width: '100px', height: '40px' }}>Profile</Button>
            <Button variant="outlined" style={{backgroundColor: activeComponent === 'chats' ? 'blue' : 'transparent', color: activeComponent === 'chats' ? 'white' : '#1976d2' }} onClick={() => setActiveComponent('chats')} sx={{ width: '100px', height: '40px' }}>Chats</Button>
            <Button variant="outlined" style={{backgroundColor: activeComponent === 'incidents' ? 'blue' : 'transparent', color: activeComponent === 'incidents' ? 'white' : '#1976d2' }} onClick={() => setActiveComponent('incidents')} sx={{ width: '100px', height: '40px' }}>Incidents</Button>
            <Button variant="outlined" style={{backgroundColor: activeComponent === 'offers' ? 'blue' : 'transparent', color: activeComponent === 'offers' ? 'white' : '#1976d2' }} onClick={() => setActiveComponent('offers')} sx={{ width: '100px', height: '40px' }}>Offers</Button>
          </div>
          {renderComponent()}
        </Container>
      </div>
    </div>
  );
};

export default App;
