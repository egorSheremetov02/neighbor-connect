import React, { useState } from "react";
import Button from "@mui/material/Button";
import { Alert } from "@mui/material";

const AddIncidents = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    // Reset previous messages
    setSuccessMessage("");
    setErrorMessage("");

    // Construct incident data object
    const incidentData = {
      title: title,
      description: description,
      author_id: 0, // Assuming author ID is fixed for now
    };

    // Perform API POST request
    fetch("http://localhost:8080/incidents/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
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
      })
      .catch((error) => {
        // Display error message
        setErrorMessage("Error: " + error.message);
      });
  };

  return (
    <form className="w-full max-w-lg" onSubmit={handleSubmit}>
      {successMessage && <Alert severity="success">{successMessage}</Alert>}
      {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
      <div className="flex flex-wrap -mx-3 mb-6">
        <div className="w-full px-3 mb-6 md:mb-0">
          <label
            className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
            htmlFor="title"
          >
            Title
          </label>
          <input
            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
            id="title"
            type="text"
            placeholder="Incident Title "
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <p className="text-red-500 text-xs italic">Please fill out this field.</p>
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
            placeholder="Incident description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
      </div>
      <div className="flex flex-wrap -mx-3 mb-2">
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Submit
        </Button>
      </div>
    </form>
  );
};

export default AddIncidents;
