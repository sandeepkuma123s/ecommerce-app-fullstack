import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
function Navbar({ search, setSearch, category, setCategory }) {
  const { cartCount } = useCart();
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };
  const { wishlistItems } = useWishlist();

  return (
    <header className="main-header">
      <div className="navbar">
        <Link to="/" className="logo">
          Shop<span>Ease</span>
        </Link>

        <div className="search-box">
          <select
            value={category || "All"}
            onChange={(e) => setCategory && setCategory(e.target.value)}
          >
            <option value="All">All Categories</option>
            <option value="Electronics">Electronics</option>
            <option value="Fashion">Fashion</option>
            <option value="Grocery">Grocery</option>
            <option value="Beauty">Beauty</option>
            <option value="Computers">Computers</option>
            <option value="Accessories">Accessories</option>
          </select>

          <input
            type="text"
            placeholder="Search mobiles, fashion, grocery..."
            value={search || ""}
            onChange={(e) => setSearch && setSearch(e.target.value)}
          />

          <button>Search</button>
        </div>

        <div className="nav-actions">
          {!user ? (
            <>
              <Link to="/login" className="login-link">
                👤 Login
              </Link>

              <Link to="/register" className="register-link">
                Register
              </Link>
            </>
          ) : (
            <>
              <div className="profile-mini">
                <div className="profile-avatar">
                  {user.name?.charAt(0).toUpperCase()}
                </div>

                <div>
                  <small>Hello</small>
                  <p>{user.name}</p>
                </div>
              </div>

              <Link
                to={user.role === "admin" ? "/admin" : "/dashboard"}
                className="dashboard-link"
              >
                Dashboard
              </Link>

              <button className="logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </>
          )}

          <Link to="/cart" className="cart-btn">
            🛒 Cart <span>{cartCount}</span>
          </Link>
          <Link to="/dashboard#wishlist" className="wishlist-nav">
  ❤️ Wishlist <span>{wishlistItems.length}</span>
</Link>
        </div>
      </div>
    </header>
  );
}

export default Navbar;