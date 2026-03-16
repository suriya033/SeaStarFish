import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useCart } from './CartContext';
import './Checkout.css';

const Checkout = () => {
    const navigate = useNavigate();
    const { cart, totalPrice, clearCart } = useCart();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        customerName: '', customerEmail: '', customerPhone: '',
        address: '', city: '', state: '', zip: '', notes: ''
    });

    const shipping = totalPrice >= 5000 ? 0 : 150;
    const grandTotal = totalPrice + shipping;

    if (cart.length === 0) {
        return (
            <div className="co-empty">
                <span>🛒</span>
                <h2>Nothing to checkout</h2>
                <p>Your cart is empty. Add some specimens first.</p>
                <Link to="/shop" className="co-btn co-btn--primary">Browse Registry →</Link>
            </div>
        );
    }

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        const orderData = {
            customerName: formData.customerName,
            customerEmail: formData.customerEmail,
            customerPhone: formData.customerPhone,
            shippingAddress: {
                address: formData.address,
                city: formData.city,
                state: formData.state,
                zip: formData.zip
            },
            items: cart.map(item => ({
                productId: item._id,
                quantity: item.quantity,
                priceAtPurchase: item.price
            })),
            totalAmount: grandTotal
        };
        try {
            const res = await axios.post('http://localhost:5000/api/orders', orderData);
            clearCart();
            navigate('/order-success', { state: { orderId: res.data._id } });
        } catch (err) {
            const msg = err.response?.data?.message || 'Something went wrong. Please try again.';
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="co-root">

            {/* ── HEADER ── */}
            <header className="co-header">
                <div className="co-container co-header__inner">
                    <Link to="/" className="co-brand">
                        <span>🐟</span>
                        <div>
                            <div className="co-brand__name">SeaStar</div>
                            <div className="co-brand__sub"> </div>
                        </div>
                    </Link>

                    {/* Step indicator */}
                    <div className="co-steps">
                        <div className="co-step co-step--done">
                            <span className="co-step__num">✓</span>
                            <span className="co-step__label">Cart</span>
                        </div>
                        <div className="co-step__line co-step__line--done" />
                        <div className="co-step co-step--active">
                            <span className="co-step__num">2</span>
                            <span className="co-step__label">Checkout</span>
                        </div>
                        <div className="co-step__line" />
                        <div className="co-step">
                            <span className="co-step__num">3</span>
                            <span className="co-step__label">Confirmed</span>
                        </div>
                    </div>

                    <Link to="/cart" className="co-header__back">← Edit Cart</Link>
                </div>
            </header>

            {/* ── BANNER ── */}
            <div className="co-banner">
                <div className="co-container">
                    <p className="co-banner__eyebrow">FINAL STEP</p>
                    <h1 className="co-banner__title">Shipping & Confirmation</h1>
                    <p className="co-banner__sub">Enter your details to finalise your biological transport.</p>
                </div>
            </div>

            <main className="co-container co-main">
                <div className="co-layout">

                    {/* ─ LEFT: Form ─ */}
                    <div className="co-form-card">

                        {/* Section 1: Contact */}
                        <div className="co-form-section">
                            <div className="co-form-section__header">
                                <span className="co-form-section__num">01</span>
                                <h2 className="co-form-section__title">Contact Details</h2>
                            </div>

                            <form onSubmit={handleSubmit} id="checkout-form">
                                <div className="co-field-row">
                                    <div className="co-field">
                                        <label className="co-label">Full Name</label>
                                        <input
                                            className="co-input" type="text"
                                            name="customerName" value={formData.customerName}
                                            onChange={handleChange}
                                            placeholder="e.g. Rajan Sharma"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="co-field-row co-field-row--2">
                                    <div className="co-field">
                                        <label className="co-label">Email Address</label>
                                        <input
                                            className="co-input" type="email"
                                            name="customerEmail" value={formData.customerEmail}
                                            onChange={handleChange}
                                            placeholder="rajan@example.com"
                                            required
                                        />
                                    </div>
                                    <div className="co-field">
                                        <label className="co-label">Phone / WhatsApp</label>
                                        <input
                                            className="co-input" type="tel"
                                            name="customerPhone" value={formData.customerPhone}
                                            onChange={handleChange}
                                            placeholder="+91 98765 43210"
                                            required
                                        />
                                    </div>
                                </div>
                            </form>
                        </div>

                        {/* Section 2: Address */}
                        <div className="co-form-section">
                            <div className="co-form-section__header">
                                <span className="co-form-section__num">02</span>
                                <h2 className="co-form-section__title">Delivery Address</h2>
                            </div>

                            <div className="co-field">
                                <label className="co-label">Street Address</label>
                                <input
                                    className="co-input" form="checkout-form"
                                    name="address" value={formData.address}
                                    onChange={handleChange}
                                    placeholder="Block 7, West Patel Nagar"
                                    required
                                />
                            </div>

                            <div className="co-field-row co-field-row--3" style={{ marginTop: '1.25rem' }}>
                                <div className="co-field">
                                    <label className="co-label">City</label>
                                    <input
                                        className="co-input" form="checkout-form"
                                        name="city" value={formData.city}
                                        onChange={handleChange}
                                        placeholder="New Delhi"
                                        required
                                    />
                                </div>
                                <div className="co-field">
                                    <label className="co-label">State</label>
                                    <input
                                        className="co-input" form="checkout-form"
                                        name="state" value={formData.state}
                                        onChange={handleChange}
                                        placeholder="Delhi"
                                        required
                                    />
                                </div>
                                <div className="co-field">
                                    <label className="co-label">PIN Code</label>
                                    <input
                                        className="co-input" form="checkout-form"
                                        name="zip" value={formData.zip}
                                        onChange={handleChange}
                                        placeholder="110008"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Section 3: Notes */}
                        <div className="co-form-section">
                            <div className="co-form-section__header">
                                <span className="co-form-section__num">03</span>
                                <h2 className="co-form-section__title">Delivery Notes <span className="co-optional">(optional)</span></h2>
                            </div>
                            <div className="co-field">
                                <textarea
                                    className="co-input co-input--textarea" form="checkout-form"
                                    name="notes" value={formData.notes}
                                    onChange={handleChange}
                                    rows="3"
                                    placeholder="Leave with gate, ring bell twice, call on arrival..."
                                />
                            </div>
                        </div>

                        {/* Error */}
                        {error && (
                            <div className="co-error">
                                <span>⚠️</span> {error}
                            </div>
                        )}

                        {/* Submit */}
                        <button
                            type="submit"
                            form="checkout-form"
                            className={`co-btn co-btn--primary co-btn--full co-btn--lg ${loading ? 'co-btn--loading' : ''}`}
                            disabled={loading}
                        >
                            {loading ? (
                                <><span className="co-spinner" /> Processing Order...</>
                            ) : (
                                'Confirm & Place Order →'
                            )}
                        </button>
                    </div>

                    {/* ─ RIGHT: Order Summary ─ */}
                    <div className="co-summary">
                        <h3 className="co-summary__title">Order Summary</h3>

                        {/* Items */}
                        <div className="co-summary__items">
                            {cart.map(item => (
                                <div className="co-summary__item" key={item._id}>
                                    <div className="co-summary__item-img">
                                        <img
                                            src={item.images?.[0] || 'https://via.placeholder.com/56'}
                                            alt={item.name}
                                            onError={e => e.target.src = 'https://via.placeholder.com/56'}
                                        />
                                        <span className="co-summary__item-qty">{item.quantity}</span>
                                    </div>
                                    <div className="co-summary__item-info">
                                        <span className="co-summary__item-name">{item.name}</span>
                                        <span className="co-summary__item-cat">{item.category}</span>
                                    </div>
                                    <span className="co-summary__item-price">
                                        ₹{(item.price * item.quantity)?.toLocaleString()}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <hr className="co-summary__divider" />

                        {/* Totals */}
                        <div className="co-summary__totals">
                            <div className="co-summary__row">
                                <span>Subtotal</span>
                                <span>₹{totalPrice.toLocaleString()}</span>
                            </div>
                            <div className="co-summary__row">
                                <span>Shipping</span>
                                <span className={shipping === 0 ? 'co-free' : ''}>
                                    {shipping === 0 ? 'Free' : `₹${shipping}`}
                                </span>
                            </div>
                        </div>

                        <hr className="co-summary__divider" />

                        <div className="co-summary__grand">
                            <span>Total</span>
                            <span>₹{grandTotal.toLocaleString()}</span>
                        </div>

                        {/* Guarantees */}
                        <div className="co-guarantees">
                            <div className="co-guarantee">
                                <span>🐠</span>
                                <span>100% Live Arrival Guarantee</span>
                            </div>
                            <div className="co-guarantee">
                                <span>🔬</span>
                                <span>Marine Biologist Inspected</span>
                            </div>
                            <div className="co-guarantee">
                                <span>🚚</span>
                                <span>Insured Temperature-Controlled Logistics</span>
                            </div>
                            <div className="co-guarantee">
                                <span>🔒</span>
                                <span>256-bit Encrypted & Secure</span>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <footer className="co-footer">
                <div className="co-container co-footer__inner">
                    <span>© 2026 Sea Star Fish Aquarium· All rights reserved.</span>
                    <Link to="/cart" className="co-footer__link">← Back to Cart</Link>
                </div>
            </footer>
        </div>
    );
};

export default Checkout;
