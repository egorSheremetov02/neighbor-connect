import React, { useState, useEffect } from "react";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { Modal } from "react-responsive-modal";
import AddOffer from "./AddOffer";
import { Button } from "@mui/material";
import OfferCard from "./offerCard"
import { Grid } from "@mui/material";


const Offers = () => {
  const [offers, setOffers] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const token = sessionStorage.getItem("token");
        if (!token) {
          console.error("Token not found.");
          return;
        }
        const response = await fetch("http://localhost:8080/offers/", {
          headers: {
            Authorization: token.substring(1, token.length - 1),
            "Content-Type": "application/x-www-form-urlencoded",
          },
        });
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setOffers(data.offers);
      } catch (error) {
        console.error("Error fetching offers:", error);
      }
    };
    fetchOffers();
  }, []);

  const onOpenModal = () => setOpen(true);
  const onCloseModal = () => setOpen(false);

  return (
    <div className="container mx-auto px-2 pt-8">
      <Modal open={open} onClose={onCloseModal} center>
        <AddOffer />
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
          Add Offers
        </Button>
      </div>
      <div className="mx-auto">
        <h1 className="text-3xl font-bold mb-4">New Offers</h1>

        {/* Offer cards */}
        {<Grid container spacing={2} justifyContent="center">
        {offers.map((offer) => (
          <Grid item xs={12} sm={6} md={4} key={offer.id}>
            <OfferCard offer={offer} />
          </Grid>
        ))}
      </Grid>}
      </div>
    </div>
  );
};

export default Offers;
