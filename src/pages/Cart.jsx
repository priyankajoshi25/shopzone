import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function Cart() {
  const { cart, dispatch, totalPrice } = useCart();

  if (cart.length === 0) {
    return (
      <div className="empty">
        <h2>Your cart is empty</h2>
        <Link to="/" className="btn">Start shopping</Link>
      </div>
    );
  }

  return (
    <>
      <h1>Your Cart</h1>
      {cart.map((item) => (
        <div className="cart-item" key={item.id}>
          <img src={item.image} alt={item.title} />
          <div className="cart-info">
            <h3>{item.title}</h3>
            <p className="price">₹{item.price}</p>
          </div>
          <div className="qty">
            <button onClick={() => dispatch({ type: "DECREASE", id: item.id })}>−</button>
            <span>{item.qty}</span>
            <button onClick={() => dispatch({ type: "INCREASE", id: item.id })}>+</button>
          </div>
          <p className="line-total">₹{item.price * item.qty}</p>
          <button
            className="remove"
            onClick={() => dispatch({ type: "REMOVE", id: item.id })}
          >
            Remove
          </button>
        </div>
      ))}

      <div className="summary">
        <h2>Total: ₹{totalPrice}</h2>
        <Link to="/checkout" className="btn">Proceed to Checkout</Link>
      </div>
    </>
  );
}