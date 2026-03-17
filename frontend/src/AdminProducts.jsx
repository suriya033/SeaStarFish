import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_BASE_URL from './apiConfig';
import './App.css';

const EMPTY_FORM = {
    name: '', description: '', price: '', category: 'Fish',
    subcategory: '', stock: '', images: ['']
};

const AdminProducts = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState(EMPTY_FORM);
    const [uploading, setUploading] = useState(false);
    const [uploadMode, setUploadMode] = useState('url'); // 'url' | 'file'
    const [previewImg, setPreviewImg] = useState('');
    const [submitMsg, setSubmitMsg] = useState('');
    const fileInputRef = useRef(null);

    useEffect(() => { fetchProducts(); }, []);

    const token = () => localStorage.getItem('adminToken');

    const handleAuthError = (err) => {
        if (err.response?.status === 401 || err.response?.status === 403) {
            localStorage.removeItem('adminToken');
            localStorage.removeItem('adminUser');
            navigate('/login');
        }
    };

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${API_BASE_URL}/api/products`);
            setProducts(res.data);
        } catch (err) { handleAuthError(err); }
        setLoading(false);
    };

    // ── Image upload from local device ─────────────────────────────
    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Quick local preview
        const reader = new FileReader();
        reader.onload = (ev) => setPreviewImg(ev.target.result);
        reader.readAsDataURL(file);

        // Upload to backend
        setUploading(true);
        setSubmitMsg('');
        try {
            const fd = new FormData();
            fd.append('image', file);
            const res = await axios.post(`${API_BASE_URL}/api/upload`, fd, {
                headers: {
                    'x-auth-token': token(),
                    'Content-Type': 'multipart/form-data'
                }
            });
            setForm(f => ({ ...f, images: [res.data.url] }));
            setSubmitMsg('✅ Image uploaded successfully!');
        } catch (err) {
            setSubmitMsg('❌ Upload failed. Please try again.');
            handleAuthError(err);
        } finally {
            setUploading(false);
        }
    };

    // ── URL mode ───────────────────────────────────────────────────
    const handleUrlChange = (e) => {
        const url = e.target.value;
        setForm(f => ({ ...f, images: [url] }));
        setPreviewImg(url);
    };

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitMsg('');
        try {
            await axios.post(`${API_BASE_URL}/api/products`, form, {
                headers: { 'x-auth-token': token() }
            });
            setShowForm(false);
            setForm(EMPTY_FORM);
            setPreviewImg('');
            setUploadMode('url');
            setSubmitMsg('');
            fetchProducts();
        } catch (err) {
            setSubmitMsg('❌ Could not save product. Please try again.');
            handleAuthError(err);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Remove this specimen from the registry?')) return;
        try {
            await axios.delete(`${API_BASE_URL}/api/products/${id}`, {
                headers: { 'x-auth-token': token() }
            });
            fetchProducts();
        } catch (err) { handleAuthError(err); }
    };

    const openForm = () => {
        setForm(EMPTY_FORM);
        setPreviewImg('');
        setUploadMode('url');
        setSubmitMsg('');
        setShowForm(true);
    };

    return (
        <div className="admin-layout">
            {/* ── SIDEBAR ── */}
            <aside className="admin-sidebar">
                <div className="brand" style={{ marginBottom: '4rem' }}>
                    <span className="brand-icon">🐟</span>
                    <div className="brand-text">
                        <h1 style={{ color: 'white' }}>SeaStarFish</h1>
                        <span style={{ color: 'rgba(255,255,255,0.4)', letterSpacing: '2px' }}>CONTROL PANEL</span>
                    </div>
                </div>
                <nav className="admin-nav">
                    <Link to="/admin" className="admin-nav-item">📊 Dashboard</Link>
                    <Link to="/admin/products" className="admin-nav-item active">📦 Inventory</Link>
                    <Link to="/admin/orders" className="admin-nav-item">📝 Orders</Link>
                </nav>
            </aside>

            {/* ── MAIN ── */}
            <main className="admin-main">
                <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3.5rem' }}>
                    <div>
                        <h1 style={{ fontSize: '1.8rem', marginBottom: '0.25rem' }}>Specimen Registry</h1>
                        <p style={{ color: 'var(--text-muted)' }}>Manage your catalog of exotic marine life and equipment.</p>
                    </div>
                    <button
                        className={`btn ${showForm ? 'btn-outline' : 'btn-primary'}`}
                        onClick={() => showForm ? setShowForm(false) : openForm()}
                    >
                        {showForm ? '✕ Close Editor' : '+ New Entry'}
                    </button>
                </header>

                {/* ── ADD / EDIT FORM ── */}
                {showForm && (
                    <div style={{
                        background: 'white', borderRadius: 'var(--radius-lg)',
                        padding: '3rem', marginBottom: '4rem',
                        boxShadow: 'var(--shadow-xl)', border: '1px solid var(--border)'
                    }}>
                        <h3 style={{ marginBottom: '2rem', fontSize: '1.4rem' }}>New Registry Entry</h3>
                        <form onSubmit={handleSubmit}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>

                                {/* Specimen Name */}
                                <div className="form-group">
                                    <label>Specimen Name</label>
                                    <input
                                        className="form-control" type="text" name="name"
                                        value={form.name} onChange={handleChange}
                                        placeholder="e.g. Blue Tang" required
                                    />
                                </div>

                                {/* Price */}
                                <div className="form-group">
                                    <label>Market Price (₹)</label>
                                    <input
                                        className="form-control" type="number" name="price"
                                        value={form.price} onChange={handleChange}
                                        placeholder="5000" required
                                    />
                                </div>

                                {/* Category */}
                                <div className="form-group">
                                    <label>Biological Class</label>
                                    <select className="form-control" name="category" value={form.category} onChange={handleChange}>
                                        <option value="Fish">Fish (Vertebrates)</option>
                                        <option value="Coral">Coral &amp; Inverts</option>
                                        <option value="Equipment">Technical Equipment</option>
                                        <option value="Tanks">Glass Systems</option>
                                    </select>
                                </div>

                                {/* Stock */}
                                <div className="form-group">
                                    <label>Inventory Count</label>
                                    <input
                                        className="form-control" type="number" name="stock"
                                        value={form.stock} onChange={handleChange}
                                        placeholder="10" required
                                    />
                                </div>

                                {/* ── IMAGE UPLOAD (full width) ─────────────────── */}
                                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                                    <label>Showcase Image</label>

                                    {/* Toggle tabs */}
                                    <div style={{
                                        display: 'flex', gap: '0', marginBottom: '1rem',
                                        border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)',
                                        overflow: 'hidden', width: 'fit-content'
                                    }}>
                                        {['url', 'file'].map(mode => (
                                            <button
                                                key={mode} type="button"
                                                onClick={() => { setUploadMode(mode); setSubmitMsg(''); }}
                                                style={{
                                                    padding: '0.55rem 1.5rem',
                                                    fontWeight: '700', fontSize: '0.8rem',
                                                    letterSpacing: '0.5px', cursor: 'pointer',
                                                    border: 'none',
                                                    background: uploadMode === mode ? 'var(--primary)' : 'white',
                                                    color: uploadMode === mode ? 'white' : 'var(--text-muted)',
                                                    transition: 'all 0.2s'
                                                }}
                                            >
                                                {mode === 'url' ? '🔗 Paste URL' : '📁 Upload File'}
                                            </button>
                                        ))}
                                    </div>

                                    {/* URL input */}
                                    {uploadMode === 'url' && (
                                        <input
                                            className="form-control" type="url"
                                            value={form.images[0]}
                                            onChange={handleUrlChange}
                                            placeholder="https://images.unsplash.com/photo-..."
                                        />
                                    )}

                                    {/* File input */}
                                    {uploadMode === 'file' && (
                                        <div
                                            onClick={() => fileInputRef.current?.click()}
                                            style={{
                                                border: '2px dashed var(--border)',
                                                borderRadius: 'var(--radius-md)',
                                                padding: '2.5rem',
                                                textAlign: 'center',
                                                cursor: 'pointer',
                                                background: 'var(--bg-accent)',
                                                transition: 'all 0.3s'
                                            }}
                                            onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--primary)'}
                                            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
                                        >
                                            {uploading ? (
                                                <div>
                                                    <div style={{
                                                        width: '36px', height: '36px',
                                                        border: '3px solid var(--border)',
                                                        borderTopColor: 'var(--secondary)',
                                                        borderRadius: '50%',
                                                        animation: 'spin 0.9s linear infinite',
                                                        margin: '0 auto 1rem'
                                                    }} />
                                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Uploading to server...</p>
                                                </div>
                                            ) : (
                                                <>
                                                    <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>📤</div>
                                                    <p style={{ fontWeight: '700', color: 'var(--primary)', marginBottom: '0.35rem' }}>
                                                        Click to select an image
                                                    </p>
                                                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                                        JPG, PNG, WEBP or GIF · Max 10 MB
                                                    </p>
                                                </>
                                            )}
                                            <input
                                                ref={fileInputRef}
                                                type="file"
                                                accept="image/*"
                                                style={{ display: 'none' }}
                                                onChange={handleFileChange}
                                            />
                                        </div>
                                    )}

                                    {/* Preview */}
                                    {previewImg && (
                                        <div style={{ marginTop: '1rem', position: 'relative', display: 'inline-block' }}>
                                            <img
                                                src={previewImg}
                                                alt="Preview"
                                                onError={() => setPreviewImg('')}
                                                style={{
                                                    width: '180px', height: '135px',
                                                    objectFit: 'cover',
                                                    borderRadius: 'var(--radius-md)',
                                                    border: '3px solid var(--primary)',
                                                    display: 'block'
                                                }}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => { setPreviewImg(''); setForm(f => ({ ...f, images: [''] })); }}
                                                style={{
                                                    position: 'absolute', top: '-8px', right: '-8px',
                                                    background: '#E11D48', color: 'white',
                                                    border: 'none', borderRadius: '50%',
                                                    width: '22px', height: '22px',
                                                    cursor: 'pointer', fontSize: '0.7rem', fontWeight: '800'
                                                }}
                                            >✕</button>
                                            <span style={{
                                                display: 'block', fontSize: '0.72rem',
                                                color: '#16A34A', fontWeight: '700', marginTop: '0.5rem'
                                            }}>✓ Image ready</span>
                                        </div>
                                    )}

                                    {/* Status message */}
                                    {submitMsg && (
                                        <p style={{
                                            marginTop: '0.75rem', fontSize: '0.85rem',
                                            fontWeight: '600',
                                            color: submitMsg.startsWith('✅') ? '#16A34A' : '#E11D48'
                                        }}>{submitMsg}</p>
                                    )}
                                </div>

                                {/* Description */}
                                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                                    <label>Registry Description</label>
                                    <textarea
                                        className="form-control" name="description"
                                        value={form.description} onChange={handleChange}
                                        rows="4"
                                        placeholder="Describe the specimen's care requirements, temperament, and origin..."
                                        required
                                    />
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '1rem', marginTop: '2.5rem' }}>
                                <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={uploading}>
                                    {uploading ? 'Uploading...' : 'Commit to Registry'}
                                </button>
                                <button type="button" className="btn btn-outline" style={{ flex: 1 }} onClick={() => setShowForm(false)}>
                                    Discard
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* ── PRODUCT TABLE ── */}
                <div style={{
                    background: 'white', borderRadius: 'var(--radius-lg)',
                    border: '1px solid var(--border)', boxShadow: 'var(--shadow-md)', overflow: 'hidden'
                }}>
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Specimen Profile</th>
                                <th>Category</th>
                                <th>Inventory</th>
                                <th>Price</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="5" style={{ textAlign: 'center', padding: '5rem' }}>Synchronising inventory...</td></tr>
                            ) : products.length > 0 ? (
                                products.map(p => (
                                    <tr key={p._id}>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                <img
                                                    src={p.images?.[0] || 'https://via.placeholder.com/60x60?text=No+Img'}
                                                    alt={p.name}
                                                    style={{ width: '56px', height: '56px', borderRadius: 'var(--radius-sm)', objectFit: 'cover', border: '1px solid var(--border)' }}
                                                    onError={e => e.target.src = 'https://via.placeholder.com/60x60?text=Img'}
                                                />
                                                <div>
                                                    <div style={{ fontWeight: '700', color: 'var(--primary)' }}>{p.name}</div>
                                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>{p.subcategory || 'General'}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td><span style={{ fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', color: 'var(--text-muted)' }}>{p.category}</span></td>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: p.stock > 5 ? '#16A34A' : '#E11D48' }} />
                                                <span style={{ fontWeight: '700', fontSize: '0.875rem' }}>{p.stock} units</span>
                                            </div>
                                        </td>
                                        <td style={{ fontWeight: '800', color: 'var(--secondary)' }}>₹{p.price?.toLocaleString()}</td>
                                        <td>
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <button
                                                    className="btn btn-ghost btn-sm"
                                                    style={{ color: '#E11D48', padding: '0.4rem 0.8rem' }}
                                                    onClick={() => handleDelete(p._id)}
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan="5" style={{ textAlign: 'center', padding: '5rem', color: 'var(--text-muted)' }}>The inventory is currently empty.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
};

export default AdminProducts;
