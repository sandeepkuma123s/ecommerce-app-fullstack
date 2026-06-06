function CategoryMenu() {
  const items = ["Home", "Electronics", "Fashion", "Grocery", "Beauty", "Deals", "New Arrivals"];

  return (
    <div className="category-menu">
      {items.map((item) => (
        <a key={item} href="/">{item}</a>
      ))}
    </div>
  );
}

export default CategoryMenu;