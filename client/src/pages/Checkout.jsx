import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useCart } from "../context/CartContext";
import API from "../api/api";

function Checkout() {
  const navigate = useNavigate();
  const { cartItems, totalAmount, clearCart } = useCart();

  const [address, setAddress] = useState({
    fullName: "",
    phone: "",
    city: "",
    state: "",
    pincode: "",
    addressLine: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");

  const handleChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const placeOrder = async (e) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      alert("Cart is empty");
      return;
    }

    try {
      const orderProducts = cartItems.map((item) => ({
        product: String(item._id || item.id),
        name: item.name,
        image: item.image,
        price: Number(item.price),
        quantity: Number(item.quantity),
      }));

      await API.post("/orders", {
        products: orderProducts,
        totalAmount: Number(totalAmount + 99),
        shippingAddress: {
          ...address,
          paymentMethod,
        },
      });

      alert(`${paymentMethod} order placed successfully ✅`);
      clearCart();
      navigate("/order-success");
    } catch (error) {
      console.log("CHECKOUT ERROR:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Order failed");
    }
  };

  return (
    <>
      <Navbar />

      <section className="checkout-page">
        <h1>Checkout</h1>

        <div className="checkout-layout">
          <form className="checkout-form" onSubmit={placeOrder}>
            <h2>Shipping Address</h2>

            <input
              name="fullName"
              placeholder="Full Name"
              value={address.fullName}
              onChange={handleChange}
              required
            />

            <input
              name="phone"
              placeholder="Phone Number"
              value={address.phone}
              onChange={handleChange}
              required
            />

            <input
              name="city"
              placeholder="City"
              value={address.city}
              onChange={handleChange}
              required
            />

            <input
              name="state"
              placeholder="State"
              value={address.state}
              onChange={handleChange}
              required
            />

            <input
              name="pincode"
              placeholder="Pincode"
              value={address.pincode}
              onChange={handleChange}
              required
            />

            <textarea
              name="addressLine"
              placeholder="Full Address"
              value={address.addressLine}
              onChange={handleChange}
              required
            />

            <h2>Payment Method</h2>

            <div className="payment-options">
              {["Cash on Delivery", "UPI Demo", "Card Demo"].map((method) => (
                <label
                  key={method}
                  className={`payment-card ${
                    paymentMethod === method ? "selected-payment" : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === method}
                    onChange={() => setPaymentMethod(method)}
                  />

                  <div>
                    <h3>
                      {method === "Cash on Delivery" && "💵 Cash on Delivery"}
                      {method === "UPI Demo" && "📱 UPI Payment Demo"}
                      {method === "Card Demo" && "💳 Card Payment Demo"}
                    </h3>

                    <p>
                      {method === "Cash on Delivery" &&
                        "Pay when your product is delivered."}
                      {method === "UPI Demo" &&
                        "Demo UPI payment option for project showcase."}
                      {method === "Card Demo" &&
                        "Demo card payment option for UI experience."}
                    </p>
                  </div>
                </label>
              ))}
            </div>

            {paymentMethod === "UPI Demo" && (
              <div className="demo-payment-box">
                <h3>UPI Demo</h3>
                <input placeholder="Enter UPI ID e.g. sandeep@upi" />
              </div>
            )}

            {paymentMethod === "Card Demo" && (
              <div className="demo-payment-box">
                <h3>Card Demo</h3>
                <input placeholder="Card Number" />
                <div className="card-row">
                  <input placeholder="MM/YY" />
                  <input placeholder="CVV" />
                </div>
              </div>
            )}

            <button type="submit">Place Order</button>
          </form>

          <div className="checkout-summary">
            <h2>Order Summary</h2>

            {cartItems.map((item) => (
              <div className="checkout-item" key={item.id || item._id}>
                <img src={item.image} alt={item.name} />

                <div>
                  <h4>{item.name}</h4>
                  <p>Qty: {item.quantity}</p>
                  <p>
                    ₹
                    {(Number(item.price) * Number(item.quantity)).toLocaleString(
                      "en-IN"
                    )}
                  </p>
                </div>
              </div>
            ))}

            <hr />

            <p>Subtotal: ₹{totalAmount.toLocaleString("en-IN")}</p>
            <p>Shipping: ₹99</p>
            <p>Payment: {paymentMethod}</p>

            <h3>Total: ₹{(totalAmount + 99).toLocaleString("en-IN")}</h3>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

export default Checkout;