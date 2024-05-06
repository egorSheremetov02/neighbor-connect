import React, { useState, useEffect } from "react";
import { Grid, Button, Box } from "@mui/material";
import IncidentCard from "./IncidentCard";
import AddIncidents from "../AddIncidents";
import { Modal } from "react-responsive-modal";

const Incidents = () => {
  const [open, setOpen] = useState(false);
  const [incidents, setIncidents] = useState([]);

  const onOpenModal = () => setOpen(true);
  const onCloseModal = () => setOpen(false);

  useEffect(() => {
    fetch("http://localhost:8080/incidents/")
      .then((response) => response.json())
      .then((data) => setIncidents(data.incidents))
      .catch((error) => console.error("Error fetching incidents:", error));
  }, []);

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
        {incidents.map((incident) => (
          <Grid item xs={12} sm={6} md={4} key={incident.id}>
            <IncidentCard title={incident.title} />
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export default Incidents;
