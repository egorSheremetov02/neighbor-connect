import React, { useState } from "react";
import Button from "@mui/material/Button";
import { Alert } from "@mui/material";

const AddOffer = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [product, setProduct] = useState("");
  const [date, setDate] = useState("");
  const [image, setImage] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    // Reset previous messages
    setSuccessMessage("");
    setErrorMessage("");

    // Construct offer data object
    const offerData = {
      title: title,
      description: description,
      price: parseFloat(price),
      product: product,
      date: date,
    };
    const token = sessionStorage.getItem("token");

    // Perform API POST request
    fetch("http://localhost:8080/offers/", {
      method: "POST",
      headers: {
        Authorization: token.substring(1, token.length - 1),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(offerData),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Failed to add offer");
        }
      })
      .then((data) => {
        // Display success message
        setSuccessMessage(
          "Offer added successfully. Offer ID: " + data.offer_id
        );
        // Clear input fields
        setTitle("");
        setDescription("");
        setPrice("");
        setProduct("");
        setDate("");
      })
      .catch((error) => {
        // Display error message
        setErrorMessage("Error: " + error.message);
      });
  };

  return (
    <form className="w-full max-w-lg" onSubmit={handleSubmit}>
      {successMessage && <Alert severity="success">{successMessage}</Alert>}
      {errorMessage && <p>{errorMessage}</p>}
      <div className="flex flex-wrap -mx-3 mb-6">
        <div className="w-full px-3 mb-6 md:mb-0">
          <label
            className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
            htmlFor="title"
          >
            Offer Title
          </label>
          <input
            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
            id="title"
            type="text"
            placeholder="Offer Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <p className="text-red-500 text-xs italic">
            Please fill out this field.
          </p>
        </div>
      </div>
      <div className="flex flex-wrap -mx-3 mb-6">
        <div className="w-full px-3">
          <label
            className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
            htmlFor="description"
          >
            Description
          </label>
          <textarea
            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            id="description"
            placeholder="Offer description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
      </div>
      <div className="flex flex-wrap -mx-3 mb-6">
        <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
          <label
            className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
            htmlFor="date"
          >
            Date
          </label>
          <input
            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
          <label
            className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
            htmlFor="product"
          >
            Product
          </label>
          <select
            className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            id="product"
            value={product}
            onChange={(e) => setProduct(e.target.value)}
            required
          >
            <option value="">Select Product</option>
            <option value="Food Items">Food Items</option>
            <option value="Services">Services</option>
            <option value="Clothing">Clothing</option>
          </select>
        </div>
        <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
          <label
            className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
            htmlFor="price"
          >
            Price
          </label>
          <input
            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            id="price"
            type="number"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>
      </div>
      <div className="flex flex-wrap -mx-3 mb-2">
        <Button
          type="submit"
          fullWidth
          variant="contained"
          data-testid="submit-button"
          sx={{ mt: 3, mb: 2 }}
        >
          Submit
        </Button>
      </div>
    </form>
  );
};

export default AddOffer;
