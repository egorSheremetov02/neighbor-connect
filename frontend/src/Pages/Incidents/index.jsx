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
    const token = sessionStorage.getItem('token');
    if (!token) {
      console.error('Token not found.');
      return;
    }

    fetch("http://localhost:8080/incidents/", {
      headers: {
        Authorization: token.substring(1, token.length-1),
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
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
            <IncidentCard incident={incident} />
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export default Incidents;
