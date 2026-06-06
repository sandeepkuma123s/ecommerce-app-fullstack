import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import API from "../api/api";

function UserDashboard() {
  const navigate = useNavigate();
  const { cartItems, totalAmount } = useCart();
  const { wishlistItems, removeFromWishlist } = useWishlist();

  const [orders, setOrders] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchOrders = async () => {
      try {
        const res = await API.get("/orders/my-orders");
        setOrders(res.data);
      } catch (error) {
        console.log("ORDERS FETCH ERROR:", error.response?.data || error.message);
      }
    };

    fetchOrders();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const getStepClass = (orderStatus, step) => {
    const steps = ["Pending", "Processing", "Shipped", "Delivered"];
    const currentIndex = steps.indexOf(orderStatus);
    const stepIndex = steps.indexOf(step);

    return stepIndex <= currentIndex ? "active-step" : "";
  };

  if (!user) return null;

  const totalSpent = orders.reduce(
    (sum, order) => sum + Number(order.totalAmount || 0),
    0
  );

  return (
    <>
      <Navbar />

      <section className="dashboard-page">
        <aside className="dashboard-sidebar">
          <div className="dashboard-profile">
            <div className="dashboard-avatar">
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <h3>{user.name.split(" ").slice(0, 2).join(" ")}</h3>
            <p>{user.email}</p>
          </div>

          <a href="#overview">🏠 Overview</a>
          <a href="#orders">📦 My Orders</a>
          <a href="#wishlist">❤️ Wishlist</a>
          <a href="#address">📍 Address</a>
          <button onClick={handleLogout}>Logout</button>
        </aside>

        <main className="dashboard-content">
          <div className="dashboard-header" id="overview">
            <h1>Welcome Back, {user.name.split(" ")[0]} 👋</h1>
            <p>Manage your orders, wishlist, cart and account details.</p>
          </div>

          <div className="dashboard-stats">
            <div className="dash-card">
              <h3>{orders.length}</h3>
              <p>Total Orders</p>
            </div>

            <div className="dash-card">
              <h3>₹{totalSpent.toLocaleString("en-IN")}</h3>
              <p>Total Spent</p>
            </div>

            <div className="dash-card">
              <h3>{wishlistItems.length}</h3>
              <p>Wishlist</p>
            </div>

            <div className="dash-card">
              <h3>{cartItems.length}</h3>
              <p>Cart Items</p>
            </div>
          </div>

          <div className="dashboard-box full-box" id="orders">
            <div className="box-title">
              <h2>My Orders</h2>
              <Link to="/">Continue Shopping</Link>
            </div>

            {orders.length === 0 ? (
              <div className="no-orders">
                <h3>No orders found</h3>
                <p>Start shopping and place your first order.</p>
                <Link to="/">Shop Now</Link>
              </div>
            ) : (
              <div className="orders-list">
                {orders.map((order) => (
                  <div className="real-order-card" key={order._id}>
                    <div className="order-top">
                      <div>
                        <h3>Order #{order._id.slice(-6).toUpperCase()}</h3>
                        <p>
                          Placed on{" "}
                          {new Date(order.createdAt).toLocaleDateString("en-IN")}
                        </p>
                      </div>

                      <span className={`status-badge ${order.status.toLowerCase()}`}>
                        {order.status}
                      </span>
                    </div>

                    <div className="order-products">
                      {order.products.map((item, index) => (
                        <div className="order-product" key={index}>
                          <img src={item.image} alt={item.name} />

                          <div>
                            <h4>{item.name}</h4>
                            <p>Qty: {item.quantity}</p>
                            <p>
                              Price: ₹
                              {Number(item.price).toLocaleString("en-IN")}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="tracking-timeline">
                      {["Pending", "Processing", "Shipped", "Delivered"].map(
                        (step) => (
                          <div
                            className={`tracking-step ${getStepClass(
                              order.status,
                              step
                            )}`}
                            key={step}
                          >
                            <div className="step-circle"></div>
                            <p>{step}</p>
                          </div>
                        )
                      )}
                    </div>

                    <div className="order-bottom">
                      <div>
                        <p>
                          <b>Payment:</b>{" "}
                          {order.shippingAddress?.paymentMethod ||
                            "Cash on Delivery"}
                        </p>
                        <p>
                          <b>Delivery:</b>{" "}
                          {order.shippingAddress?.city},{" "}
                          {order.shippingAddress?.state}
                        </p>
                      </div>

                      <h3>
                        ₹{Number(order.totalAmount).toLocaleString("en-IN")}
                      </h3>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="dashboard-box full-box" id="wishlist">
            <div className="box-title">
              <h2>My Wishlist</h2>
              <p>{wishlistItems.length} saved</p>
            </div>

            {wishlistItems.length === 0 ? (
              <div className="no-orders">
                <h3>No wishlist items yet</h3>
                <p>Save your favorite products to view them here.</p>
                <Link to="/">Explore Products</Link>
              </div>
            ) : (
              <div className="wishlist-grid">
                {wishlistItems.map((item) => (
                  <div className="wishlist-card" key={item.id}>
                    <img src={item.image} alt={item.name} />

                    <div>
                      <h4>{item.name}</h4>
                      <p>{item.category}</p>
                      <h3>₹{item.price.toLocaleString("en-IN")}</h3>
                    </div>

                    <button onClick={() => removeFromWishlist(item.id)}>
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="dashboard-grid two-boxes">
            <div className="dashboard-box" id="address">
              <div className="box-title">
                <h2>Saved Address</h2>
                <p>Default</p>
              </div>

              {orders[0]?.shippingAddress ? (
                <p className="address-text">
                  {orders[0].shippingAddress.addressLine} <br />
                  {orders[0].shippingAddress.city},{" "}
                  {orders[0].shippingAddress.state} -{" "}
                  {orders[0].shippingAddress.pincode} <br />
                  Phone: {orders[0].shippingAddress.phone}
                </p>
              ) : (
                <p className="address-text">No address saved yet.</p>
              )}
            </div>

            <div className="dashboard-box">
              <div className="box-title">
                <h2>Account Info</h2>
                <p>Profile</p>
              </div>

              <p>
                <b>Name:</b> {user.name}
              </p>
              <p>
                <b>Email:</b> {user.email}
              </p>
              <p>
                <b>Role:</b> {user.role}
              </p>
              <p>
                <b>Cart Value:</b> ₹{totalAmount.toLocaleString("en-IN")}
              </p>
            </div>
          </div>
        </main>
      </section>

      <Footer />
    </>
  );
}

export default UserDashboard;