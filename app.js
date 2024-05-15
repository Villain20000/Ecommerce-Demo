// Require Express
const express = require("express");
// Require the PostgreSQL pool module
const { Pool } = require("pg");

// Set up your database connection details
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "world",
  password: "postgres",
  port: 5432,
});

// Create an instance of express
const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Serve static files from public directory
app.use(express.static("public"));

// Endpoint to fetch all products from the database
app.get("/products", async (req, res) => {
  try {
    const productsQuery = "SELECT * FROM products"; // Adjust the query as needed
    const { rows } = await pool.query(productsQuery);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
