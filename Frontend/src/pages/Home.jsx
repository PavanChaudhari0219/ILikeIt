import { useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

function Home() {
  const [friendName, setFriendName] = useState("");
  const [category, setCategory] = useState("");
  const [roast, setRoast] = useState("");

  const addRoast = async (e) => {
    e.preventDefault();

    if (!friendName || !category || !roast) {
      alert("Please fill all fields!");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/roasts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          friend_name: friendName,
          category,
          roast,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to add roast");
      }

      alert("🔥 Roast Added!");

      setFriendName("");
      setCategory("");
      setRoast("");
    } catch (err) {
      console.error(err);
      alert("Something went wrong!");
    }
  };

  return (
    <div className="container">
      <header className="hero-section">
        <h1 className="title">
          <span className="gradient-text">ILikeIt</span>
        </h1>

        <p className="subtitle">
          The Ultimate Roast Vault. No Cap. 🧢
        </p>
      </header>

      <div className="card form-card">
        <h2>✍️ Add New Roast</h2>

        <form onSubmit={addRoast}>
          <div className="input-group">
            <label>Friend Name</label>

            <input
              type="text"
              placeholder="Enter Friend Name"
              value={friendName}
              onChange={(e) => setFriendName(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label>Category</label>

            <input
              type="text"
              placeholder="Political, Dark, Savage..."
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label>Roast</label>

            <textarea
              rows="5"
              placeholder="Write your masterpiece..."
              value={roast}
              onChange={(e) => setRoast(e.target.value)}
            />
          </div>

          <button className="btn-submit" type="submit">
            🚀 Submit Roast
          </button>
        </form>
      </div>
    </div>
  );
}

export default Home;