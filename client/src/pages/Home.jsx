import { Link } from "react-router-dom";
import { FaLaptop, FaTshirt, FaHome, FaUsers } from "react-icons/fa";

function Home() {
  return (
    <div className="container mt-5">
      {/* Hero Section */}
      <div className="jumbotron text-center bg-light p-5 rounded">
        <h1 className="display-4">Welcome to BKart</h1>
        <p className="lead">Your one-stop shop for the best products at unbeatable prices.</p>
        <Link to="/products" className="btn btn-primary btn-lg">Browse Products</Link>
      </div>
      
      {/* Featured Categories */}
      <div className="mt-5">
        <h2 className="text-center mb-4">Featured Categories</h2>
        <div className="row text-center">
          <div className="col-md-4">
            <div className="card shadow-sm p-3">
              <div className="card-body">
                <FaLaptop size={50} className="mb-3 text-primary" />
                <h5 className="card-title">Electronics</h5>
                <p className="card-text">Find the latest gadgets and devices.</p>
                <Link to="/products" className="btn btn-outline-primary">Shop Now</Link>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card shadow-sm p-3">
              <div className="card-body">
                <FaTshirt size={50} className="mb-3 text-primary" />
                <h5 className="card-title">Clothing</h5>
                <p className="card-text">Stay trendy with our latest collections.</p>
                <Link to="/products" className="btn btn-outline-primary">Shop Now</Link>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card shadow-sm p-3">
              <div className="card-body">
                <FaHome size={50} className="mb-3 text-primary" />
                <h5 className="card-title">Home Essentials</h5>
                <p className="card-text">Upgrade your living space with top-quality products.</p>
                <Link to="/products" className="btn btn-outline-primary">Shop Now</Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center mt-5 p-4 bg-dark text-white rounded">
        <h3>Join Our Community</h3>
        <p>Sign up for exclusive deals and updates on the latest arrivals.</p>
        <Link to="/register" className="btn btn-warning btn-lg">
          <FaUsers className="me-2" /> Register Now
        </Link>
      </div>
    </div>
  );
}

export default Home;
