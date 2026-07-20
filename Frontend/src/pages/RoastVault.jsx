import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

function RoastVault() {
  const [roasts, setRoasts] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [friendName, setFriendName] = useState("");
  const [category, setCategory] = useState("");
  const [roastText, setRoastText] = useState("");

  // Comments
  const [comments, setComments] = useState({});
  const [username, setUsername] = useState({});
  const [commentText, setCommentText] = useState({});

  useEffect(() => {
    fetchRoasts();
  }, []);

  const fetchRoasts = async () => {
    try {
      const res = await fetch(`${API_URL}/roasts`);
      const data = await res.json();
      setRoasts(data);

      data.forEach((roast) => {
        fetchComments(roast.id);
      });
    } catch (err) {
      console.error(err);
    }
  };

  const fetchComments = async (id) => {
    try {
      const res = await fetch(`${API_URL}/roasts/${id}/comments`);
      const data = await res.json();

      setComments((prev) => ({
        ...prev,
        [id]: data,
      }));
    } catch (err) {
      console.error(err);
    }
  };

  const addComment = async (id) => {
    if (!username[id] || !commentText[id]) return;

    try {
      await fetch(`${API_URL}/roasts/${id}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username[id],
          comment: commentText[id],
        }),
      });

      setUsername((prev) => ({
        ...prev,
        [id]: "",
      }));

      setCommentText((prev) => ({
        ...prev,
        [id]: "",
      }));

      fetchComments(id);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteRoast = async (id) => {
    if (!window.confirm("Delete this roast?")) return;

    await fetch(`${API_URL}/roasts/${id}`, {
      method: "DELETE",
    });

    fetchRoasts();
  };

  const likeRoast = async (id) => {
    await fetch(`${API_URL}/roasts/${id}/like`, {
      method: "PATCH",
    });

    fetchRoasts();
  };

  const dislikeRoast = async (id) => {
    await fetch(`${API_URL}/roasts/${id}/dislike`, {
      method: "PATCH",
    });

    fetchRoasts();
  };

  const startEdit = (roast) => {
    setEditingId(roast.id);
    setFriendName(roast.friend_name);
    setCategory(roast.category);
    setRoastText(roast.roast);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const updateRoast = async (e) => {
    e.preventDefault();

    await fetch(`${API_URL}/roasts/${editingId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        friend_name: friendName,
        category,
        roast: roastText,
      }),
    });

    setEditingId(null);
    setFriendName("");
    setCategory("");
    setRoastText("");

    fetchRoasts();
  };

  return (
    <div className="container">
      <h1 className="section-title">🔥 Roast Vault</h1>

      {editingId && (
        <div className="card">
          <h2>Edit Roast</h2>

          <form onSubmit={updateRoast}>
            <div className="input-group">
              <input
                value={friendName}
                onChange={(e) => setFriendName(e.target.value)}
                placeholder="Friend Name"
              />
            </div>

            <div className="input-group">
              <input
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Category"
              />
            </div>

            <div className="input-group">
              <textarea
                rows="4"
                value={roastText}
                onChange={(e) => setRoastText(e.target.value)}
              />
            </div>

            <button className="btn-submit">
              💾 Update Roast
            </button>
          </form>
        </div>
      )}

      <div className="roasts-grid">
        {roasts.map((roast) => (
          <div className="roast-card" key={roast.id}>
            <div className="roast-header">
              <h3>👤 {roast.friend_name}</h3>

              <span className="badge">
                {roast.category}
              </span>
            </div>

            <div className="roast-body">
              <p>{roast.roast}</p>
            </div>

            {/* Like / Dislike */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "20px",
                marginBottom: "15px",
              }}
            >
              <button
                style={{
                  background: "none",
                  border: "none",
                  color: "white",
                  cursor: "pointer",
                  fontSize: "17px",
                }}
                onClick={() => likeRoast(roast.id)}
              >
                👍 {roast.likes}
              </button>

              <button
                style={{
                  background: "none",
                  border: "none",
                  color: "white",
                  cursor: "pointer",
                  fontSize: "17px",
                }}
                onClick={() => dislikeRoast(roast.id)}
              >
                👎 {roast.dislikes}
              </button>

              <span style={{ fontSize: "17px" }}>
                💬 {comments[roast.id]?.length || 0}
              </span>
            </div>

            {/* Buttons */}
            <div className="action-tray">
              <button
                className="btn-action btn-hammer"
                onClick={() => startEdit(roast)}
              >
                ✏️ Edit
              </button>

              <button
                className="btn-action btn-pacman"
                onClick={() => deleteRoast(roast.id)}
              >
                🗑 Delete
              </button>
            </div>

            <hr
              style={{
                margin: "20px 0",
                borderColor: "#334155",
              }}
            />

            {/* Comments */}
            <h4 style={{ marginBottom: "12px" }}>
              💬 Comments
            </h4>

            {(comments[roast.id] || []).map((comment) => (
              <div
                key={comment.id}
                style={{
                  background: "#334155",
                  padding: "10px",
                  borderRadius: "8px",
                  marginBottom: "10px",
                }}
              >
                <strong>{comment.username}</strong>

                <p style={{ marginTop: "5px" }}>
                  {comment.comment}
                </p>
              </div>
            ))}

            <div className="input-group">
              <input
                placeholder="Your Name"
                value={username[roast.id] || ""}
                onChange={(e) =>
                  setUsername({
                    ...username,
                    [roast.id]: e.target.value,
                  })
                }
              />
            </div>

            <div className="input-group">
              <textarea
                rows="2"
                placeholder="Write a comment..."
                value={commentText[roast.id] || ""}
                onChange={(e) =>
                  setCommentText({
                    ...commentText,
                    [roast.id]: e.target.value,
                  })
                }
              />
            </div>

            <button
              className="btn-submit"
              onClick={() => addComment(roast.id)}
            >
              Post Comment
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RoastVault;