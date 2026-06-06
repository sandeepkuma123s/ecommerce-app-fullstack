import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();

  return (
    <div className="product-card">
      <button
        className="wishlist-btn"
        onClick={() => toggleWishlist(product)}
      >
        {isWishlisted(product.id) ? "❤️" : "🤍"}
      </button>

      <Link to={`/product/${product.id}`} className="product-img-box">
        <img src={product.image} alt={product.name} />
      </Link>

      <div className="product-info">
        <span className="product-category">{product.category}</span>
        <h3>{product.name}</h3>

        <div className="rating-row">
          ⭐ {product.rating}
          <span className="reviews">(125 Reviews)</span>
        </div>

        <div className="price-section">
          <span className="old-price">
            ₹{Math.floor(product.price * 1.2).toLocaleString("en-IN")}
          </span>
          <h2>₹{product.price.toLocaleString("en-IN")}</h2>
        </div>

        <button className="cart-button" onClick={() => addToCart(product)}>
          Add To Cart
        </button>
      </div>
    </div>
  );
}

export default ProductCard;