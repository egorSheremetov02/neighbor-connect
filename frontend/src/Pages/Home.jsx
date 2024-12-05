import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { Stack, Typography, Button, Grid } from "@mui/material";
import AddIncidentModal from "../Components/AddIncidentModal";
import AddOfferModal from "../Components/AddOfferModal";
import PostCard from "../Components/PostCard";
import Chatbot from "../Components/chatbot/Chatbot";

const Home = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");
  const [openIncidentModal, setOpenIncidentModal] = useState(false);
  const [openOfferModal, setOpenOfferModal] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);

  const token = sessionStorage.getItem("TOKEN");
  const is_admin = sessionStorage.getItem("is_admin") === "true";

  if (!token) {
    return <Navigate to="/login" />;
  }

  // console.log(token, token.substring(1, token.length - 1));

  const toggleTag = (tag) => {
    setSelectedTags(
      (prevTags) =>
        prevTags.includes(tag)
          ? prevTags.filter((t) => t !== tag) // Remove if exists
          : [...prevTags, tag] // Add if not exists
    );
  };

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const offersUrl = new URL(
          `${import.meta.env.VITE_BASE_URL_PROD}/offers/`
        );

        if (selectedTags && selectedTags.length > 0) {
          selectedTags.forEach((tag) =>
            offersUrl.searchParams.append("tag", tag)
          ); // `tag` is used as an alias for `tags`
        }

        const response = await fetch(offersUrl, {
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
        const response = await fetch(
          `${import.meta.env.VITE_BASE_URL_PROD}/incidents/`,
          {
            headers: {
              Authorization: "bearer " + token.substring(1, token.length - 1),
              "Content-Type": "application/x-www-form-urlencoded",
            },
          }
        );
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
  }, [token, selectedTags]);

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
              color: "white",
              background: "#6363ab",
              fontSize: "10px",
              "&:hover": {
                color: "white",
                background: "#6363ab",
              },
            }}
          >
            Add Incident
          </Button>
          <Button
            variant="contained"
            onClick={() => setOpenOfferModal(true)}
            sx={{
              color: "white",
              background: "#6363ab",
              fontSize: "10px",
              "&:hover": {
                color: "white",
                background: "#6363ab",
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
          {selectedTags.map((selectedTag) => (
            <button
              key={selectedTag}
              onClick={() => toggleTag(selectedTag)}
              style={{
                margin: "2px",
                padding: "4px 6px",
                backgroundColor: "#c6bfec",
                color: "black",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "0.75rem",
              }}
            >
              {selectedTag}
            </button>
          ))}

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
                  <PostCard
                    props={post}
                    onTagToggle={toggleTag}
                    is_admin={is_admin}
                  />
                </Grid>
              ))}
            </Grid>
          ) : (
            <Typography className="text-black">No posts available.</Typography>
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
      <Chatbot />
    </div>
  );
};

export default Home;
