import MapIcon from '@mui/icons-material/Map';

const OfferCard = () => {
  const container = {
    width: '320px',
    border: '0.5px solid #A7A7A7',
    padding: '7px',
    borderRadius: '4px'
  };
  const neighbourName = {
    fontFamily: 'Poppins',
    fontWeight: 400,
    fontSize: '14px',
    lineHeight: '30px',
  };
  const postText = {
    fontFamily: 'Poppins',
    fontWeight: 400,
    fontSize: '8px',
    lineHeight: '12px',
    color: '#A7A7A7',
    marginLeft: '10px',
    marginBottom: '10px',
  };
  const buttonContainer = {
    display: 'flex',
    justifyContent: 'flex-end', // Align button to the right
  };
  const buttonStyle = {
    fontSize: '12px',
    color: '#A7A7A7',
    border: '1px solid #A7A7A7',
    borderRadius: '4px',
    padding: '4px',
    display: 'flex',
    gap: '5px',
    alignItems: 'center',
  };

  return (
    <div style={container}>
      <div className="flex items-center">
        <img
          src="public/images/profile.jfif"
          alt="profile"
          className="w-8 h-8 rounded-full mb-4 mt-3 mr-4"
        />
        <h1 style={neighbourName}>ROBIN HOOD Cafe</h1>
      </div>
      <p style={postText}>
        Lorem ipsum dolor sit amet. Qui fugiat libero nam voluptate nobis in
        expedita sint. Ea nobis neque vel impedit laboriosam ea exercitationem
        voluptatem et quas aliquam ut labore perferendis qui libero veritatis?
        Aut temporibus magnam ea ipsam ipsum sed quia explicabo ea eius laborum
        et perferendis laudantium vel ...
      </p>
      <div style={buttonContainer}>
        <button style={buttonStyle}>
          <MapIcon fontSize="small" style={{ color: '#A7A7A7' }} />
          <p>Go to map</p>
        </button>
      </div>
    </div>
  );
};

export default OfferCard;
