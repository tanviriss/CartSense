import { FaSearch, FaShoppingCart, FaUser, FaHeart } from "react-icons/fa";
import ChatWidget from "./ChatWidget";
const EcommerceStore = () => {
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
                <a href="#" className="active">
                  Home
                </a>
              </li>
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
              <li>
                <a href="#">Deals</a>
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
            <h2>Featured Products</h2>
            <div className="products-grid">
              <div className="product-card">
                <div className="product-image">🛋️</div>
                <h3>Modern Sofa</h3>
                <p>Comfortable and stylish sofa with plush cushions</p>
                <div className="price">
                  $999 <span className="original-price">$1,200</span>
                </div>
                <button className="add-to-cart">Add to Cart</button>
              </div>

              <div className="product-card">
                <div className="product-image">🛏️</div>
                <h3>Queen Bed Frame</h3>
                <p>Sleek and modern queen bed frame</p>
                <div className="price">
                  $400 <span className="original-price">$500</span>
                </div>
                <button className="add-to-cart">Add to Cart</button>
              </div>

              <div className="product-card">
                <div className="product-image">🍽️</div>
                <h3>Oak Dining Table</h3>
                <p>Solid oak dining table with six chairs</p>
                <div className="price">
                  $700 <span className="original-price">$800</span>
                </div>
                <button className="add-to-cart">Add to Cart</button>
              </div>

              <div className="product-card">
                <div className="product-image">📺</div>
                <h3>TV Stand</h3>
                <p>Modern TV stand with storage</p>
                <div className="price">
                  $300 <span className="original-price">$350</span>
                </div>
                <button className="add-to-cart">Add to Cart</button>
              </div>
            </div>
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
