import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';


class Tag {
  constructor(name) {
    this.name = name;
  }
}

const TagsListComponent = ({ tags, onTagToggle }) => {
  // Convert each tag string into a Tag class instance
  const [tagObjects, setTagObjects] = useState(tags.map((tag) => new Tag(tag)));

  const handleTagClick = (index) => {
    const newTags = [...tagObjects];
    setTagObjects(newTags); // Update the state
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap', // Enables wrapping
        gap: '4px', // Adds space between wrapped items
      }}
    >
      {tagObjects.map((tag, index) => (
        <Box
          key={index}
          onClick={() => {
              onTagToggle(tags[index])
              handleTagClick(index)
          }
        }
          sx={{
            display: 'inline-block',
            padding: '4px 8px',
            backgroundColor: '#2196f3', // Green if selected, blue otherwise
            borderRadius: '4px',
            cursor: 'pointer', // Adds pointer cursor on hover
          }}
        >
            <Typography
              variant="caption"
              color="white"
              sx={{ fontSize: '0.8rem', fontStyle: 'normal' }} // Ensure normal font style
            >
              {tag.name}
            </Typography>
        </Box>
      ))}
    </Box>
  );
};

export default TagsListComponent;
