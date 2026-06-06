import { useEffect, useState } from "react";

const banners = [
  {
    tag: "Mega Electronics Sale",
    title: "Up to 60% Off",
    text: "Mobiles, laptops, headphones and smart gadgets at best prices.",
    image:
      "https://images.unsplash.com/photo-1556740749-887f6717d7e4?w=1600",
  },
  {
    tag: "Fashion Festival",
    title: "Flat 50% Off",
    text: "Trending outfits, shoes and lifestyle collections.",
    image:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1600",
  },
  {
    tag: "Grocery Super Saver",
    title: "Fresh Deals Daily",
    text: "Save more on fruits, vegetables and daily essentials.",
    image:
      "https://images.unsplash.com/photo-1542838132-92c53300491e?w=1600",
  },
  {
    tag: "Beauty Collection",
    title: "Up to 40% Off",
    text: "Skincare, perfumes and premium beauty products.",
    image:
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1600",
  },
];

function HeroBanner() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  const banner = banners[current];

  return (
    <section className="hero">
      <div
        className="hero-bg"
        style={{ backgroundImage: `url(${banner.image})` }}
      ></div>

      <div className="hero-content">
        <span>{banner.tag}</span>
        <h1>{banner.title}</h1>
        <p>{banner.text}</p>
        <button>Shop Now</button>
      </div>

      <div className="hero-dots">
        {banners.map((_, index) => (
          <button
            key={index}
            className={current === index ? "active-dot" : ""}
            onClick={() => setCurrent(index)}
          ></button>
        ))}
      </div>
    </section>
  );
}

export default HeroBanner;