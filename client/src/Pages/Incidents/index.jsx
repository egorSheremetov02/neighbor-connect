import React, { useState } from "react";
import { Grid, Button, Box } from "@mui/material";
import IncidentCard from "./IncidentCard";
import AddIncidents from "../AddIncidents";
import { Modal } from "react-responsive-modal";

const Incidents = () => {
  const [open, setOpen] = useState(false);

  const onOpenModal = () => setOpen(true);
  const onCloseModal = () => setOpen(false);

  // Extended sample data for the cards with 6 incidents
  const cardData = [
    { id: 1, title: "Water Main Break Floods Downtown" },
    { id: 2, title: "Power Outage in Suburban Area" },
    { id: 3, title: "Road Closure Due to Landslide" },
    { id: 4, title: "Public Transport Delay" },
    { id: 5, title: "Gas Leak Near School" },
    { id: 6, title: "Unexpected Street Festival" }
  ];

  return (
    <>
      <Modal open={open} onClose={onCloseModal} center>
        <AddIncidents />
      </Modal>

      <Box display="flex" justifyContent="center" sx={{ margin: 3 }}>
        <Button variant="contained" color="primary" onClick={onOpenModal}>
          Add Incident
        </Button>
      </Box>

      <Grid container spacing={2} justifyContent="center">
        {cardData.map((card) => (
          <Grid item xs={12} sm={6} md={4} key={card.id}>
            <IncidentCard title={card.title} />
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export default Incidents;
