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
    const result = await pool.query(
      "SELECT * FROM roasts ORDER BY id DESC"
    );
    res.json(result.rows);
  } catch (error) {
    console.error("GET /roasts Error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Add Roast
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
    console.error("POST Error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Update Roast
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
    console.error("PUT Error:", error);
    res.status(500).json({ error: error.message });
  }
});

// 👍 Like Roast
app.patch("/roasts/:id/like", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `UPDATE roasts
       SET likes = likes + 1
       WHERE id = $1
       RETURNING *`,
      [id]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error("LIKE Error:", error);
    res.status(500).json({ error: error.message });
  }
});

// 👎 Dislike Roast
app.patch("/roasts/:id/dislike", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `UPDATE roasts
       SET dislikes = dislikes + 1
       WHERE id = $1
       RETURNING *`,
      [id]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error("DISLIKE Error:", error);
    res.status(500).json({ error: error.message });
  }
});
// 💬 Get Comments for a Roast
app.get("/roasts/:id/comments", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT * FROM comments
       WHERE roast_id = $1
       ORDER BY created_at ASC`,
      [id]
    );

    res.json(result.rows);
  } catch (error) {
    console.error("GET COMMENTS Error:", error);
    res.status(500).json({ error: error.message });
  }
});

// 💬 Add Comment
app.post("/roasts/:id/comments", async (req, res) => {
  try {
    const { id } = req.params;
    const { username, comment } = req.body;

    const result = await pool.query(
      `INSERT INTO comments (roast_id, username, comment)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [id, username, comment]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("POST COMMENT Error:", error);
    res.status(500).json({ error: error.message });
  }
});
// Delete Roast
app.delete("/roasts/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query(
      "DELETE FROM roasts WHERE id = $1",
      [id]
    );

    res.json({ message: "Deleted successfully" });
  } catch (error) {
    console.error("DELETE Error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Start Server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});