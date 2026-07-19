import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

function RoastDetail() {
  const { id } = useParams();
  const [roast, setRoast] = useState(null);
  const [status, setStatus] = useState("loading"); // loading | ready | not-found | error

  useEffect(() => {
    let cancelled = false;

    const fetchRoast = async () => {
      setStatus("loading");
      try {
        const response = await fetch(`${API_URL}/roasts/${id}`);

        if (response.status === 404) {
          if (!cancelled) setStatus("not-found");
          return;
        }

        if (!response.ok) {
          if (!cancelled) setStatus("error");
          return;
        }

        const data = await response.json();
        if (!cancelled) {
          setRoast(data);
          setStatus("ready");
        }
      } catch (error) {
        console.error("💀 Error fetching roast:", error);
        if (!cancelled) setStatus("error");
      }
    };

    fetchRoast();

    return () => {
      cancelled = true;
    };
  }, [id]);

  return (
    <div className="container">
      <header className="hero-section">
        <h1 className="title">
          <span className="gradient-text">ILikeIt</span>
        </h1>
        <p className="subtitle">The Ultimate Roast Vault. No Cap. 🧢</p>
      </header>

      <Link to="/" className="back-link">
        ← Back to the Vault
      </Link>

      {status === "loading" && (
        <p className="empty-state">Digging this one up... 🕵️</p>
      )}

      {status === "not-found" && (
        <p className="empty-state">
          This roast got deleted or never existed. Savage, but fair. 💀
        </p>
      )}

      {status === "error" && (
        <p className="empty-state">
          Something broke fetching this roast. Try again in a bit.
        </p>
      )}

      {status === "ready" && roast && (
        <div className="card roast-detail-card">
          <div className="roast-header">
            <h3>@{roast.friend_name}</h3>
            <span className="badge">{roast.category}</span>
          </div>

          <div className="roast-body">
            <p className="roast-detail-text">"{roast.roast}"</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default RoastDetail;
