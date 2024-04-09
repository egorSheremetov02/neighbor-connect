import React from 'react';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import NearMeIcon from '@mui/icons-material/NearMe';
import MapIcon from '@mui/icons-material/Map';

const CustomCard = () => {
  const cardStyle = {
    display: 'flex',
    width: '45%',
    backgroundColor: '#1967D221',
    padding: '12px',
    borderRadius: '4px',
    justifyContent: 'space-between'
  };
  const leftSection = {
    // width: 'fit-content',
  }
  const likes = {
    display: 'flex',
    backgroundColor: '#1967D2',
    borderRadius: '4px',
    padding: '4px 8px',
    alignItems: 'center',
    gap: '5px'
  }
  const paragraphStyle = {
    fontFamily: 'Poppins',
    fontWeight: 600,
    fontSize: '10px',
    lineHeight: '15px',
    color: '#ffffff',
  };
  const postContent = {
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  }
  const imagePost = {
    width: "200px"
  }
  const contentText = {
    textAlign: 'right',
    fontFamily: 'Poppins',
    fontWeight: 400,
    fontSize: '14px',
    lineHeight: '21px',
    color: '#3E3E3E',
    display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-end',
  justifyContent: 'space-between',
  };
  const neighbourName = {
    fontFamily: 'Poppins',
    fontWeight: 400,
    fontSize: '20px',
    lineHeight: '30px',
  }
  const titleStyle = {
    fontFamily: 'Poppins',
    fontWeight: 600,
    fontSize: '20px',
    lineHeight: '30px',
    marginBottom: '20px'
  }

  return (
    <div style={cardStyle}>
      <div style={leftSection}>
        <div className="flex justify-center items-center">
          <img
            src="public/images/profile.jfif"
            alt="profile"
            className="sm:w-12 sm:h-12 w-10 h-10 rounded-full mb-4 mt-3"
          />
        </div>
        <div style={likes}>
          <ThumbUpIcon fontSize='10px' style={{ color: '#ffffff' }} />
          <p style={paragraphStyle}>10</p>
          <ThumbDownIcon fontSize='10px' style={{ color: '#ffffff' }} />
          <p style={paragraphStyle}>5</p>
        </div>
      </div>
      <div>
        <h1 style={neighbourName}>Alexandr  T.</h1>
        <h2 style={titleStyle}>Water Main Break Floods Downtown</h2>
        <div style={postContent}>
            <img src="public/images/incidentimage1.png" style={imagePost}/>
            <div style={contentText}>
                <p>16:30</p>
                <p>20.04.2024</p>
                <div style={{display: 'flex', gap: '5px', alignItems: 'center', justifyContent: 'flex-end'}}>
                    <NearMeIcon fontSize='10px' style={{ color: '#3E3E3E' }} />
                    <p>3 km</p>
                </div>
                <p>Friedrichstraße 55, Hamburg</p>
                <button style={{border: '1px solid #3E3E3E', borderRadius: '4px', padding: '4px', display: 'flex', gap: '5px', alignItems: 'center', justifyContent: 'flex-end'}}> 
                <MapIcon fontSize='10px' style={{ color: '#3E3E3E' }} />
                <p>Go to map</p> </button>
            </div>
            
        </div>
      </div>
    </div>
  );
};

export default CustomCard;
