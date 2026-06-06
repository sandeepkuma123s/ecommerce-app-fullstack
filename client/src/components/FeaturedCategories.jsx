import { categories } from "../data/products";

function FeaturedCategories() {
  return (
    <section className="section">
      <div className="section-title">
        <h2>Featured Categories</h2>
        <p>View All</p>
      </div>

      <div className="category-grid">
        {categories.map((cat) => (
          <div className="category-card" key={cat.name}>
            <img src={cat.image} alt={cat.name} />
            <h3>{cat.name}</h3>
          </div>
        ))}
      </div>
    </section>
  );
}

export default FeaturedCategories;