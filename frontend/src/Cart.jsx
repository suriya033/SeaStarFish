import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from './CartContext';
import './Cart.css';

const Cart = () => {
    const navigate = useNavigate();
    const { cart, removeFromCart, updateQuantity, totalPrice, totalItems } = useCart();

    const shipping = totalPrice >= 5000 ? 0 : 150;
    const grandTotal = totalPrice + shipping;

    return (
        <div className="cart-root">

            {/* ── HEADER ── */}
            <header className="cart-header">
                <div className="cart-container cart-header__inner">
                    <Link to="/" className="cart-brand">
                        <span>🐟</span>
                        <div>
                            <div className="cart-brand__name">SeaStar</div>
                            <div className="cart-brand__sub"> </div>
                        </div>
                    </Link>
                    <nav className="cart-nav">
                        <Link to="/" className="cart-nav__link">Home</Link>
                        <Link to="/shop" className="cart-nav__link">Registry</Link>
                    </nav>
                    <Link to="/shop" className="cart-header__back">← Continue Shopping</Link>
                </div>
            </header>

            {/* ── HERO BANNER ── */}
            <div className="cart-banner">
                <div className="cart-container">
                    <p className="cart-banner__eyebrow">Your Selection</p>
                    <h1 className="cart-banner__title">
                        {totalItems > 0 ? 'Your Cart' : 'Your Cart is Empty'}
                    </h1>
                    <p className="cart-banner__sub">
                        {totalItems > 0
                            ? `${totalItems} specimen${totalItems > 1 ? 's' : ''} ready for dispatch`
                            : 'Add some beautiful specimens to get started'}
                    </p>
                </div>
            </div>

            <main className="cart-container cart-main">
                {cart.length === 0 ? (

                    /* ── EMPTY STATE ── */
                    <div className="cart-empty">
                        <span className="cart-empty__icon">🛒</span>
                        <h2>Empty Tank, Empty Cart</h2>
                        <p>Your cart is patiently waiting for some ocean life.</p>
                        <button className="cart-btn cart-btn--primary cart-btn--lg" onClick={() => navigate('/shop')}>
                            Browse the   →
                        </button>
                    </div>

                ) : (

                    /* ── TWO-COLUMN LAYOUT ── */
                    <div className="cart-layout">

                        {/* ─ LEFT: Items ─ */}
                        <div className="cart-items">
                            <div className="cart-items__header">
                                <h2 className="cart-items__title">Order Items</h2>
                                <span className="cart-items__count">{totalItems} item{totalItems > 1 ? 's' : ''}</span>
                            </div>

                            <div className="cart-list">
                                {cart.map(item => (
                                    <div className="cart-item" key={item._id}>
                                        {/* Image */}
                                        <div className="cart-item__img-wrap"
                                            onClick={() => navigate(`/product/${item._id}`)}>
                                            <img
                                                src={item.images?.[0] || 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=200&q=80'}
                                                alt={item.name}
                                                className="cart-item__img"
                                                onError={e => e.target.src = 'https://via.placeholder.com/120'}
                                            />
                                        </div>

                                        {/* Info */}
                                        <div className="cart-item__info">
                                            <span className="cart-item__cat">{item.category}</span>
                                            <h3 className="cart-item__name"
                                                onClick={() => navigate(`/product/${item._id}`)}>
                                                {item.name}
                                            </h3>
                                            <span className="cart-item__unit-price">
                                                ₹{item.price?.toLocaleString()} per unit
                                            </span>
                                        </div>

                                        {/* Qty */}
                                        <div className="cart-item__qty">
                                            <button
                                                className="cart-qty__btn"
                                                onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                                disabled={item.quantity <= 1}
                                            >−</button>
                                            <span className="cart-qty__val">{item.quantity}</span>
                                            <button
                                                className="cart-qty__btn"
                                                onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                            >+</button>
                                        </div>

                                        {/* Line total */}
                                        <div className="cart-item__total">
                                            ₹{(item.price * item.quantity)?.toLocaleString()}
                                        </div>

                                        {/* Remove */}
                                        <button
                                            className="cart-item__remove"
                                            onClick={() => removeFromCart(item._id)}
                                            title="Remove item"
                                        >✕</button>
                                    </div>
                                ))}
                            </div>

                            {/* Promo / Free shipping nudge */}
                            {totalPrice < 5000 && (
                                <div className="cart-nudge">
                                    <span className="cart-nudge__icon">🚚</span>
                                    <span>
                                        Add <strong>₹{(5000 - totalPrice).toLocaleString()}</strong> more to unlock <strong>free shipping!</strong>
                                    </span>
                                </div>
                            )}
                            {totalPrice >= 5000 && (
                                <div className="cart-nudge cart-nudge--success">
                                    <span className="cart-nudge__icon">✓</span>
                                    <span><strong>You've unlocked free shipping!</strong></span>
                                </div>
                            )}
                        </div>

                        {/* ─ RIGHT: Summary ─ */}
                        <div className="cart-summary">
                            <h2 className="cart-summary__title">Order Summary</h2>

                            {/* Item breakdown */}
                            <div className="cart-summary__lines">
                                {cart.map(item => (
                                    <div className="cart-summary__line" key={item._id}>
                                        <span className="cart-summary__line-name">
                                            {item.name}
                                            {item.quantity > 1 && <em> ×{item.quantity}</em>}
                                        </span>
                                        <span className="cart-summary__line-price">
                                            ₹{(item.price * item.quantity)?.toLocaleString()}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <hr className="cart-summary__divider" />

                            {/* Totals */}
                            <div className="cart-summary__totals">
                                <div className="cart-summary__row">
                                    <span>Subtotal</span>
                                    <span>₹{totalPrice.toLocaleString()}</span>
                                </div>
                                <div className="cart-summary__row">
                                    <span>Shipping</span>
                                    <span className={shipping === 0 ? 'cart-summary__free' : ''}>
                                        {shipping === 0 ? 'Free' : `₹${shipping}`}
                                    </span>
                                </div>
                            </div>

                            <hr className="cart-summary__divider" />

                            <div className="cart-summary__grand">
                                <span>Total</span>
                                <span>₹{grandTotal.toLocaleString()}</span>
                            </div>

                            <button
                                className="cart-btn cart-btn--primary cart-btn--full cart-btn--lg"
                                onClick={() => navigate('/checkout')}
                            >
                                Proceed to Checkout →
                            </button>

                            <Link to="/shop" className="cart-btn cart-btn--ghost cart-btn--full">
                                ← Continue Shopping
                            </Link>

                            {/* Trust signals */}
                            <div className="cart-trust">
                                <div className="cart-trust__item">🔒 256-bit Secure Checkout</div>
                                <div className="cart-trust__item">🐠 Live Arrival Guaranteed</div>
                                <div className="cart-trust__item">🔬 Marine Biologist Verified</div>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            <footer className="cart-footer">
                <div className="cart-container cart-footer__inner">
                    <span>© 2026 Sea Star Fish Aquarium· All rights reserved.</span>
                    <Link to="/shop" className="cart-footer__link">← Back to Registry</Link>
                </div>
            </footer>
        </div>
    );
};

export default Cart;
