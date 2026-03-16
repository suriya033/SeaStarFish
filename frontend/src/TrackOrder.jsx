import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './TrackOrder.css';

const TrackOrder = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const queryId = new URLSearchParams(location.search).get('id');

    const [orderId, setOrderId] = useState(queryId || '');
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (queryId) fetchOrder(queryId);
    }, [queryId]);

    const fetchOrder = async (id) => {
        if (!id) return;
        setLoading(true); setError('');
        try {
            const res = await axios.get(`http://localhost:5000/api/orders/${id}`);
            setOrder(res.data);
        } catch (err) {
            setError('Consignment ID not found in our registry. Please verify your 24-character ID.');
            setOrder(null);
        }
        setLoading(false);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (orderId) navigate(`/track?id=${orderId}`);
    };

    const getStatusIndex = (currentStatus) => {
        const statuses = ['Pending', 'Shipped', 'Delivered'];
        return statuses.indexOf(currentStatus);
    };

    return (
        <div className="to-root">

            {/* ── HEADER ── */}
            <header className="to-header">
                <div className="to-container to-header__inner">
                    <Link to="/" className="to-brand">
                        <span>🐟</span>
                        <div>
                            <div className="to-brand__name">SeaStar</div>
                            <div className="to-brand__sub"> </div>
                        </div>
                    </Link>
                    <nav className="to-nav">
                        <Link to="/" className="to-nav__link">Home</Link>
                        <Link to="/shop" className="to-nav__link">Registry</Link>
                        <Link to="/track" className="to-nav__link to-nav__link--active">Logistics Tracking</Link>
                    </nav>
                </div>
            </header>

            {/* ── HERO BANNER ── */}
            <div className="to-banner">
                <div className="to-container">
                    <p className="to-banner__eyebrow">LIVE SATELLITE LINK</p>
                    <h1 className="to-banner__title">Logistics Tracking</h1>
                    <p className="to-banner__sub">Monitor your biological transport in real-time.</p>
                </div>
            </div>

            <main className="to-container to-main">
                <div className="to-layout">

                    {/* ── SEARCH CARD ── */}
                    <div className="to-search-card">
                        <h2 className="to-search__title">Track a Consignment</h2>
                        <form className="to-search__form" onSubmit={handleSearch}>
                            <input
                                className="to-search__input"
                                type="text"
                                placeholder="Enter your 24-character Consignment ID..."
                                value={orderId}
                                onChange={e => setOrderId(e.target.value)}
                            />
                            <button className="to-search__btn" type="submit">Track Ship</button>
                        </form>
                        {error && <div className="to-error"><span>⚠️</span> {error}</div>}
                    </div>

                    {/* ── Loading State ── */}
                    {loading && (
                        <div className="to-state-card">
                            <div className="to-spinner" />
                            <p>Synchronizing with logistics registry...</p>
                        </div>
                    )}

                    {/* ── Empty State (No query yet) ── */}
                    {!loading && !order && !error && (
                        <div className="to-state-card to-state-card--empty">
                            <span className="to-state-card__icon">📡</span>
                            <h3>Awaiting Transmission</h3>
                            <p>Enter your unique ID above to retrieve live logistics data for your order.</p>
                        </div>
                    )}

                    {/* ── ACTIVE ORDER CARD ── */}
                    {!loading && order && (
                        <div className="to-order-card">

                            {/* Status Header */}
                            <div className="to-order-header">
                                <div className="to-order-header__left">
                                    <span className="to-order-header__label">Current Status</span>
                                    <h2 className={`to-order-header__status to-status--${order.status.toLowerCase()}`}>
                                        {order.status}
                                    </h2>
                                </div>
                                <div className="to-order-header__right">
                                    <span className="to-order-header__label">Consignment ID</span>
                                    <span className="to-order-header__id">{order._id}</span>
                                </div>
                            </div>

                            {/* Tracking Timeline */}
                            <div className="to-order-timeline">
                                <div className="to-timeline__track">
                                    {['Pending', 'Shipped', 'Delivered'].map((step, idx) => {
                                        const currentIndex = getStatusIndex(order.status);
                                        const isPast = idx < currentIndex;
                                        const isActive = idx === currentIndex;
                                        const isFuture = idx > currentIndex;

                                        return (
                                            <div className="to-timeline__node" key={step}>
                                                <div className={`to-timeline__dot ${isPast ? 'done' : ''} ${isActive ? 'active' : ''}`}>
                                                    {isPast ? '✓' : idx + 1}
                                                </div>
                                                <span className={`to-timeline__label ${isFuture ? 'future' : ''}`}>
                                                    {step}
                                                </span>
                                            </div>
                                        );
                                    })}
                                    {/* The connecting lines */}
                                    <div className="to-timeline__connecting-lines">
                                        <div className={`to-timeline__line ${getStatusIndex(order.status) >= 1 ? 'done' : ''}`} />
                                        <div className={`to-timeline__line ${getStatusIndex(order.status) >= 2 ? 'done' : ''}`} />
                                    </div>
                                </div>
                            </div>

                            {/* Order Details Grid */}
                            <div className="to-order-details">
                                {/* Destination Profile */}
                                <div className="to-details-col">
                                    <h3 className="to-details__title">Destination Profile</h3>
                                    <div className="to-details__card">
                                        <p className="to-details__name">{order.customerName}</p>
                                        <p className="to-details__address">
                                            {order.shippingAddress.address}<br />
                                            {order.shippingAddress.city}, {order.shippingAddress.state}<br />
                                            {order.shippingAddress.zip}
                                        </p>
                                    </div>
                                </div>

                                {/* Specimen Registry */}
                                <div className="to-details-col">
                                    <h3 className="to-details__title">Specimen Registry</h3>
                                    <div className="to-details__card to-details__card--items">
                                        {order.items.map((item, idx) => (
                                            <div className="to-item-line" key={idx}>
                                                <span className="to-item-name">{item.productId?.name || 'Seawater Inhabitant'}</span>
                                                <span className="to-item-qty">{item.quantity} units</span>
                                            </div>
                                        ))}

                                        <div className="to-items-total">
                                            <span>Final Valuation</span>
                                            <span className="to-items-total__val">₹{order.totalAmount?.toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    )}
                </div>
            </main>

            {/* ── FOOTER ── */}
            <footer className="to-footer">
                <div className="to-container to-footer__inner">
                    <span>© 2026 Sea Star Fish Aquarium· All rights reserved.</span>
                    <Link to="/shop" className="to-footer__link">← Back to Registry</Link>
                </div>
            </footer>
        </div>
    );
};

export default TrackOrder;
