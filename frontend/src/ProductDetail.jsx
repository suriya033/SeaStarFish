import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useCart } from './CartContext';
import API_BASE_URL from './apiConfig';
import logo from './assets/logo.png';
import './ProductDetail.css';

// --- Premium SVG Icons ---
const Icons = {
    Logo: () => (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"></path>
            <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
            <line x1="9" y1="9" x2="9.01" y2="9"></line>
            <line x1="15" y1="9" x2="15.01" y2="9"></line>
        </svg>
    ),
    Cart: ({ badge }) => (
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
            {badge > 0 && <span className="pd-cart__badge">{badge}</span>}
        </div>
    ),
    ChevronRight: () => (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
    ),
    ZoomIn: () => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="11" y1="8" x2="11" y2="14"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>
    ),
    ZoomOut: () => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>
    ),
    Diamond: () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 3h12l4 6-10 13L2 9Z"></path><path d="M11 3 8 9l4 13 4-13-3-6"></path><path d="M2 9h20"></path></svg>
    ),
    Leaf: () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"></path><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"></path></svg>
    ),
    Truck: () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
    ),
    Phone: () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
    ),
    Star: ({ fill }) => (
        <svg width="15" height="15" viewBox="0 0 24 24" fill={fill ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
    ),
    Microscope: () => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 18h8"></path><path d="M3 22h18"></path><path d="M14 22a7 7 0 1 0 0-14h-1"></path><path d="M9 14h2"></path><path d="M9 12a2 2 0 0 1-2-2V6h6v4a2 2 0 0 1-2 2Z"></path><path d="M12 6V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3"></path></svg>
    ),
    Minus: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"></line></svg>,
    Plus: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>,
    Check: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
};

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart, totalItems } = useCart();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeImg, setActiveImg] = useState(0);
    const [added, setAdded] = useState(false);
    const [qty, setQty] = useState(1);
    const [imgZoom, setImgZoom] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                // Smooth loading transition
                setLoading(true);
                const res = await axios.get(`${API_BASE_URL}/api/products/${id}`);
                setProduct(res.data);
                setTimeout(() => setLoading(false), 300); // Artificial delay for smoothness
            } catch (e) {
                console.error(e);
                setLoading(false);
            }
        };
        fetchProduct();
        window.scrollTo(0, 0); // Scroll to top on mount
    }, [id]);

    const handleAddToCart = () => {
        for (let i = 0; i < qty; i++) addToCart(product);
        setAdded(true);
        setTimeout(() => setAdded(false), 3000);
    };

    /* ── Loading state ── */
    if (loading || !mounted) return (
        <div className={`pd-loading-overlay ${mounted ? 'active' : ''}`}>
            <div className="pd-loading-spinner" />
            <p className="pd-loading-text">Retrieving specimen records...</p>
        </div>
    );

    /* ── Not found state ── */
    if (!product) return (
        <div className="pd-notfound fade-in">
            <div className="pd-notfound-icon">
                <img src={logo} alt="Sea Star Fish Aquarium Logo" style={{ width: '120px', height: 'auto' }} />
            </div>
            <h2>Specimen Not Found</h2>
            <p>This specimen may have been relocated or left our registry.</p>
            <Link to="/shop" className="pd-btn pd-btn--primary">
                Return to Registry
            </Link>
        </div>
    );

    const mainImage = product.images?.[activeImg]
        || 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=900&q=80';

    const renderStockStatus = () => {
        if (product.stock === 0) return { label: 'Out of Stock', classes: 'pd-meta-badge pd-meta-badge--out' };
        if (product.stock < 5) return { label: `Few Remaining (${product.stock})`, classes: 'pd-meta-badge pd-meta-badge--low' };
        return { label: 'In Stock & Ready', classes: 'pd-meta-badge pd-meta-badge--ok' };
    };

    const stockInfo = renderStockStatus();

    return (
        <div className="pd-root fade-in">
            {/* ══════════════════════════
                HEADER
            ═════════════════════════ */}
            <header className={`pd-header ${scrolled ? 'pd-header--solid' : ''}`}>
                <div className="pd-container pd-header__inner">
                    <Link to="/" className="pd-brand">
                        <img src={logo} alt="Sea Star Fish Aquarium Logo" className="pd-brand__logo-img" />
                        <div className="pd-brand__text">
                            <h1 className="pd-brand__name">Sea Star Fish Aquarium</h1>
                            <span className="pd-brand__sub"> </span>
                        </div>
                    </Link>
                    <nav className="pd-nav">
                        <Link to="/" className="pd-nav__link">Home</Link>
                        <Link to="/shop" className="pd-nav__link pd-nav__link--active">Registry</Link>
                    </nav>
                    <div className="pd-header__actions">
                        <Link to="/cart" className="pd-cart-icon">
                            <Icons.Cart badge={totalItems} />
                        </Link>
                    </div>
                </div>
            </header>

            <main className="pd-main pd-container">
                {/* ── Breadcrumb ── */}
                <nav className="pd-breadcrumb">
                    <Link to="/">Home</Link>
                    <Icons.ChevronRight />
                    <Link to="/shop">Registry</Link>
                    <Icons.ChevronRight />
                    <span className="pd-breadcrumb__cat">{product.category}</span>
                    <Icons.ChevronRight />
                    <span className="pd-breadcrumb__current">{product.name}</span>
                </nav>

                {/* ══════════════════════════
                    PRODUCT LAYOUT
                ═════════════════════════ */}
                <div className="pd-layout">
                    {/* ── LEFT: Image Gallery ── */}
                    <div className="pd-gallery">
                        <div
                            className={`pd-gallery__main ${imgZoom ? 'pd-gallery__main--zoom' : ''}`}
                            onClick={() => setImgZoom(!imgZoom)}
                            title="Click to zoom"
                        >
                            <img
                                src={mainImage}
                                alt={product.name}
                                className="pd-gallery__main-img"
                                onError={e => e.target.src = 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=900&q=80'}
                            />

                            {/* Overlay Controls & Badges */}
                            <div className="pd-gallery__overlay">
                                <div className="pd-gallery__badges">
                                    {product.stock < 5 && product.stock > 0 && (
                                        <span className="pd-badge pd-badge--warning">Rare Find</span>
                                    )}
                                    {product.stock === 0 && (
                                        <span className="pd-badge pd-badge--error">Sold Out</span>
                                    )}
                                </div>
                                <div className="pd-gallery__zoom-hint">
                                    {imgZoom ? <Icons.ZoomOut /> : <Icons.ZoomIn />}
                                </div>
                            </div>
                        </div>

                        {/* Thumbnail strip */}
                        {product.images?.length > 1 && (
                            <div className="pd-gallery__thumbs">
                                {product.images.map((img, idx) => (
                                    <button
                                        key={idx}
                                        className={`pd-gallery__thumb ${activeImg === idx ? 'pd-gallery__thumb--active' : ''}`}
                                        onClick={() => setActiveImg(idx)}
                                        aria-label={`View image ${idx + 1}`}
                                    >
                                        <img src={img} alt={`Thumbnail ${idx + 1}`}
                                            onError={e => e.target.src = 'https://via.placeholder.com/100'} />
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Trust row */}
                        <div className="pd-trust-row">
                            {[
                                { icon: <Icons.Diamond />, text: 'Certified Healthy' },
                                { icon: <Icons.Leaf />, text: 'Ethically Sourced' },
                                { icon: <Icons.Truck />, text: 'Live Arrival' },
                                { icon: <Icons.Phone />, text: '24/7 Support' },
                            ].map((t, i) => (
                                <div className="pd-trust-item" key={i}>
                                    <div className="pd-trust-item__icon">{t.icon}</div>
                                    <span className="pd-trust-item__text">{t.text}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ── RIGHT: Product Info ── */}
                    <div className="pd-info">
                        <div className="pd-info__header">
                            <div className="pd-info__tags">
                                <span className="pd-tag pd-tag--cat">{product.category}</span>
                                {product.subcategory && (
                                    <span className="pd-tag pd-tag--sub">{product.subcategory}</span>
                                )}
                            </div>
                            <h1 className="pd-info__name">{product.name}</h1>
                            <div className="pd-info__meta-top">
                                <div className="pd-stars">
                                    {[1, 2, 3, 4, 5].map(s => (
                                        <div key={s} className={`pd-star ${s <= 4 ? 'pd-star--filled' : ''}`}>
                                            <Icons.Star fill={s <= 4} />
                                        </div>
                                    ))}
                                </div>
                                <span className="pd-info__reviews">4.8 · Expert Verified</span>
                            </div>
                        </div>

                        <div className="pd-info__price-block">
                            <span className="pd-info__price">₹{product.price?.toLocaleString()}</span>
                            <span className="pd-info__price-note">Incl. taxes. Shipping calculated at checkout.</span>
                        </div>

                        <div className="pd-divider"></div>

                        <div className="pd-info__desc-block">
                            <h3 className="pd-info__section-title">Specimen Overview</h3>
                            <p className="pd-info__desc">
                                {product.description ||
                                    'An expertly curated specimen, thoroughly guaranteed for health and vitality. Our in-house marine biologists personally inspect every addition to ensure it meets rigorous standards for quality, temperament, and resilience.'}
                            </p>
                        </div>

                        {/* Delivery Meta Grid */}
                        <div className="pd-meta-grid">
                            <div className="pd-meta-item">
                                <span className="pd-meta-label">Stock Status</span>
                                <span className={stockInfo.classes}>
                                    {stockInfo.label}
                                </span>
                            </div>
                            <div className="pd-meta-item">
                                <span className="pd-meta-label">Dispatch Time</span>
                                <span className="pd-meta-value">Within 24-48 Hours</span>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="pd-actions-wrapper">
                            {product.stock > 0 && (
                                <div className="pd-qty-group">
                                    <span className="pd-qty-label">Quantity</span>
                                    <div className="pd-qty-input">
                                        <button
                                            className="pd-qty-btn"
                                            onClick={() => setQty(q => Math.max(1, q - 1))}
                                            disabled={qty <= 1}
                                            aria-label="Decrease quantity"
                                        >
                                            <Icons.Minus />
                                        </button>
                                        <span className="pd-qty-val">{qty}</span>
                                        <button
                                            className="pd-qty-btn"
                                            onClick={() => setQty(q => Math.min(product.stock, q + 1))}
                                            disabled={qty >= product.stock}
                                            aria-label="Increase quantity"
                                        >
                                            <Icons.Plus />
                                        </button>
                                    </div>
                                </div>
                            )}

                            <div className="pd-ctas">
                                <button
                                    className={`pd-btn pd-btn--primary pd-btn--lg pd-btn--full ${added ? 'pd-btn--success' : ''}`}
                                    onClick={handleAddToCart}
                                    disabled={added || product.stock === 0}
                                >
                                    {added ? (
                                        <>
                                            <Icons.Check /> {qty > 1 ? `${qty} Items Added` : 'Added to Cart'}
                                        </>
                                    ) : product.stock === 0 ? (
                                        'Out of Stock'
                                    ) : (
                                        `Add to Cart — ₹${(product.price * qty).toLocaleString()}`
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* View cart hint */}
                        <div className={`pd-cart-hint ${added ? 'pd-cart-hint--visible' : ''}`}>
                            Item secured in your registry. <Link to="/cart">Proceed to checkout →</Link>
                        </div>

                        {/* Biologist Note */}
                        <div className="pd-expert-note">
                            <div className="pd-expert-note__icon">
                                <Icons.Microscope />
                            </div>
                            <div className="pd-expert-note__content">
                                <strong>Biologist's Guarantee</strong>
                                <p>Every specimen undergoes a stringent 14-day quarantine and health screening before dispatch, accompanied by full biological documentation.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="pd-footer">
                <div className="pd-container pd-footer__inner">
                    <div className="pd-footer__copy">
                        <img src={logo} alt="Sea Star Fish Aquarium" className="pd-footer__logo-img" />
                        <span>© {new Date().getFullYear()} Sea Star Fish Aquarium  . All rights reserved.</span>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default ProductDetail;
