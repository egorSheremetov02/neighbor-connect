import TextField from '@mui/material/TextField';
import OfferCard from './OfferCard';


const Offers = () => {

    const container = {
        backgroundColor: '#0085FF03',
        border: '1px solid #1967D299',
        borderRadius: '4px',
        padding: '25px 120px 25px 120px',

    }

    const cardData = [
        { id: 1, title: 'Incident 1' },
        { id: 2, title: 'Incident 2' },
        { id: 3, title: 'Incident 3' },
        { id: 4, title: 'Incident 4' },
      ];


    return <div style={container}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: "20px" }}>
            <TextField
                placeholder="Search..."
                variant="outlined"
                fullWidth
                sx={{
                    '& .MuiOutlinedInput-root': {
                      height: '33px', 
                      fontFamily: 'Poppins',
                        fontWeight: 300,
                        fontSize: '14px',
                        lineHeight: '21px',
                        color: '#A7A7A7',
                    },
                  }}
            />
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '20px' }}>
          {cardData.map((card) => (
            <OfferCard key={card.id} title={card.title} />
          ))}
        </div>
    </div>
}

export default Offers;