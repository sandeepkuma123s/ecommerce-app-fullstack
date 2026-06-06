function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Company */}
        <div className="footer-section">
          <h2 className="footer-logo">
            Shop<span>Ease</span>
          </h2>
          <p>
            Your trusted online shopping destination for electronics,
            fashion, grocery and lifestyle products.
          </p>
        </div>

        {/* Quick Links */}
        <div className="footer-section">
          <h3>Quick Links</h3>

          <a href="/">Home</a>
          <a href="/">Products</a>
          <a href="/">Categories</a>
          <a href="/cart">Cart</a>
        </div>

        {/* Customer Service */}
        <div className="footer-section">
          <h3>Customer Service</h3>

          <a href="/">Help Center</a>
          <a href="/">Track Order</a>
          <a href="/">Returns</a>
          <a href="/">Privacy Policy</a>
        </div>

        {/* Contact */}
        <div className="footer-section">
          <h3>Contact Us</h3>

          <p>📍 Hyderabad, India</p>
          <p>📧 support@shopease.com</p>
          <p>📞 +91 90144 81599</p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>
          © 2026 ShopEase. All Rights Reserved | Developed with ❤️ by
          Sandeep Kumar
        </p>
      </div>
    </footer>
  );
}

export default Footer;