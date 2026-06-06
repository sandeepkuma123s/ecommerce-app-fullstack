import { Link } from "react-router-dom";

function OrderSuccess() {
  return (
    <div className="success-page">
      <div className="success-card">
        <div className="success-icon">✅</div>
        <h1>Order Placed Successfully!</h1>
        <p>Your order has been confirmed and saved in MongoDB.</p>

        <div className="success-actions">
          <Link to="/dashboard">View My Orders</Link>
          <Link to="/">Continue Shopping</Link>
        </div>
      </div>
    </div>
  );
}

export default OrderSuccess;