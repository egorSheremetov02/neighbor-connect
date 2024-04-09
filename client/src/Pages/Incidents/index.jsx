import React from 'react';
import IncidentCard from './IncidentCard';

const Incidents = () => {
  // Sample data for the cards
  const cardData = [
    { id: 1, title: 'Incident 1' },
    { id: 2, title: 'Incident 2' },
    { id: 3, title: 'Incident 3' },
    { id: 4, title: 'Incident 4' },
  ];

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '20px' }}>
      {cardData.map((card) => (
        <IncidentCard key={card.id} title={card.title} />
      ))}
    </div>
  );
};

export default Incidents;
