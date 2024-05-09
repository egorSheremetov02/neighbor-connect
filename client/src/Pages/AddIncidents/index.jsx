import React, { useState } from "react";
import Button from "@mui/material/Button";
import { Alert } from "@mui/material";
import { json } from "react-router-dom";

const AddIncidents = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState(""); // New state variable for date
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    // Reset previous messages
    setSuccessMessage("");
    setErrorMessage("");

    // Retrieve token from sessionStorage
    const token = sessionStorage.getItem('token');
    if (!token) {
      setErrorMessage("Authorization token not found.");
      return;
    }

    // Construct incident data object
    const incidentData = {
      title: title,
      description: description,
      location: location,
      date: date, // Use the date state variable here
      created_at: new Date().toISOString(),
    };
    
    console.log(incidentData)

    // Perform API POST request
    fetch("http://localhost:8080/incidents/", {
      method: "POST",
      headers: {
        Authorization: token.substring(1, token.length-1),
        "Content-Type": "application/json"
      },
      body: JSON.stringify(incidentData),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Failed to add incident");
        }
      })
      .then((data) => {
        // Display success message
        setSuccessMessage("Incident added successfully. Incident ID: " + data.id);
        // Clear input fields
        setTitle("");
        setDescription("");
        setLocation("");
        setDate(""); // Clear date field
      })
      .catch((error) => {
        // Display error message
        setErrorMessage("Error: " + error.message);
      });
  };

  return (
    <form className="w-full max-w-xl p-4 rounded-lg shadow-lg bg-gray-100" onSubmit={handleSubmit}>
      {successMessage && <Alert severity="success">{successMessage}</Alert>}
      {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
          Title
        </label>
        <input
          className="appearance-none block w-full bg-white text-gray-700 border border-gray-300 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
          id="title"
          type="text"
          placeholder="Incident Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
          Description
        </label>
        <textarea
          className="appearance-none block w-full bg-white text-gray-700 border border-gray-300 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
          id="description"
          placeholder="Incident Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="location">
          Location
        </label>
        <input
          className="appearance-none block w-full bg-white text-gray-700 border border-gray-300 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
          id="location"
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="date">
          Date
        </label>
        <input
          className="appearance-none block w-full bg-white text-gray-700 border border-gray-300 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
          id="date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </div>
      <Button
        type="submit"
        fullWidth
        variant="contained"
        className="py-2 px-4 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:bg-blue-700"
      >
        Submit
      </Button>
    </form>
  );
};

export default AddIncidents;
