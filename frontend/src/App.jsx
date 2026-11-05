
import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

const API_URL = "http://localhost:5000/api/products";

const emptyForm = {
  name: "",
  category: "",
  price: "",
  quantity: "",
  description: ""
};

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const [productToDelete, setProductToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Fetch products from the backend
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(API_URL);
      setProducts(response.data);
    } catch (err) {
      setError("Unable to load products. Please check the backend server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Open form for adding a product
  const openAddForm = () => {
    setEditingId(null);
    setFormData(emptyForm);
    setError("");
    setShowForm(true);
  };

  // Open form with existing product information
  const handleEdit = (product) => {
    setEditingId(product._id);

    setFormData({
      name: product.name,
      category: product.category,
      price: product.price,
      quantity: product.quantity,
      description: product.description || ""
    });

    setError("");
    setShowForm(true);
  };

  // Add or update a product

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setNotice("");

    // Check product name
    if (formData.name.trim().length < 2) {
      setError("Product name must contain at least 2 characters.");
      return;
    }

    // Check category
    if (!formData.category) {
      setError("Please select a product category.");
      return;
    }

    // Check price
    if (
      formData.price === "" ||
      !Number.isFinite(Number(formData.price)) ||
      Number(formData.price) < 0
    ) {
      setError("Please enter a valid price.");
      return;
    }

    // Check quantity
    if (
      formData.quantity === "" ||
      !Number.isInteger(Number(formData.quantity)) ||
      Number(formData.quantity) < 0
    ) {
      setError("Quantity must be a non-negative whole number.");
      return;
    }

    try {
      setSaving(true);

      const productData = {
        ...formData,
        name: formData.name.trim(),
        category: formData.category.trim(),
        price: Number(formData.price),
        quantity: Number(formData.quantity)
      };

      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, productData);
        setNotice("Product updated successfully!");
      } else {
        await axios.post(API_URL, productData);
        setNotice("Product added successfully!");
      }

      setShowForm(false);
      setEditingId(null);
      setFormData(emptyForm);

      await fetchProducts();

    } catch (err) {
      setError(
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Unable to save product. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };


  // Delete a product
  const handleDelete = (product) => {
    setProductToDelete(product);
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;

    try {
      setDeleting(true);
      setError("");
      setNotice("");

      await axios.delete(`${API_URL}/${productToDelete._id}`);

      setProductToDelete(null);
      setNotice("Product deleted successfully!");

      await fetchProducts();

    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to delete product. Please try again."
      );
      setProductToDelete(null);
    } finally {
      setDeleting(false);
    }
  };

  // Search and category filter
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      category === "" || product.category === category;

    return matchesSearch && matchesCategory;
  });

  // Dashboard calculations
  const totalProducts = products.length;

  const totalStock = products.reduce(
    (total, product) => total + product.quantity,
    0
  );

  const lowStock = products.filter(
    (product) => product.quantity <= 5
  ).length;

  return (
    <div className="app">

      {/* Header */}
      <header className="header">
        <div>
          <h1>Inventory Management</h1>
          <p>Manage your products and stock in one place.</p>
        </div>

        <button className="add-button" onClick={openAddForm}>
          + Add Product
        </button>
      </header>

      {/* Notifications */}
      {notice && <p className="success-message">{notice}</p>}
      {error && <p className="error-message">{error}</p>}

      {/* Dashboard summary */}
      <section className="summary">

        <div className="summary-card">
          <h3>Total Products</h3>
          <h2>{totalProducts}</h2>
          <p>Products in inventory</p>
        </div>

        <div className="summary-card">
          <h3>Total Stock</h3>
          <h2>{totalStock}</h2>
          <p>Available units</p>
        </div>

        <div className="summary-card">
          <h3>Low Stock</h3>
          <h2>{lowStock}</h2>
          <p>Products needing attention</p>
        </div>

      </section>

      {/* Products section */}
      <section className="products-section">

        <div className="section-heading">
          <div>
            <h2>Products</h2>
            <p>View and manage your inventory.</p>
          </div>

          <button
            onClick={fetchProducts}
            className="refresh-button"
          >
            Refresh
          </button>
        </div>

        {/* Search and filter */}
        <div className="filters">

          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">All Categories</option>

            {products
              .map((product) => product.category)
              .filter((value, index, array) =>
                array.indexOf(value) === index
              )
              .map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
          </select>

        </div>

        {/* Product list */}
        {loading ? (
          <p className="message">Loading products...</p>
        ) : (
          <div className="product-grid">

            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <div className="product-card" key={product._id}>

                  <div className="product-top">
                    <span className="category-label">
                      {product.category}
                    </span>

                    <span
                      className={
                        product.quantity <= 5
                          ? "stock low"
                          : "stock available"
                      }
                    >
                      {product.quantity <= 5
                        ? "Low Stock"
                        : "In Stock"}
                    </span>
                  </div>

                  <h3>{product.name}</h3>

                  <p className="description">
                    {product.description || "No description available."}
                  </p>

                  <div className="product-details">
                    <div>
                      <small>Price</small>
                      <strong>
                        Rs. {product.price.toLocaleString()}
                      </strong>
                    </div>

                    <div>
                      <small>Quantity</small>
                      <strong>{product.quantity} units</strong>
                    </div>
                  </div>

                  {/* Edit and Delete buttons */}
                  <div className="product-actions">

                    <button
                      className="edit-button"
                      onClick={() => handleEdit(product)}
                    >
                      Edit
                    </button>

                    <button
                      className="delete-button"
                      onClick={() => handleDelete(product)}
                    >
                      Delete
                    </button>

                  </div>

                </div>
              ))
            ) : (
              <div className="empty-state">
                <h3>No products found</h3>

                <p>
                  There are no products matching your search.
                  Try another search or add a new product.
                </p>

                <button
                  className="add-button"
                  onClick={openAddForm}
                >
                  + Add Your First Product
                </button>
              </div>
            )}

          </div>
        )}

      </section>

      {/* Add/Edit Product Modal */}
      {showForm && (
        <div className="modal-overlay">

          <div className="modal">

            <div className="modal-header">
              <div>
                <h2>
                  {editingId ? "Edit Product" : "Add New Product"}
                </h2>
                <p>Enter the product information below.</p>
              </div>

              <button
                className="close-button"
                onClick={() => setShowForm(false)}
                disabled={saving}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit}>

              <label>Product Name</label>
              <input
                type="text"
                name="name"
                placeholder="Enter product name"
                value={formData.name}
                onChange={handleChange}
                required
              />

              <label>Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="">Select Category</option>
                <option value="Electronics">Electronics</option>
                <option value="Furniture">Furniture</option>
                <option value="Stationery">Stationery</option>
                <option value="Other">Other</option>
              </select>

              <div className="form-row">

                <div>
                  <label>Price (Rs.)</label>
                  <input
                    type="number"
                    name="price"
                    placeholder="Enter price"
                    value={formData.price}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    required
                  />
                </div>

                <div>
                  <label>Quantity</label>
                  <input
                    type="number"
                    name="quantity"
                    placeholder="Enter quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    min="0"
                    step="1"
                    required
                  />
                </div>

              </div>

              <label>Description</label>
              <textarea
                name="description"
                placeholder="Enter product description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
              />

              <div className="form-buttons">

                <button
                  type="button"
                  className="cancel-button"
                  onClick={() => setShowForm(false)}
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="save-button"
                  disabled={saving}
                >
                  {saving
                    ? "Saving..."
                    : editingId
                      ? "Update Product"
                      : "Save Product"}
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

      {productToDelete && (
        <div className="modal-overlay">
          <div className="delete-modal">

            <div className="delete-icon">!</div>

            <h2>Delete Product?</h2>

            <p>
              Are you sure you want to delete
              <strong> {productToDelete.name}</strong>?
              This action cannot be undone.
            </p>

            <div className="form-buttons">

              <button
                className="cancel-button"
                onClick={() => setProductToDelete(null)}
                disabled={deleting}
              >
                Cancel
              </button>

              <button
                className="delete-confirm-button"
                onClick={confirmDelete}
                disabled={deleting}
              >
                {deleting ? "Deleting..." : "Yes, Delete"}
              </button>

            </div>

          </div>
        </div>
      )}
    </div>
  );
}

export default App;
