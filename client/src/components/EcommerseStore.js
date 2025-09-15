import { FaSearch, FaShoppingCart, FaUser, FaHeart } from "react-icons/fa";
import ChatWidget from "./ChatWidget";
import { useState, useEffect } from "react";

const EcommerceStore = () => {
  const [activeCategory, setActiveCategory] = useState("Home");
  const [products, setProducts] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:8000/products");
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      } else {
        console.error("Failed to fetch products");
        setProducts(getDefaultProducts());
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts(getDefaultProducts());
    } finally {
      setLoading(false);
    }
  };

  const getDefaultProducts = () => ({
    Home: [
      {
        id: 1,
        name: "Modern Sofa",
        description: "Comfortable and stylish sofa with plush cushions",
        price: 999,
        originalPrice: 1200,
        emoji: "🛋️",
        category: "Living Room",
      },
      {
        id: 2,
        name: "Oak Dining Table",
        description: "Solid oak dining table with six chairs",
        price: 700,
        originalPrice: 800,
        emoji: "🍽️",
        category: "Dining Room",
      },
      {
        id: 3,
        name: "TV Stand",
        description: "Modern TV stand with storage",
        price: 300,
        originalPrice: 350,
        emoji: "📺",
        category: "Living Room",
      },
      {
        id: 4,
        name: "Coffee Table",
        description: "Glass top coffee table with wooden legs",
        price: 250,
        originalPrice: 300,
        emoji: "☕",
        category: "Living Room",
      },
    ],
    Electronics: [],
    Clothing: [],
    "Home & Kitchen": [],
    Beauty: [],
    Sports: [],
    Deals: [],
  });

  const handleCategoryClick = (category) => {
    setActiveCategory(category);
  };

  const currentProducts = products[activeCategory] || products["Home"];
  return (
    <>
      <header className="header">
        <div className="container">
          <div className="top-bar">
            <div className="logo">ShopSmart</div>
            <div className="search-bar">
              <input type="text" placeholder="Search for products..." />
              <button>
                <FaSearch />
              </button>
            </div>

            <div className="nav-icons">
              <a href="#account">
                <FaUser size={20} />
              </a>
              <a href="#wishlist">
                <FaHeart size={20} />
                <span className="badge">{3}</span>
              </a>
              <a href="#cart">
                <FaShoppingCart size={20} />
                <span className="badge">{2}</span>
              </a>
            </div>
          </div>

          <nav className="nav-bar">
            <ul>
              <li>
                <a
                  href="#"
                  className={activeCategory === "Home" ? "active" : ""}
                  onClick={(e) => {
                    e.preventDefault();
                    handleCategoryClick("Home");
                  }}
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className={activeCategory === "Electronics" ? "active" : ""}
                  onClick={(e) => {
                    e.preventDefault();
                    handleCategoryClick("Electronics");
                  }}
                >
                  Electronics
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className={activeCategory === "Clothing" ? "active" : ""}
                  onClick={(e) => {
                    e.preventDefault();
                    handleCategoryClick("Clothing");
                  }}
                >
                  Clothing
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className={
                    activeCategory === "Home & Kitchen" ? "active" : ""
                  }
                  onClick={(e) => {
                    e.preventDefault();
                    handleCategoryClick("Home & Kitchen");
                  }}
                >
                  Home & Kitchen
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className={activeCategory === "Beauty" ? "active" : ""}
                  onClick={(e) => {
                    e.preventDefault();
                    handleCategoryClick("Beauty");
                  }}
                >
                  Beauty
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className={activeCategory === "Sports" ? "active" : ""}
                  onClick={(e) => {
                    e.preventDefault();
                    handleCategoryClick("Sports");
                  }}
                >
                  Sports
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className={activeCategory === "Deals" ? "active" : ""}
                  onClick={(e) => {
                    e.preventDefault();
                    handleCategoryClick("Deals");
                  }}
                >
                  Deals
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <main>
        <div className="hero">
          <div className="container">
            <h1>Welcome to ShopSmart</h1>
            <p>
              Discover premium furniture and home decor with AI-powered shopping
              assistance
            </p>
            <button>Explore Collection</button>
          </div>
        </div>

        <section className="featured-products">
          <div className="container">
            <h2>
              {activeCategory === "Home"
                ? "Featured Products"
                : `${activeCategory} Products`}
            </h2>
            {loading ? (
              <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading products...</p>
              </div>
            ) : (
              <div className="products-grid">
                {currentProducts.length > 0 ? (
                  currentProducts.map((product) => (
                    <div key={product.id} className="product-card">
                      <div className="product-image">
                        {product.emoji || "📦"}
                      </div>
                      <h3>{product.name}</h3>
                      <p>{product.description}</p>
                      <div className="price">
                        ${product.price}{" "}
                        <span className="original-price">
                          ${product.originalPrice}
                        </span>
                      </div>
                      <button className="add-to-cart">Add to Cart</button>
                    </div>
                  ))
                ) : (
                  <div className="no-products">
                    <p>No products found in this category.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-column">
              <h3>Shop</h3>
              <ul>
                <li>
                  <a href="#">Electronics</a>
                </li>
                <li>
                  <a href="#">Clothing</a>
                </li>
                <li>
                  <a href="#">Home & Kitchen</a>
                </li>
                <li>
                  <a href="#">Beauty</a>
                </li>
                <li>
                  <a href="#">Sports</a>
                </li>
              </ul>
            </div>

            <div className="footer-column">
              <h3>Customer Service</h3>
              <ul>
                <li>
                  <a href="#">Contact Us</a>
                </li>
                <li>
                  <a href="#">FAQs</a>
                </li>
                <li>
                  <a href="#">Shipping Policy</a>
                </li>
                <li>
                  <a href="#">Returns & Exchanges</a>
                </li>
                <li>
                  <a href="#">Order Tracking</a>
                </li>
              </ul>
            </div>

            <div className="footer-column">
              <h3>About Us</h3>
              <ul>
                <li>
                  <a href="#">Our Story</a>
                </li>
                <li>
                  <a href="#">Blog</a>
                </li>
                <li>
                  <a href="#">Careers</a>
                </li>
                <li>
                  <a href="#">Press</a>
                </li>
                <li>
                  <a href="#">Sustainability</a>
                </li>
              </ul>
            </div>

            <div className="footer-column">
              <h3>Connect With Us</h3>
              <ul>
                <li>
                  <a href="#">Facebook</a>
                </li>
                <li>
                  <a href="#">Instagram</a>
                </li>
                <li>
                  <a href="#">Twitter</a>
                </li>
                <li>
                  <a href="#">Pinterest</a>
                </li>
                <li>
                  <a href="#">YouTube</a>
                </li>
              </ul>
            </div>
          </div>

          <div className="copyright">
            &copy {new Date().getFullYear()} ShopSmart. All rights reserved.
          </div>
        </div>
      </footer>

      <ChatWidget />
    </>
  );
};

export default EcommerceStore;
