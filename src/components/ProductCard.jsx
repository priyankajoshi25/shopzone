import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function ProductCard({ product }) {
  const { dispatch } = useCart();
  const [added, setAdded] = useState(false);
  const discount = Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100);

  const handleAdd = () => {
    dispatch({ type: "ADD", product });
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  return (
    <div className="card">
      <Link to={`/product/${product.id}`} className="card-img">
        <img src={product.image} alt={product.title} loading="lazy" />
        {discount > 0 && <span className="discount">{discount}% OFF</span>}
      </Link>
      <div className="card-body">
        <span className="tag">{product.categoryLabel}</span>
        <h3>{product.title}</h3>
        <div className="rating">★ {product.rating}</div>
        <div className="price-row">
          <span className="price">₹{product.price}</span>
          {discount > 0 && <span className="old-price">₹{product.oldPrice}</span>}
        </div>
        <button className={added ? "btn added" : "btn"} onClick={handleAdd}>
          {added ? "Added ✓" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}
