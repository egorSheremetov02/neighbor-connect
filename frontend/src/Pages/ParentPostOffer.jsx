import React, { useState } from "react";
import { Button } from "@mui/material";
import AddIncidentModal from "../Components/AddIncidentModal";
import PostCard from "../Components/PostCard";

export default function ParentPostOffer() {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleImageUpload = (image) => {
    setUploadedImage(image); 
  };

  return (
    <>
      <Button onClick={() => setModalOpen(true)}>Add Incident</Button>
      <AddIncidentModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onImageUpload={handleImageUpload}
      />
      
      <PostCard
        props={{ title: "Sample Incident" }}
        uploadedImage={uploadedImage}
      />
    </>
  );
}
