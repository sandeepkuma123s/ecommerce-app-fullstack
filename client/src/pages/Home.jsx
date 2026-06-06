import { useEffect, useState } from "react";
import TopBar from "../components/TopBar";
import Navbar from "../components/Navbar";
import CategoryMenu from "../components/CategoryMenu";
import HeroBanner from "../components/HeroBanner";
import FeaturedCategories from "../components/FeaturedCategories";
import ProductCard from "../components/ProductCard";
import Footer from "../components/Footer";
import API from "../api/api";
import { products as staticProducts } from "../data/products";

function Home() {
  const [products, setProducts] = useState(staticProducts);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await API.get("/products");

        if (res.data.length > 0) {
          const fixedProducts = res.data.map((item) => ({
            id: item._id,
            _id: item._id,
            name: item.name,
            description: item.description,
            price: item.price,
            image: item.image,
            category: item.category,
            rating: item.rating || 4.5,
            stock: item.stock,
          }));

          setProducts(fixedProducts);
        }
      } catch (error) {
        console.log("Products fetch failed, using static products");
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      category === "All" || product.category === category;

    return matchesSearch && matchesCategory;
  });

  return (
    <>
      <TopBar />

      <Navbar
        search={search}
        setSearch={setSearch}
        category={category}
        setCategory={setCategory}
      />

      <CategoryMenu />
      <HeroBanner />
      <FeaturedCategories />

      <section className="section">
        <div className="section-title">
          <h2>Best Selling Products</h2>
          <p>{filteredProducts.length} Products Found</p>
        </div>

        <div className="products">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <h2>No Products Found</h2>
          )}
        </div>
      </section>

      <Footer />
    </>
  );
}

export default Home;