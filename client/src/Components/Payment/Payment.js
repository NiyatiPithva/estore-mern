import React, { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { showCartItems } from "../../Redux/Cart/cartSlice";
// import { clearCart } from "../../redux/reducer/cartSlice";
// import { placeOrder } from "../../redux/reducer/orderSlice";
import "./Payment.scss";

// NOTE: This assumes:
//  - cartSlice exposes `state.cart.items` (array of { _id, name, price, quantity, image })
//    and a `clearCart()` action.
//  - orderSlice exposes an async thunk `placeOrder({ items, shippingAddress, total })`.
// Adjust the import paths/shapes above to match the actual slices in the project.

const SHIPPING_FLAT_RATE = 49;
const TAX_RATE = 0.08;

const format_currency = (value) => `$${Number(value || 0).toFixed(2)}`;

const Payment = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cartItems = useSelector((state) => state.cr.cartItems || []);

  const [shipping, setShipping] = useState({
    fullName: "",
    address: "",
    city: "",
    zip: "",
  });

  const [card, setCard] = useState({
    cardNumber: "",
    expiry: "",
    cvv: "",
    nameOnCard: "",
  });

  const [errors, setErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const subtotal = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cartItems]
  );
  const tax = useMemo(() => subtotal * TAX_RATE, [subtotal]);
  const shippingFee = cartItems.length > 0 ? SHIPPING_FLAT_RATE : 0;
  const total = subtotal + tax + shippingFee;

  const handle_shipping_change = (e) => {
    const { name, value } = e.target;
    setShipping((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handle_card_change = (e) => {
    const { name, value } = e.target;
    let formatted = value;

    if (name === "cardNumber") {
      formatted = value
        .replace(/\D/g, "")
        .slice(0, 16)
        .replace(/(.{4})/g, "$1 ")
        .trim();
    } else if (name === "expiry") {
      formatted = value
        .replace(/\D/g, "")
        .slice(0, 4)
        .replace(/(\d{2})(\d)/, "$1/$2");
    } else if (name === "cvv") {
      formatted = value.replace(/\D/g, "").slice(0, 4);
    }

    setCard((prev) => ({ ...prev, [name]: formatted }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors = {};
    if (!shipping.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!shipping.address.trim()) newErrors.address = "Address is required";
    if (!shipping.city.trim()) newErrors.city = "City is required";
    if (!shipping.zip.trim()) newErrors.zip = "ZIP code is required";

    const digitsOnly = card.cardNumber.replace(/\s/g, "");
    if (!digitsOnly) {
      newErrors.cardNumber = "Card number is required";
    } else if (digitsOnly.length !== 16) {
      newErrors.cardNumber = "Card number must be 16 digits";
    }
    if (!/^\d{2}\/\d{2}$/.test(card.expiry)) {
      newErrors.expiry = "Use MM/YY format";
    }
    if (!/^\d{3,4}$/.test(card.cvv)) {
      newErrors.cvv = "Enter a valid CVV";
    }
    if (!card.nameOnCard.trim()) newErrors.nameOnCard = "Name on card is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handle_submit = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0 || !validate()) return;

    setIsProcessing(true);
    // try {
    //   await dispatch(
    //     placeOrder({
    //       items: cartItems,
    //       shippingAddress: shipping,
    //       total,
    //     })
    //   ).unwrap();

    //   // dispatch(clearCart());
    //   setOrderPlaced(true);
    //   setTimeout(() => navigate("/orders"), 2000);
    // } catch (err) {
    //   setErrors((prev) => ({ ...prev, submit: "Payment failed. Please try again." }));
    // } finally {
    //   setIsProcessing(false);
    // }
  };

  if (orderPlaced) {
    return (
      <div className="payment_page">
        <div className="payment_success">
          <div className="success_icon">✓</div>
          <h2 className="success_title">Order Placed Successfully!</h2>
          <p className="success_text">Redirecting you to your orders...</p>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="payment_page">
        <div className="payment_empty">
          <h2>Your cart is empty</h2>
          <p>Add some products before proceeding to checkout.</p>
          <Link to="/" className="btn_primary btn_primary--inline">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="payment_page">
      <div className="payment_layout">
        <form className="payment_form_card" onSubmit={handle_submit} noValidate>
          <h2 className="section_title">Shipping Details</h2>
          <div className="form_grid">
            <div className="form_group form_group--full">
              <label className="form_label">Full Name</label>
              <input
                name="fullName"
                className={`form_input ${errors.fullName ? "form_input--error" : ""}`}
                value={shipping.fullName}
                onChange={handle_shipping_change}
                placeholder="Jane Doe"
              />
              {errors.fullName && <span className="form_error">{errors.fullName}</span>}
            </div>

            <div className="form_group form_group--full">
              <label className="form_label">Address</label>
              <input
                name="address"
                className={`form_input ${errors.address ? "form_input--error" : ""}`}
                value={shipping.address}
                onChange={handle_shipping_change}
                placeholder="123 Main Street"
              />
              {errors.address && <span className="form_error">{errors.address}</span>}
            </div>

            <div className="form_group">
              <label className="form_label">City</label>
              <input
                name="city"
                className={`form_input ${errors.city ? "form_input--error" : ""}`}
                value={shipping.city}
                onChange={handle_shipping_change}
                placeholder="Vadodara"
              />
              {errors.city && <span className="form_error">{errors.city}</span>}
            </div>

            <div className="form_group">
              <label className="form_label">ZIP Code</label>
              <input
                name="zip"
                className={`form_input ${errors.zip ? "form_input--error" : ""}`}
                value={shipping.zip}
                onChange={handle_shipping_change}
                placeholder="390001"
              />
              {errors.zip && <span className="form_error">{errors.zip}</span>}
            </div>
          </div>

          <h2 className="section_title section_title--spaced">Payment Details</h2>
          <div className="form_grid">
            <div className="form_group form_group--full">
              <label className="form_label">Card Number</label>
              <input
                name="cardNumber"
                className={`form_input ${errors.cardNumber ? "form_input--error" : ""}`}
                value={card.cardNumber}
                onChange={handle_card_change}
                placeholder="1234 5678 9012 3456"
                inputMode="numeric"
              />
              {errors.cardNumber && <span className="form_error">{errors.cardNumber}</span>}
            </div>

            <div className="form_group">
              <label className="form_label">Expiry (MM/YY)</label>
              <input
                name="expiry"
                className={`form_input ${errors.expiry ? "form_input--error" : ""}`}
                value={card.expiry}
                onChange={handle_card_change}
                placeholder="08/28"
                inputMode="numeric"
              />
              {errors.expiry && <span className="form_error">{errors.expiry}</span>}
            </div>

            <div className="form_group">
              <label className="form_label">CVV</label>
              <input
                name="cvv"
                type="password"
                className={`form_input ${errors.cvv ? "form_input--error" : ""}`}
                value={card.cvv}
                onChange={handle_card_change}
                placeholder="123"
                inputMode="numeric"
              />
              {errors.cvv && <span className="form_error">{errors.cvv}</span>}
            </div>

            <div className="form_group form_group--full">
              <label className="form_label">Name on Card</label>
              <input
                name="nameOnCard"
                className={`form_input ${errors.nameOnCard ? "form_input--error" : ""}`}
                value={card.nameOnCard}
                onChange={handle_card_change}
                placeholder="Jane Doe"
              />
              {errors.nameOnCard && <span className="form_error">{errors.nameOnCard}</span>}
            </div>
          </div>

          {errors.submit && (
            <div className="payment_alert" role="alert">
              {errors.submit}
            </div>
          )}

          <button type="submit" className="btn_primary" disabled={isProcessing}>
            {isProcessing ? "Processing Payment..." : `Pay ${format_currency(total)}`}
          </button>
        </form>

        <aside className="order_summary_card">
          <h2 className="section_title">Order Summary</h2>
          <ul className="summary_list">
            {cartItems.map((item) => (
              <li key={item._id} className="summary_item">
                <span className="summary_item_name">
                  {item.name} <span className="summary_item_qty">× {item.quantity}</span>
                </span>
                <span className="summary_item_price">
                  {format_currency(item.price * item.quantity)}
                </span>
              </li>
            ))}
          </ul>

          <div className="summary_row">
            <span>Subtotal</span>
            <span>{format_currency(subtotal)}</span>
          </div>
          <div className="summary_row">
            <span>Shipping</span>
            <span>{format_currency(shippingFee)}</span>
          </div>
          <div className="summary_row">
            <span>Tax (8%)</span>
            <span>{format_currency(tax)}</span>
          </div>
          <div className="summary_row summary_row--total">
            <span>Total</span>
            <span>{format_currency(total)}</span>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Payment;
