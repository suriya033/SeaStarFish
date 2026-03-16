import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from './CartContext';
import logo from './assets/logo.png';
import './LandingPage.css';

// --- Premium SVG Icons ---
const Icons = {
    Cart: ({ badge }) => (
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
            {badge > 0 && <span className="lp-cart-badge">{badge}</span>}
        </div>
    ),
    Diamond: () => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M6 3h12l4 6-10 13L2 9Z"></path><path d="M11 3 8 9l4 13 4-13-3-6"></path><path d="M2 9h20"></path></svg>
    ),
    Microscope: () => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M6 18h8"></path><path d="M3 22h18"></path><path d="M14 22a7 7 0 1 0 0-14h-1"></path><path d="M9 14h2"></path><path d="M9 12a2 2 0 0 1-2-2V6h6v4a2 2 0 0 1-2 2Z"></path><path d="M12 6V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3"></path></svg>
    ),
    Truck: () => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
    ),
    Phone: () => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
    ),
    Waves: () => (
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"></path><path d="M2 12c.6.5 1.2 1 2.5 1 3 0 3-2 5.5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"></path><path d="M2 18c.6.5 1.2 1 2.5 1 3 0 3-2 5.5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"></path></svg>
    )
};

const LandingPage = () => {
    const navigate = useNavigate();
    const { addToCart, totalItems } = useCart();
    const [formData, setFormData] = useState({ name: '', phone: '', interest: 'Aquascaping' });
    const [status, setStatus] = useState('');
    const [addedId, setAddedId] = useState(null);
    const [scrolled, setScrolled] = useState(false);
    const [products, setProducts] = useState([]);
    const [loadingProducts, setLoadingProducts] = useState(true);

    useEffect(() => {
        const fetchRecentProducts = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/products?sort=dateAdded');
                setProducts(res.data.slice(0, 4));
            } catch (err) {
                console.error('Failed to fetch products:', err);
            } finally {
                setLoadingProducts(false);
            }
        };
        fetchRecentProducts();
    }, []);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 60);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleAddToCart = (item) => {
        addToCart(item);
        setAddedId(item._id);
        setTimeout(() => setAddedId(null), 2000);
    };

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('Submitting...');
        try {
            const res = await fetch('http://localhost:5000/api/enquiry', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            if (res.ok) {
                setStatus('✅ Thank you! We will be in touch shortly.');
                setFormData({ name: '', phone: '', interest: 'Aquascaping' });
            } else {
                setStatus('Something went wrong. Please try again.');
            }
        } catch {
            setStatus('Connection error. Please try again later.');
        }
    };

    return (
        <div className="lp-root">

            {/* ════════════════════════════════
                HEADER
            ════════════════════════════════ */}
            <header className={`lp-header ${scrolled ? 'lp-header--solid' : 'lp-header--transparent'}`}>
                <div className="lp-container lp-header__inner">
                    <Link to="/" className="lp-brand">
                        <img src={logo} alt="Sea Star Fish Aquarium Logo" className="lp-brand__logo-img" />

                    </Link>

                    <nav className="lp-nav">
                        <Link to="/" className="lp-nav__link lp-nav__link--active">Home</Link>
                        <Link to="/shop" className="lp-nav__link">Registry</Link>
                        <Link to="/track" className="lp-nav__link">Track Order</Link>
                        <a href="#collections" className="lp-nav__link">Collections</a>
                        <a href="#enquiry" className="lp-nav__link">Consultation</a>
                    </nav>

                    <div className="lp-header__actions">
                        <Link to="/cart" className="lp-cart-btn">
                            <Icons.Cart badge={totalItems} />
                        </Link>
                        <button className="lp-btn lp-btn--primary lp-btn--sm" onClick={() => navigate('/shop')}>
                            Shop Now
                        </button>
                    </div>
                </div>
            </header>

            {/* ════════════════════════════════
                HERO
            ════════════════════════════════ */}
            <section className="lp-hero">
                <div className="lp-hero__overlay" />
                <div className="lp-container lp-hero__content">
                    <p className="lp-hero__eyebrow">EPITOME OF AQUATIC ARTISTRY</p>
                    <h1 className="lp-hero__title">Exquisite Marine<br />Ecosystems.</h1>
                    <p className="lp-hero__desc">
                        Curated for the discerning collector. We specialise in rare biological specimens,
                        high-integrity life support systems, and expert-led marine maintenance.
                    </p>
                    <div className="lp-hero__ctas">
                        <button className="lp-btn lp-btn--gold lp-btn--lg" onClick={() => navigate('/shop')}>
                            Access Registry →
                        </button>
                        <button className="lp-btn lp-btn--ghost lp-btn--lg" onClick={() => document.getElementById('enquiry').scrollIntoView({ behavior: 'smooth' })}>
                            Request Consultation
                        </button>
                    </div>
                    <div className="lp-hero__stats">
                        <div className="lp-hero__stat"><strong>500+</strong><span>Rare Species</span></div>
                        <div className="lp-hero__stat-divider" />
                        <div className="lp-hero__stat"><strong>15+</strong><span>Years Excellence</span></div>
                        <div className="lp-hero__stat-divider" />
                        <div className="lp-hero__stat"><strong>2k+</strong><span>Projects Delivered</span></div>
                    </div>
                </div>
                <div className="lp-hero__scroll-cue">
                    <span />
                </div>
            </section>

            {/* ════════════════════════════════
                TRUST BAR
            ════════════════════════════════ */}
            <section className="lp-trust">
                <div className="lp-container lp-trust__grid">
                    {[
                        { icon: <Icons.Diamond />, title: 'Ethically Sourced', sub: 'All specimens certified' },
                        { icon: <Icons.Microscope />, title: 'Biologist-Led', sub: 'Expert care at every step' },
                        { icon: <Icons.Truck />, title: '100% Live Arrival', sub: 'Guaranteed vitality' },
                        { icon: <Icons.Phone />, title: '24 / 7 Support', sub: 'Expert help always available' },
                    ].map((t, i) => (
                        <div className="lp-trust__card" key={i}>
                            <span className="lp-trust__icon">{t.icon}</span>
                            <div>
                                <strong className="lp-trust__title">{t.title}</strong>
                                <span className="lp-trust__sub">{t.sub}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ════════════════════════════════
                CURATED COLLECTIONS
            ════════════════════════════════ */}
            <section className="lp-section" id="collections">
                <div className="lp-container">
                    <div className="lp-section__header">
                        <p className="lp-section__eyebrow">Our Expertise</p>
                        <h2 className="lp-section__title">Curated Collections</h2>
                        <p className="lp-section__desc">Everything you need to create your own underwater masterpiece.</p>
                    </div>

                    <div className="lp-cat-grid">
                        {[
                            {
                                img: 'https://aquariumfishonline.com.au/wp-content/uploads/2019/08/Goldfish-Fantail-Large.jpg',
                                title: 'Exotic Fish',
                                desc: 'Vibrant freshwater species for your home',
                                tag: 'Fish'
                            },
                            {
                                img: 'https://i.pinimg.com/originals/be/70/50/be7050be2d4ff31d5573babdda60f936.jpg',
                                title: 'Aquarium Tanks',
                                desc: 'Premium Tanks',
                                tag: 'TANKS'
                            },
                            {
                                img: 'https://i.ebayimg.com/images/g/ws8AAOSwSl9go5ae/s-l1200.png',
                                title: 'Aquarium Accessories',
                                desc: 'Compact luxury for modern spaces',
                                tag: 'ACCESSORIES'
                            },
                        ].map((cat, i) => (
                            <div className="lp-cat-card" key={i} onClick={() => navigate('/shop')}>
                                <img src={cat.img} alt={cat.title} className="lp-cat-card__img" />
                                <div className="lp-cat-card__overlay">
                                    <span className="lp-cat-card__tag">{cat.tag}</span>
                                    <h3 className="lp-cat-card__title">{cat.title}</h3>
                                    <p className="lp-cat-card__desc">{cat.desc}</p>
                                    <span className="lp-cat-card__cta">Explore Collection →</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ════════════════════════════════
                NEW IN STOCK
            ════════════════════════════════ */}
            <section className="lp-section lp-section--alt">
                <div className="lp-container">
                    <div className="lp-section__header">
                        <p className="lp-section__eyebrow">Latest Additions</p>
                        <h2 className="lp-section__title">New In Registry</h2>
                        <p className="lp-section__desc">Discover the latest biological additions to our curated collection.</p>
                    </div>

                    {loadingProducts ? (
                        <div className="lp-loading">
                            <div className="lp-spinner" />
                            <p>Synchronising with aquatic registry...</p>
                        </div>
                    ) : products.length > 0 ? (
                        <div className="lp-product-grid">
                            {products.map((item) => (
                                <div className="lp-product-card" key={item._id}>
                                    <div className="lp-product-card__img-wrap" onClick={() => navigate('/shop')}>
                                        <img
                                            src={item.images?.[0] || 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=400&q=80'}
                                            alt={item.name}
                                            className="lp-product-card__img"
                                        />
                                        {item.stock < 5 && (
                                            <span className="lp-product-card__badge lp-product-card__badge--limited">Limited</span>
                                        )}
                                        <div className="lp-product-card__hover-overlay">
                                            <button className="lp-btn lp-btn--white lp-btn--sm" onClick={(e) => { e.stopPropagation(); navigate('/shop'); }}>
                                                View Details
                                            </button>
                                        </div>
                                    </div>
                                    <div className="lp-product-card__body">
                                        <span className="lp-product-card__cat">{item.category}</span>
                                        <h3 className="lp-product-card__name" onClick={() => navigate('/shop')}>{item.name}</h3>
                                        <div className="lp-product-card__footer">
                                            <span className="lp-product-card__price">₹{item.price?.toLocaleString()}</span>
                                            <button
                                                className={`lp-btn lp-btn--sm ${addedId === item._id ? 'lp-btn--success' : 'lp-btn--primary'}`}
                                                onClick={() => handleAddToCart(item)}
                                                disabled={addedId === item._id}
                                            >
                                                {addedId === item._id ? '✓ Added' : '+ Cart'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="lp-empty">
                            <Icons.Waves />
                            <p>No specimens currently in registry. Check back soon.</p>
                        </div>
                    )}

                    <div className="lp-section__cta">
                        <button className="lp-btn lp-btn--outline-dark lp-btn--lg" onClick={() => navigate('/shop')}>
                            Browse Full Registry →
                        </button>
                    </div>
                </div>
            </section>

            {/* ════════════════════════════════
                WHY CHOOSE US
            ════════════════════════════════ */}
            <section className="lp-section lp-why">
                <div className="lp-container lp-why__inner">
                    <div className="lp-why__text">
                        <p className="lp-section__eyebrow">Our Difference</p>
                        <h2 className="lp-why__title">Precision Biology.<br />Unmatched Care.</h2>
                        <p className="lp-why__desc">
                            Sea Star Fish Aquarium   combines scientific expertise with a passion for aquatic life.
                            Every specimen in our collection is ethically sourced, health-screened, and delivered with full biological documentation.
                        </p>
                        <ul className="lp-why__list">
                            {[
                                'CITES-compliant specimen sourcing',
                                'Quarantine-tested before dispatch',
                                'Live arrival guarantee on all orders',
                                'Post-purchase expert consultation',
                            ].map((item, i) => (
                                <li key={i} className="lp-why__item">
                                    <span className="lp-why__check">✓</span> {item}
                                </li>
                            ))}
                        </ul>
                        <button className="lp-btn lp-btn--primary lp-btn--lg" onClick={() => navigate('/shop')}>
                            View All Specimens →
                        </button>
                    </div>
                    <div className="lp-why__image-col">
                        <div className="lp-why__img-main">
                            <img src="https://wallpaperaccess.com/full/9490236.jpg" alt="Expert marine care" />
                        </div>
                        <div className="lp-why__img-accent">
                            <img src="https://miro.medium.com/v2/resize:fit:1024/1*KvKYmlc6mn2hdWp-JSAY6w.jpeg" alt="Marine specimens" />
                        </div>
                    </div>
                </div>
            </section>

            {/* ════════════════════════════════
                BESPOKE CONSULTATION
            ════════════════════════════════ */}
            <section className="lp-section lp-section--alt" id="enquiry">
                <div className="lp-container">
                    <div className="lp-enquiry">
                        <div className="lp-enquiry__info">
                            <p className="lp-enquiry__eyebrow">Bespoke Service</p>
                            <h2 className="lp-enquiry__title">Design Your<br />Dream Ecosystem.</h2>
                            <p className="lp-enquiry__desc">
                                From custom aquascaping to high-integrity reef infrastructure — our biologists and designers
                                will engineer your perfect marine environment.
                            </p>
                            <div className="lp-enquiry__stats">
                                <div className="lp-enquiry__stat">
                                    <strong>15+</strong>
                                    <span>Years of Excellence</span>
                                </div>
                                <div className="lp-enquiry__stat">
                                    <strong>2,000+</strong>
                                    <span>Projects Completed</span>
                                </div>
                                <div className="lp-enquiry__stat">
                                    <strong>100%</strong>
                                    <span>Satisfaction Rate</span>
                                </div>
                            </div>
                        </div>

                        <div className="lp-enquiry__form-wrap">
                            <h3 className="lp-enquiry__form-title">Request a Consultation</h3>
                            <form onSubmit={handleSubmit} className="lp-enquiry__form">
                                <div className="lp-form-group">
                                    <label className="lp-form-label">Full Name</label>
                                    <input
                                        className="lp-form-control"
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Your full name"
                                        required
                                    />
                                </div>
                                <div className="lp-form-group">
                                    <label className="lp-form-label">Phone / WhatsApp</label>
                                    <input
                                        className="lp-form-control"
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="+91 00000 00000"
                                        required
                                    />
                                </div>
                                <div className="lp-form-group">
                                    <label className="lp-form-label">Service Required</label>
                                    <select className="lp-form-control" name="interest" value={formData.interest} onChange={handleChange}>
                                        <option value="Aquascaping">Custom Aquascaping</option>
                                        <option value="Marine Setup">Marine Reef Setup</option>
                                        <option value="Maintenance">Ongoing Maintenance</option>
                                    </select>
                                </div>
                                <button type="submit" className="lp-btn lp-btn--primary lp-btn--full lp-btn--lg">
                                    Submit Request
                                </button>
                                {status && <p className="lp-form-status">{status}</p>}
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            {/* ════════════════════════════════
                FOOTER
            ════════════════════════════════ */}
            <footer className="lp-footer">
                <div className="lp-container">
                    <div className="lp-footer__grid">
                        <div className="lp-footer__brand">
                            <div className="lp-brand lp-footer__brand-logo">
                                <img src={logo} alt="Sea Star Fish Aquarium Logo" className="lp-footer__brand-logo-img" />
                                <div className="lp-brand__text">
                                    <div className="lp-brand__name lp-brand__name--light">Sea Star Fish Aquarium</div>
                                    <div className="lp-brand__sub lp-brand__sub--light"> </div>
                                </div>
                            </div>
                            <p className="lp-footer__tagline">
                                Transforming spaces with high-end aquatic design and expert marine biological maintenance since 2010.
                            </p>
                        </div>

                        <div className="lp-footer__col">
                            <h4 className="lp-footer__col-title">Navigate</h4>
                            <ul className="lp-footer__links">
                                <li><Link to="/">The Atelier</Link></li>
                                <li><Link to="/shop">Biological Registry</Link></li>
                                <li><Link to="/track">Track Consignment</Link></li>
                                <li><a href="#collections">Curated Collections</a></li>
                                <li><a href="#enquiry">Book Consultation</a></li>
                            </ul>
                        </div>

                        <div className="lp-footer__col">
                            <h4 className="lp-footer__col-title">Visit The Atelier</h4>
                            <address className="lp-footer__address">
                                Block 7, West Patel Nagar<br />
                                New Delhi — 110008, India<br />
                                <a href="tel:+919876543210" className="lp-footer__phone">+91 98765 43210</a><br />
                                <a href="mailto:info@seastarfish.in" className="lp-footer__email">info@seastarfish.in</a>
                            </address>
                        </div>
                    </div>

                    <div className="lp-footer__bottom">
                        <span>© 2026 Sea Star Fish Aquarium · All rights reserved.</span>
                        <Link to="/login" className="lp-footer__admin">Admin</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
