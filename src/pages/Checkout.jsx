import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function Checkout() {
  const { cart, dispatch, totalPrice } = useCart();
  const [placed, setPlaced] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", address: "" });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch({ type: "CLEAR" });
    setPlaced(true);
  };

  if (placed) {
    return (
      <div className="empty">
        <h2>🎉 Order placed successfully!</h2>
        <p>Thank you for shopping, {form.name}.</p>
        <Link to="/" className="btn">Continue shopping</Link>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="empty">
        <h2>Nothing to checkout</h2>
        <Link to="/" className="btn">Back to shop</Link>
      </div>
    );
  }

  return (
    <div className="checkout">
      <h1>Checkout</h1>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Full name" value={form.name} onChange={handleChange} required />
        <input name="phone" placeholder="Phone number" value={form.phone} onChange={handleChange} required pattern="[0-9]{10}" title="Enter a 10 digit phone number" />
        <textarea name="address" placeholder="Delivery address" value={form.address} onChange={handleChange} required rows="3" />
        <h3>Amount to pay: ₹{totalPrice}</h3>
        <button type="submit" className="btn">Place Order</button>
      </form>
    </div>
  );
}