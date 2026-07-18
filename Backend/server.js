const express = require("express");
const cors = require("cors");
const pool = require("./db");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Home Route
app.get("/", (req, res) => {
  res.send("Welcome to ILikeIt Backend!");
});

// Get all roasts
app.get("/roasts", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM roasts");
    res.json(result.rows);
  } catch (error) {
    console.error("GET /roasts Error:", error.message);
    res.status(500).send("Server Error");
  }
});

// Add a new roast
app.post("/roasts", async (req, res) => {
  try {
    const { friend_name, category, roast } = req.body;

    const result = await pool.query(
      `INSERT INTO roasts (friend_name, category, roast)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [friend_name, category, roast]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("POST /roasts Error:", error.message);
    res.status(500).send("Server Error");
  }
});

// Update a roast
app.put("/roasts/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { friend_name, category, roast } = req.body;

    const result = await pool.query(
      `UPDATE roasts
       SET friend_name = $1,
           category = $2,
           roast = $3
       WHERE id = $4
       RETURNING *`,
      [friend_name, category, roast, id]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error("PUT /roasts Error:", error.message);
    res.status(500).send("Server Error");
  }
});

// Delete a roast
app.delete("/roasts/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query("DELETE FROM roasts WHERE id = $1", [id]);

    res.json({ message: "Roast deleted successfully!" });
  } catch (error) {
    console.error("DELETE /roasts Error:", error.message);
    res.status(500).send("Server Error");
  }
});

// Database Connection Test
pool.query(
  `
  SELECT table_name
  FROM information_schema.tables
  WHERE table_schema = 'public';
  `,
  (err, result) => {
    if (err) {
      console.error(err);
    } else {
      console.log("Tables in public schema:");
      console.table(result.rows);
    }
  }
);
// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});