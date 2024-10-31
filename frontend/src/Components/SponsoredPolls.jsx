import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './SponsoredPolls.css'; 

const SponsoredPolls = () => {
  const [polls, setPolls] = useState([]);
  const [selectedOption, setSelectedOption] = useState({});
  const [offer, setOffer] = useState('');
  const [results, setResults] = useState({});

  useEffect(() => {
    axios.get('/api/sponsored-polls/')
      .then(response => setPolls(response.data))
      .catch(error => console.error('Error fetching polls:', error));
  }, []);

  const handleVote = (pollId) => {
    axios.post(`/api/sponsored-polls/${pollId}/vote/`, { option: selectedOption[pollId] })
      .then(response => {
        setOffer(response.data.offer);
        setResults(prevResults => ({ ...prevResults, [pollId]: response.data.results }));
      })
      .catch(error => console.error('Error recording vote:', error));
  };

  return (
    <div className="sponsored-polls">
      {polls.map(poll => (
        <div key={poll.id} className="poll">
          <h3>{poll.question}</h3>
          {poll.options.map(option => (
            <div key={option} className="option">
              <input
                type="radio"
                name={`poll-${poll.id}`}
                value={option}
                onChange={() => setSelectedOption({ ...selectedOption, [poll.id]: option })}
              />
              {option}
            </div>
          ))}
          <button onClick={() => handleVote(poll.id)}>Vote</button>
          {results[poll.id] && (
            <div className="results">
              <h4>Results:</h4>
              {Object.entries(results[poll.id]).map(([option, count]) => (
                <div key={option}>{option}: {count} votes</div>
              ))}
            </div>
          )}
        </div>
      ))}
      {offer && <div className="offer">{offer}</div>}
    </div>
  );
};

export default SponsoredPolls;
