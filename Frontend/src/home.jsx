import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

function Home() {
  const [roasts, setRoasts] = useState([]);
  const [friendName, setFriendName] = useState("");
  const [category, setCategory] = useState("");
  const [roast, setRoast] = useState("");
  const [editId, setEditId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRoasts();
  }, []);

  const fetchRoasts = async () => {
    try {
      const response = await fetch(`${API_URL}/roasts`);
      const data = await response.json();
      setRoasts(data);
    } catch (error) {
      console.error("💀 Error fetching roasts:", error);
    }
  };

  const addRoast = async (e) => {
    e.preventDefault();

    if (!friendName || !category || !roast) {
      alert("Hol' up... Please fill out all fields! 🤡");
      return;
    }

    try {
      const url = editId
        ? `${API_URL}/roasts/${editId}`
        : `${API_URL}/roasts`;

      const method = editId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          friend_name: friendName,
          category,
          roast,
        }),
      });

      const savedRoast = await response.json();
      const wasEditing = Boolean(editId);

      setFriendName("");
      setCategory("");
      setRoast("");
      setEditId(null);

      if (wasEditing) {
        // Editing happens in place, so just refresh the feed here.
        fetchRoasts();
      } else {
        // New roast: send the user straight to its own page.
        navigate(`/roast/${savedRoast.id}`);
      }
    } catch (error) {
      console.error("💀 Error saving roast:", error);
    }
  };

  const deleteRoast = async (id) => {
    const confirmDelete = window.confirm(
      "⚠️ Are you sure you want to delete this roast?\n\nThis action cannot be undone."
    );

    if (!confirmDelete) return;

    try {
      await fetch(`${API_URL}/roasts/${id}`, {
        method: "DELETE",
      });

      fetchRoasts();
    } catch (error) {
      console.error("💀 Error deleting roast:", error);
    }
  };

  const editRoast = (item) => {
    setFriendName(item.friend_name);
    setCategory(item.category);
    setRoast(item.roast);
    setEditId(item.id);
  };

  return (
    <div className="container">
      <header className="hero-section">
        <h1 className="title">
          <span className="gradient-text">ILikeIt</span>
        </h1>
        <p className="subtitle">The Ultimate Roast Vault. No Cap. 🧢</p>
      </header>

      <div className="card form-card">
        <h2>{editId ? "⚡ Cooking up an Update..." : "✍️ Drop a New Roast"}</h2>

        <form onSubmit={addRoast}>
          <div className="input-group">
            <input
              type="text"
              placeholder="Who are we violating? (Name)"
              value={friendName}
              onChange={(e) => setFriendName(e.target.value)}
            />
          </div>

          <div className="input-group">
            <input
              type="text"
              placeholder="Category (e.g., Cooking, Gaming, Outfits)"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
          </div>

          <div className="input-group">
            <textarea
              placeholder="Type your lethal roast here..."
              value={roast}
              onChange={(e) => setRoast(e.target.value)}
            ></textarea>
          </div>

          <button type="submit" className="btn-submit">
            {editId ? "Fix up, look sharp ✨" : "Send it! 🚀"}
          </button>
        </form>
      </div>

      <h2 className="section-title">The Burn Ward 🩺</h2>

      <div className="roasts-grid">
        {roasts.length === 0 ? (
          <p className="empty-state">It's quiet here... too quiet. 🏜️</p>
        ) : (
          roasts.map((item) => (
            <div className="roast-card" key={item.id}>
              <div className="roast-header">
                <Link to={`/roast/${item.id}`} className="roast-link">
                  <h3>@{item.friend_name}</h3>
                </Link>
                <span className="badge">{item.category}</span>
              </div>

              <div className="roast-body">
                <p>"{item.roast}"</p>
              </div>

              <div className="action-tray">
                <Link to={`/roast/${item.id}`} className="btn-action btn-view">
                  👀 View
                </Link>

                <button
                  type="button"
                  className="btn-action btn-hammer"
                  onClick={() => editRoast(item)}
                  title="Fix this roast"
                >
                  <span className="hammer-emoji">🔨</span> Fix It
                </button>

                <button
                  type="button"
                  className="btn-action btn-pacman"
                  onClick={() => deleteRoast(item.id)}
                  title="Delete this roast"
                >
                  <span className="pacman-track">
                    Consume
                  </span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Home;
