import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";

import { products as staticProducts } from "../data/products";
import { useCart } from "../context/CartContext";
import API from "../api/api";

function ProductDetails() {
  const { id } = useParams();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [allProducts, setAllProducts] = useState(staticProducts);

  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    comment: "",
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await API.get("/products");

        const mongoProducts = res.data.map((item) => ({
          id: item._id,
          _id: item._id,
          name: item.name,
          description: item.description,
          price: item.price,
          image: item.image,
          category: item.category,
          rating: item.rating || 4.5,
          stock: item.stock,
          reviews: item.reviews || [],
        }));

        setAllProducts(mongoProducts);

        const foundProduct = mongoProducts.find((item) => item.id === id);
        setProduct(foundProduct);
      } catch (error) {
        const foundProduct = staticProducts.find(
          (item) => item.id === Number(id)
        );

        setProduct(foundProduct);
      }
    };

    fetchProduct();
  }, [id]);

  const submitReview = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login to add review");
      return;
    }

    try {
      const res = await API.post(`/products/${product._id || product.id}/reviews`, {
        rating: Number(reviewForm.rating),
        comment: reviewForm.comment,
      });

      alert("Review added successfully");

      setProduct({
        ...product,
        reviews: res.data.reviews,
        rating: res.data.rating,
      });

      setReviewForm({
        rating: 5,
        comment: "",
      });
    } catch (error) {
      alert(error.response?.data?.message || "Review failed");
    }
  };

  if (!product) {
    return (
      <>
        <Navbar />
        <div className="product-not-found">
          <h2>Product not found</h2>
          <Link to="/">Go Back Home</Link>
        </div>
        <Footer />
      </>
    );
  }

  const relatedProducts = allProducts
    .filter(
      (item) => item.category === product.category && item.id !== product.id
    )
    .slice(0, 4);

  return (
    <>
      <Navbar />

      <section className="details-page">
        <div className="details-image">
          <img src={product.image} alt={product.name} />
        </div>

        <div className="details-info">
          <p className="product-category">{product.category}</p>

          <h1>{product.name}</h1>

          <div className="rating-row">
            ⭐ {Number(product.rating || 4.5).toFixed(1)}
            <span className="reviews">
              ({product.reviews?.length || 0} Reviews)
            </span>
          </div>

          <div className="details-price">
            <span>
              ₹{Math.floor(product.price * 1.2).toLocaleString("en-IN")}
            </span>
            <h2>₹{product.price.toLocaleString("en-IN")}</h2>
          </div>

          <p className="details-desc">
            {product.description ||
              "This is a premium quality product with fast delivery, secure checkout, trusted seller support, and easy return policy. Perfect for daily use."}
          </p>

          <div className="details-offers">
            <h3>Available Offers</h3>
            <p>✅ 10% instant discount on selected bank cards</p>
            <p>✅ Free delivery on orders above ₹999</p>
            <p>✅ 7 days easy replacement policy</p>
          </div>

          <div className="details-actions">
            <button onClick={() => addToCart(product)}>Add To Cart</button>
            <Link to="/checkout">Buy Now</Link>
          </div>
        </div>
      </section>

      <section className="reviews-section">
        <div className="section-title">
          <h2>Customer Reviews</h2>
          <p>{product.reviews?.length || 0} Reviews</p>
        </div>

        <form className="review-form" onSubmit={submitReview}>
          <select
            value={reviewForm.rating}
            onChange={(e) =>
              setReviewForm({ ...reviewForm, rating: e.target.value })
            }
          >
            <option value="5">⭐⭐⭐⭐⭐ 5</option>
            <option value="4">⭐⭐⭐⭐ 4</option>
            <option value="3">⭐⭐⭐ 3</option>
            <option value="2">⭐⭐ 2</option>
            <option value="1">⭐ 1</option>
          </select>

          <textarea
            placeholder="Write your review..."
            value={reviewForm.comment}
            onChange={(e) =>
              setReviewForm({ ...reviewForm, comment: e.target.value })
            }
            required
          />

          <button type="submit">Submit Review</button>
        </form>

        <div className="reviews-list">
          {product.reviews?.length > 0 ? (
            product.reviews.map((review, index) => (
              <div className="review-card" key={index}>
                <h4>{review.user}</h4>
                <p>{"⭐".repeat(Number(review.rating))}</p>
                <span>{review.comment}</span>
              </div>
            ))
          ) : (
            <p>No reviews yet. Be the first to review this product.</p>
          )}
        </div>
      </section>

      <section className="section">
        <div className="section-title">
          <h2>Related Products</h2>
          <p>Similar items</p>
        </div>

        <div className="products">
          {relatedProducts.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
      </section>

      <Footer />
    </>
  );
}

export default ProductDetails;