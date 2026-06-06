import { useEffect, useState } from "react";
import API from "../api/api";

function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);

  const [editingId, setEditingId] = useState(null);

  const [productForm, setProductForm] = useState({
    name: "",
    description: "",
    price: "",
    image: "",
    category: "",
    stock: "",
  });

  useEffect(() => {
    fetchOrders();
    fetchProducts();
  }, []);

  const fetchOrders = async () => {
    const res = await API.get("/orders");
    setOrders(res.data);
  };

  const fetchProducts = async () => {
    const res = await API.get("/products");
    setProducts(res.data);
  };

  const handleChange = (e) => {
    setProductForm({
      ...productForm,
      [e.target.name]: e.target.value,
    });
  };

  const resetForm = () => {
    setEditingId(null);
    setProductForm({
      name: "",
      description: "",
      price: "",
      image: "",
      category: "",
      stock: "",
    });
  };

  const submitProduct = async (e) => {
    e.preventDefault();

    const payload = {
      ...productForm,
      price: Number(productForm.price),
      stock: Number(productForm.stock),
    };

    if (editingId) {
      await API.put(`/products/${editingId}`, payload);
      alert("Product updated successfully");
    } else {
      await API.post("/products", payload);
      alert("Product added successfully");
    }

    resetForm();
    fetchProducts();
  };

  const startEdit = (product) => {
    setEditingId(product._id);

    setProductForm({
      name: product.name || "",
      description: product.description || "",
      price: product.price || "",
      image: product.image || "",
      category: product.category || "",
      stock: product.stock || "",
    });

    window.scrollTo({
      top: 250,
      behavior: "smooth",
    });
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }

    await API.delete(`/products/${id}`);
    fetchProducts();
  };

  const updateStatus = async (id, status) => {
    await API.put(`/orders/${id}`, { status });
    fetchOrders();
  };

  const revenue = orders.reduce(
    (sum, order) => sum + Number(order.totalAmount || 0),
    0
  );

  return (
    <div className="admin-page">
      <h1>Admin Dashboard</h1>

      <div className="admin-stats">
        <div className="admin-card">
          <h2>{products.length}</h2>
          <p>Total Products</p>
        </div>

        <div className="admin-card">
          <h2>{orders.length}</h2>
          <p>Total Orders</p>
        </div>

        <div className="admin-card">
          <h2>₹{revenue.toLocaleString("en-IN")}</h2>
          <p>Total Revenue</p>
        </div>
      </div>

      <div className="admin-section">
        <div className="admin-form-title">
          <h2>{editingId ? "Edit Product" : "Add New Product"}</h2>

          {editingId && (
            <button className="cancel-edit-btn" onClick={resetForm}>
              Cancel Edit
            </button>
          )}
        </div>

        <form className="admin-product-form" onSubmit={submitProduct}>
          <input
            name="name"
            placeholder="Product Name"
            value={productForm.name}
            onChange={handleChange}
            required
          />

          <input
            name="price"
            placeholder="Price"
            value={productForm.price}
            onChange={handleChange}
            required
          />

          <input
            name="category"
            placeholder="Category"
            value={productForm.category}
            onChange={handleChange}
            required
          />

          <input
            name="stock"
            placeholder="Stock"
            value={productForm.stock}
            onChange={handleChange}
            required
          />

          <input
            name="image"
            placeholder="Image URL"
            value={productForm.image}
            onChange={handleChange}
            required
          />

          <textarea
            name="description"
            placeholder="Description"
            value={productForm.description}
            onChange={handleChange}
            required
          />

          <button type="submit">
            {editingId ? "Update Product" : "Add Product"}
          </button>
        </form>
      </div>

      <div className="admin-section">
        <h2>Manage Products</h2>

        <table>
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Price</th>
              <th>Category</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {products.map((product) => (
              <tr key={product._id}>
                <td>
                  <img
                    src={product.image}
                    alt={product.name}
                    className="admin-product-img"
                  />
                </td>

                <td>{product.name}</td>
                <td>₹{Number(product.price).toLocaleString("en-IN")}</td>
                <td>{product.category}</td>
                <td>{product.stock}</td>

                <td>
                  <div className="admin-actions">
                    <button
                      className="edit-btn"
                      onClick={() => startEdit(product)}
                    >
                      Edit
                    </button>

                    <button
                      className="delete-btn"
                      onClick={() => deleteProduct(product._id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="admin-section">
        <h2>Manage Orders</h2>

        <table>
          <thead>
            <tr>
              <th>User</th>
              <th>Total</th>
              <th>Status</th>
              <th>Update</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order.user?.name || "User"}</td>
                <td>₹{Number(order.totalAmount).toLocaleString("en-IN")}</td>
                <td>{order.status}</td>

                <td>
                  <select
                    value={order.status}
                    onChange={(e) => updateStatus(order._id, e.target.value)}
                  >
                    <option>Pending</option>
                    <option>Processing</option>
                    <option>Shipped</option>
                    <option>Delivered</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminDashboard;