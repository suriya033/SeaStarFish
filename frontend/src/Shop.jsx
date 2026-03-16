import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from './CartContext';
import './Shop.css';

const CATEGORIES = [
    { value: '', label: 'All Specimens', icon: '🌊' },
    { value: 'Fish', label: 'Aquarium Fish', icon: '🐠' },
    { value: 'Coral', label: 'Reef & Coral', icon: '🪸' },
    { value: 'Equipment', label: 'Equipment', icon: '⚙️' },
    { value: 'Tanks', label: 'Tank Systems', icon: '🔬' },
];

const Shop = () => {
    const navigate = useNavigate();
    const { addToCart, totalItems } = useCart();

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');
    const [addedId, setAddedId] = useState(null);
    const [scrolled, setScrolled] = useState(false);
    const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 60);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => { fetchProducts(); }, [category]);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (category) params.append('category', category);
            if (search) params.append('search', search);
            const res = await axios.get(`http://localhost:5000/api/products?${params}`);
            setProducts(res.data);
        } catch (e) { console.error(e); }
        setLoading(false);
    };

    const handleAddToCart = (product) => {
        addToCart(product);
        setAddedId(product._id);
        setTimeout(() => setAddedId(null), 2000);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchProducts();
    };

    const activeLabel = CATEGORIES.find(c => c.value === category)?.label || 'All Specimens';

    return (
        <div className="shop-root">

            {/* ══════════════════════════════
                HEADER
            ═══════════════════════════════ */}
            <header className={`shop-header ${scrolled ? 'shop-header--solid' : ''}`}>
                <div className="shop-container shop-header__inner">
                    <Link to="/" className="shop-brand">
                        <span className="shop-brand__icon">🐟</span>
                        <div>
                            <div className="shop-brand__name">SeaStar</div>
                            <div className="shop-brand__sub"> </div>
                        </div>
                    </Link>

                    <nav className="shop-nav">
                        <Link to="/" className="shop-nav__link">Home</Link>
                        <Link to="/shop" className="shop-nav__link shop-nav__link--active">Registry</Link>
                        <Link to="/track" className="shop-nav__link">Track Order</Link>
                    </nav>

                    <div className="shop-header__actions">
                        <Link to="/cart" className="shop-cart-btn">
                            🛒
                            {totalItems > 0 && <span className="shop-cart-badge">{totalItems}</span>}
                        </Link>
                    </div>
                </div>
            </header>

            {/* ══════════════════════════════
                HERO BANNER
            ═══════════════════════════════ */}
            <div className="shop-hero">
                <div className="shop-hero__overlay" />
                <div className="shop-container shop-hero__content">
                    <p className="shop-hero__eyebrow">CURATED AQUATIC SPECIMENS</p>
                    <h1 className="shop-hero__title">The  </h1>
                    <p className="shop-hero__desc">
                        Exquisite aquatic specimens and precision life-support infrastructure,
                        curated for the professional aquarist.
                    </p>
                    <div className="shop-hero__stats">
                        <div className="shop-hero__stat"><strong>{products.length || '—'}</strong><span>Current Listings</span></div>
                        <div className="shop-hero__divider" />
                        <div className="shop-hero__stat"><strong>100%</strong><span>Live Arrival</span></div>
                        <div className="shop-hero__divider" />
                        <div className="shop-hero__stat"><strong>Free</strong><span>Shipping ₹5k+</span></div>
                    </div>
                </div>
            </div>

            {/* ══════════════════════════════
                FILTER TOOLBAR (floated card)
            ═══════════════════════════════ */}
            <div className="shop-container">
                <div className="shop-toolbar">
                    {/* Search */}
                    <form onSubmit={handleSearch} className="shop-toolbar__search">
                        <span className="shop-toolbar__search-icon">🔍</span>
                        <input
                            type="text"
                            placeholder="Search species, equipment..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="shop-toolbar__input"
                        />
                        <button type="submit" className="shop-toolbar__search-btn">Search</button>
                    </form>

                    {/* View toggle */}
                    <div className="shop-toolbar__view">
                        <button
                            className={`shop-view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                            onClick={() => setViewMode('grid')}
                            title="Grid view"
                        >⊞</button>
                        <button
                            className={`shop-view-btn ${viewMode === 'list' ? 'active' : ''}`}
                            onClick={() => setViewMode('list')}
                            title="List view"
                        >☰</button>
                    </div>
                </div>

                {/* Category pills */}
                <div className="shop-cats">
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat.value}
                            className={`shop-cat-pill ${category === cat.value ? 'active' : ''}`}
                            onClick={() => setCategory(cat.value)}
                        >
                            <span>{cat.icon}</span> {cat.label}
                        </button>
                    ))}
                </div>

                {/* Results meta */}
                {!loading && (
                    <div className="shop-results-meta">
                        <span>
                            Showing <strong>{products.length}</strong> specimen{products.length !== 1 ? 's' : ''} in <strong>{activeLabel}</strong>
                        </span>
                        {(search || category) && (
                            <button
                                className="shop-clear-btn"
                                onClick={() => { setCategory(''); setSearch(''); }}
                            >
                                ✕ Clear filters
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* ══════════════════════════════
                PRODUCTS
            ═══════════════════════════════ */}
            <main className="shop-container shop-main">

                {loading ? (
                    <div className="shop-loading">
                        <div className="shop-spinner" />
                        <p>Syncing with ocean database...</p>
                    </div>

                ) : products.length === 0 ? (
                    <div className="shop-empty">
                        <span>🐚</span>
                        <h3>No specimens found</h3>
                        <p>Try adjusting your search or browse all collections.</p>
                        <button className="shop-btn shop-btn--outline" onClick={() => { setCategory(''); setSearch(''); }}>
                            Browse All Specimens
                        </button>
                    </div>

                ) : viewMode === 'grid' ? (
                    /* ── GRID VIEW ── */
                    <div className="shop-grid">
                        {products.map(p => (
                            <div className="shop-card" key={p._id}>
                                <div className="shop-card__img-wrap" onClick={() => navigate(`/product/${p._id}`)}>
                                    <img
                                        src={p.images?.[0] || 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=500&q=80'}
                                        alt={p.name}
                                        className="shop-card__img"
                                        onError={e => e.target.src = 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=500&q=80'}
                                    />
                                    {/* Badges */}
                                    <div className="shop-card__badges">
                                        <span className="shop-card__badge shop-card__badge--cat">{p.category}</span>
                                        {p.stock < 5 && p.stock > 0 && (
                                            <span className="shop-card__badge shop-card__badge--low">Low Stock</span>
                                        )}
                                        {p.stock === 0 && (
                                            <span className="shop-card__badge shop-card__badge--out">Sold Out</span>
                                        )}
                                    </div>
                                    {/* Quick Add overlay */}
                                    <div className="shop-card__overlay">
                                        <button
                                            className="shop-btn shop-btn--white shop-btn--sm"
                                            onClick={e => { e.stopPropagation(); navigate(`/product/${p._id}`); }}
                                        >
                                            View Details
                                        </button>
                                    </div>
                                </div>

                                <div className="shop-card__body">
                                    <span className="shop-card__sub">{p.subcategory || p.category}</span>
                                    <h3 className="shop-card__name" onClick={() => navigate(`/product/${p._id}`)}>
                                        {p.name}
                                    </h3>
                                    {p.description && (
                                        <p className="shop-card__desc">{p.description}</p>
                                    )}
                                    <div className="shop-card__footer">
                                        <div>
                                            <span className="shop-card__price">₹{p.price?.toLocaleString()}</span>
                                            {p.stock > 0 && (
                                                <span className="shop-card__stock">{p.stock} in stock</span>
                                            )}
                                        </div>
                                        <button
                                            className={`shop-btn shop-btn--sm ${addedId === p._id ? 'shop-btn--success' : 'shop-btn--primary'}`}
                                            onClick={() => handleAddToCart(p)}
                                            disabled={addedId === p._id || p.stock === 0}
                                        >
                                            {addedId === p._id ? '✓ Added' : p.stock === 0 ? 'Sold Out' : '+ Cart'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                ) : (
                    /* ── LIST VIEW ── */
                    <div className="shop-list">
                        {products.map(p => (
                            <div className="shop-list-item" key={p._id}>
                                <div className="shop-list-item__img" onClick={() => navigate(`/product/${p._id}`)}>
                                    <img
                                        src={p.images?.[0] || 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=300&q=80'}
                                        alt={p.name}
                                        onError={e => e.target.src = 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=300&q=80'}
                                    />
                                </div>
                                <div className="shop-list-item__info">
                                    <span className="shop-card__sub">{p.category}</span>
                                    <h3 className="shop-list-item__name" onClick={() => navigate(`/product/${p._id}`)}>
                                        {p.name}
                                    </h3>
                                    <p className="shop-list-item__desc">{p.description}</p>
                                    <div className="shop-list-item__stock">
                                        <span className={`shop-stock-dot ${p.stock > 0 ? 'in' : 'out'}`} />
                                        {p.stock > 0 ? `${p.stock} in stock` : 'Out of stock'}
                                    </div>
                                </div>
                                <div className="shop-list-item__actions">
                                    <span className="shop-list-item__price">₹{p.price?.toLocaleString()}</span>
                                    <button
                                        className={`shop-btn ${addedId === p._id ? 'shop-btn--success' : 'shop-btn--primary'}`}
                                        onClick={() => handleAddToCart(p)}
                                        disabled={addedId === p._id || p.stock === 0}
                                    >
                                        {addedId === p._id ? '✓ Added to Cart' : '+ Add to Cart'}
                                    </button>
                                    <button
                                        className="shop-btn shop-btn--outline"
                                        onClick={() => navigate(`/product/${p._id}`)}
                                    >
                                        View Details
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {/* ══════════════════════════════
                FOOTER
            ═══════════════════════════════ */}
            <footer className="shop-footer">
                <div className="shop-container shop-footer__inner">
                    <span>© 2026 Sea Star Fish Aquarium· All rights reserved.</span>
                    <Link to="/" className="shop-footer__link">← Back to Atelier</Link>
                </div>
            </footer>
        </div>
    );
};

export default Shop;
