import "./Sidebar.css";
import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="logo-section">
        <div className="logo-icon">🔥</div>

        <div>
          <h1 className="logo-title">
            I<span>LikeIt</span>
          </h1>

          <p className="logo-subtitle">Roast Vault</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">

<Link to="/" className="nav-item active">
  <span>🏠</span>
  Home
</Link>

<Link to="/vault" className="nav-item">
  <span>🔥</span>
  Roast Vault
</Link>

        <button className="nav-item">
          <span>🔥</span>
          Trending
        </button>

        <button className="nav-item">
          <span>⭐</span>
          Top Rated
        </button>

        <button className="nav-item">
          <span>🏆</span>
          Leaderboard
        </button>

        <button className="nav-item">
          <span>📂</span>
          Categories
        </button>

        <button className="nav-item">
          <span>👤</span>
          Profile
        </button>

      </nav>

      {/* Bottom Card */}
      <div className="sidebar-footer">

        <div className="footer-emoji">😂</div>

        <h3>Roast Mode</h3>

        <p>
          Drop your funniest roasts,
          earn likes,
          climb the leaderboard.
        </p>

      </div>
    </aside>
  );
}

export default Sidebar;