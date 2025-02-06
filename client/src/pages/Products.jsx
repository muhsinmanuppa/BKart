import { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "../components/ProductCard";

function Products() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({
    category: '',
    search: ''
  });

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/api/products`)
      .then(res => {
        setProducts(res.data);
        
        // Extract unique categories
        const uniqueCategories = [...new Set(res.data.map(p => p.category))];
        setCategories(uniqueCategories);
        
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  // Filter logic
  useEffect(() => {
    let result = products;

    // Category filter
    if (filters.category) {
      result = result.filter(p => p.category === filters.category);
    }

    // Search filter (case-insensitive)
    if (filters.search) {
      result = result.filter(p => 
        p.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        p.category.toLowerCase().includes(filters.search.toLowerCase()) ||
        p.company.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    setFilteredProducts(result);
  }, [products, filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  if (loading) return <div className="text-center mt-5">Loading...</div>;

  return (
    <div className="container mt-4">
      <div className="row mb-4">
        <div className="col-md-4">
          <select 
            name="category" 
            className="form-control" 
            value={filters.category}
            onChange={handleFilterChange}
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <div className="col-md-8">
          <input 
            type="text" 
            name="search"
            placeholder="Search products..." 
            className="form-control"
            value={filters.search}
            onChange={handleFilterChange}
          />
        </div>
      </div>

      <h2>Our Products</h2>
      <div className="row">
        {filteredProducts.length === 0 ? (
          <div className="col-12">
            <p className="alert alert-info">No products found.</p>
          </div>
        ) : (
          filteredProducts.map(product => (
            <ProductCard key={product._id} product={product} />
          ))
        )}
      </div>
    </div>
  );
}

export default Products;