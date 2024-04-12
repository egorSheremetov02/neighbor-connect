// server.js

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mysql = require("mysql");

const app = express();

const port = process.env.PORT || 3000;
app.use(cors());

// Database connection
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "neighborConnect", // Changed the database name to match the schema
});

connection.connect((err) => {
  if (err) {
    console.error("Error connecting to database:", err.stack);
    process.exit(1); // Exit the application if unable to connect to the database
  }
  console.log("Connected to database");
});

app.use(bodyParser.json());

// -------------- Register a user ---------------------
app.post("/register", (req, res) => {
  const { username, email, password, phone_number, bio } = req.body;

  // Check if the email already exists
  connection.query(
    "SELECT * FROM User WHERE email = ?",
    [email],
    (err, result) => {
      if (err) {
        res.status(500).json({ error: "Failed to register user" });
        console.log(err);
      } else if (result.length > 0) {
        res.status(400).json({ error: "User already exists with this email" });
      } else {
        // Insert the new user
        const query = `INSERT INTO User (username, email, password, phone_number, bio) VALUES (?, ?, ?, ?, ?)`;
        connection.query(
          query,
          [username, email, password, phone_number, bio],
          (err, result) => {
            if (err) {
              res.status(500).json({ error: "Failed to register user" });
              console.log(err);
            } else {
              res.status(200).json({ message: "User registered successfully" });
            }
          }
        );
      }
    }
  );
});

// -------------- user login ---------------------
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  // Check if the email exists in the database
  connection.query(
    "SELECT * FROM User WHERE email = ?",
    [email],
    (err, result) => {
      if (err) {
        res.status(500).json({ error: "Failed to login" });
        console.log(err);
      } else if (result.length === 0) {
        res.status(400).json({ error: "User not found" });
      } else {
        const user = result[0];
        // Check if the password is correct
        if (user.password === password) {
          res.status(200).json({ message: "Login successful" });
        } else {
          res.status(401).json({ error: "Incorrect password" });
        }
      }
    }
  );
});

// -------------------- post an incident ----------------
app.post("/post-incident", (req, res) => {
  const { user_id, title, date, location } = req.body;

  // Check if the user exists in the database
  connection.query(
    "SELECT * FROM User WHERE id = ?",
    [user_id],
    (err, result) => {
      if (err) {
        res.status(500).json({ error: "Failed to post incident" });
        console.log(err);
      } else if (result.length === 0) {
        res.status(400).json({ error: "User not found" });
      } else {
        // Insert the new incident
        const query = `INSERT INTO Incident (user_id, title, date, location) VALUES (?, ?, ?, ?)`;
        connection.query(
          query,
          [user_id, title, date, location],
          (err, result) => {
            if (err) {
              res.status(500).json({ error: "Failed to post incident" });
              console.log(err);
            } else {
              res.status(200).json({ message: "Incident posted successfully" });
            }
          }
        );
      }
    }
  );
});

// ------------ fetch all incidents ------------------
app.get("/incidents", (req, res) => {
  // Fetch all incidents with the corresponding user's username
  const query = `
      SELECT Incident.id, Incident.title, Incident.date, Incident.location, Incident.likes, Incident.dislikes, User.username
      FROM Incident
      JOIN User ON Incident.user_id = User.id
    `;
  connection.query(query, (err, result) => {
    if (err) {
      res.status(500).json({ error: "Failed to fetch incidents" });
      console.log(err);
    } else {
      res.status(200).json(result);
    }
  });
});

// -------------------- post an offer ----------------
app.post("/post-offer", (req, res) => {
  const { user_id, title, date, location, description } = req.body;

  // Check if the user exists in the database
  connection.query(
    "SELECT * FROM User WHERE id = ?",
    [user_id],
    (err, result) => {
      if (err) {
        res.status(500).json({ error: "Failed to post offer" });
        console.log(err);
      } else if (result.length === 0) {
        res.status(400).json({ error: "User not found" });
      } else {
        // Insert the new offer
        const query = `INSERT INTO Offer (user_id, title, date, location, description) VALUES (?, ?, ?, ?, ?)`;
        connection.query(
          query,
          [user_id, title, date, location, description],
          (err, result) => {
            if (err) {
              res.status(500).json({ error: "Failed to post offer" });
              console.log(err);
            } else {
              res.status(200).json({ message: "Offer posted successfully" });
            }
          }
        );
      }
    }
  );
});

// -------------------- fetch all offers ----------------
app.get("/offers", (req, res) => {
  const query = `
      SELECT o.id, o.title, o.date, o.location, o.description, u.username
      FROM Offer o
      JOIN User u ON o.user_id = u.id
  `;
  connection.query(query, (err, results) => {
      if (err) {
          res.status(500).json({ error: "Failed to fetch offers" });
          console.log(err);
      } else {
          res.status(200).json(results);
      }
  });
});


// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
