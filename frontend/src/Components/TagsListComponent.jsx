import React, { useState } from "react";
import { Box, Typography } from "@mui/material";

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
        display: "flex",
        flexWrap: "wrap", // Enables wrapping
        gap: "4px", // Adds space between wrapped items
      }}
    >
      {tagObjects.map((tag, index) => (
        <Box
          key={index}
          onClick={() => {
            onTagToggle(tags[index]);
            handleTagClick(index);
          }}
          sx={{
            display: "inline-block",
            padding: "4px 8px",
            backgroundColor: "#c8c2f1",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          <Typography
            variant="caption"
            color="black"
            sx={{ fontSize: "0.8rem", fontStyle: "normal" }}
          >
            {tag.name}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

export default TagsListComponent;
