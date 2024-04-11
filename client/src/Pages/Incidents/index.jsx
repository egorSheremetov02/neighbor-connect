import React, { useState } from "react";
import IncidentCard from "./IncidentCard";
import { Button } from "@mui/material";
import AddIncidents from "../AddIncidents";
import { Modal } from "react-responsive-modal";

const Incidents = () => {
  const [open, setOpen] = useState(false);

  const onOpenModal = () => setOpen(true);
  const onCloseModal = () => setOpen(false);
  // Sample data for the cards
  const cardData = [
    { id: 1, title: "Incident 1" },
    { id: 2, title: "Incident 2" },
    { id: 3, title: "Incident 3" },
    { id: 4, title: "Incident 4" },
  ];

  return (
    <>
      <Modal open={open} onClose={onCloseModal} center>
      <AddIncidents />

      </Modal>

      <div className="flex my-4 justify-end">
        <Button
          variant="outlined"
          style={{
            backgroundColor: "transparent",
            color: "#1976d2",
          }}
          onClick={onOpenModal}
          sx={{ width: "150px", height: "40px" }}
        >
          Add Incidents
        </Button>
      </div>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          gap: "20px",
        }}
      >
        {cardData.map((card) => (
          <IncidentCard key={card.id} title={card.title} />
        ))}
      </div>
    </>
  );
};

export default Incidents;
