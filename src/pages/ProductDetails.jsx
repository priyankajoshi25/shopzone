import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchProduct } from "../api/products";
import { useCart } from "../context/CartContext";

export default function ProductDetails() {
  const { id } = useParams();
  const { dispatch } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    fetchProduct(id)
      .then(setProduct)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="empty">Loading...</p>;

  if (error || !product) {
    return (
      <div className="empty">
        <h2>Product not found</h2>
        <Link to="/" className="btn">Back to shop</Link>
      </div>
    );
  }

  const discount = Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100);

  return (
    <div className="details">
      <img src={product.image} alt={product.title} />
      <div>
        <span className="tag">{product.categoryLabel}</span>
        <h1>{product.title}</h1>
        {product.brand && <p>Brand: {product.brand}</p>}
        <div className="rating">★ {product.rating}</div>
        <div className="price-row">
          <span className="price big">₹{product.price}</span>
          {discount > 0 && <span className="old-price">₹{product.oldPrice}</span>}
        </div>
        <p>{product.description}</p>
        <button className="btn" onClick={() => dispatch({ type: "ADD", product })}>
          Add to Cart
        </button>
        <p><Link to="/">← Back to shop</Link></p>
      </div>
    </div>
  );
}
