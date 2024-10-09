import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { Stack, Typography, Button, Grid } from "@mui/material";
import AddIncidentModal from "../Components/AddIncidentModal";
import AddOfferModal from "../Components/AddOfferModal";
import PostCard from "../Components/PostCard";

const Home = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");
  const [openIncidentModal, setOpenIncidentModal] = useState(false);
  const [openOfferModal, setOpenOfferModal] = useState(false);

  const token = sessionStorage.getItem("TOKEN");

  if (!token) {
    return <Navigate to="/login" />;
  }

  console.log(token, token.substring(1, token.length - 1));

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const response = await fetch("http://localhost:8080/offers/", {
          headers: {
            Authorization: "bearer " + token.substring(1, token.length - 1),
            "Content-Type": "application/x-www-form-urlencoded",
          },
        });
        if (!response.ok) {
          setError(`HTTP error! Status: ${response.status}`);
          return [];
        }
        const data = await response.json();
        return data.offers || [];
      } catch (error) {
        setError("Error fetching offers.");
        console.error(error);
        return [];
      }
    };

    const fetchIncidents = async () => {
      try {
        const response = await fetch("http://localhost:8080/incidents/", {
          headers: {
            Authorization: "bearer " + token.substring(1, token.length - 1),
            "Content-Type": "application/x-www-form-urlencoded",
          },
        });
        if (!response.ok) {
          setError(`HTTP error! Status: ${response.status}`);
          return [];
        }
        const data = await response.json();
        return data.incidents || [];
      } catch (error) {
        setError("Error fetching incidents.");
        console.error(error);
        return [];
      }
    };

    const loadData = async () => {
      const offers = await fetchOffers();
      const incidents = await fetchIncidents();
      setPosts([...offers, ...incidents]);
      setIsLoading(false);
    };

    loadData();
  }, [token]);

  if (isLoading)
    return <Typography sx={{ color: "#fff" }}>Loading...</Typography>;
  if (error)
    return (
      <Typography color="error" variant="body2" sx={{ mt: 2 }}>
        {error}
      </Typography>
    );

  return (
    <div>
      <Stack
        direction={"row"}
        sx={{
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "30px",
        }}
      >
        <Typography variant="h4" sx={{ color: "#000" }}>
          Posts
        </Typography>
        <Stack
          spacing={2}
          direction="row"
          justifyContent="center"
          sx={{ mt: 2 }}
        >
          <Button
            variant="contained"
            onClick={() => setOpenIncidentModal(true)}
            sx={{
              color: "black",
              background: "#e2e2e2",
              fontSize: "10px",
              "&:hover": {
                background: "#e2e2e2",
              },
            }}
          >
            Add Incident
          </Button>
          <Button
            variant="contained"
            onClick={() => setOpenOfferModal(true)}
            sx={{
              color: "black",
              background: "#e2e2e2",
              fontSize: "10px",
              "&:hover": {
                background: "#e2e2e2",
              },
            }}
          >
            Add Offer
          </Button>
        </Stack>
      </Stack>

      {isLoading ? (
        <Typography>Loading...</Typography>
      ) : (
        <div>
          {posts.length > 0 ? (
            <Grid container spacing={2}>
              {posts.map((post, i) => (
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  lg={3}
                  key={post.title + post.date + i}
                >
                  <PostCard props={post} />
                </Grid>
              ))}
            </Grid>
          ) : (
            <Typography className="text-white">No posts available.</Typography>
          )}
        </div>
      )}

      {error && (
        <Typography color="error" variant="body2" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}

      <AddIncidentModal
        open={openIncidentModal}
        onClose={() => setOpenIncidentModal(false)}
      />
      <AddOfferModal
        open={openOfferModal}
        onClose={() => setOpenOfferModal(false)}
      />
    </div>
  );
};

export default Home;
