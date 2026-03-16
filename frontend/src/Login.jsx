import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './App.css';

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('adminToken');
        if (token) navigate('/admin');
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const res = await axios.post('http://localhost:5000/api/auth/login', formData);
            if (res.data.user && res.data.user.role === 'admin') {
                localStorage.setItem('adminToken', res.data.token);
                localStorage.setItem('adminUser', JSON.stringify(res.data.user));
                navigate('/admin');
            } else {
                setError('Access denied. This portal is for administrators only.');
            }
        } catch (err) {
            const message = err.response?.data?.message || 'Invalid email or password. Please try again.';
            setError(message);
        }
        setLoading(false);
    };

    return (
        <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, var(--primary) 0%, #1e293b 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
            {/* Subtle background particles effect placeholder */}
            <div style={{ position: 'absolute', top: '10%', left: '10%', width: '400px', height: '400px', background: 'var(--highlight)', filter: 'blur(150px)', opacity: 0.1, zIndex: 0 }}></div>

            <div style={{ background: 'rgba(255, 255, 255, 0.98)', padding: '4rem', borderRadius: 'var(--radius-lg)', width: '100%', maxWidth: '480px', boxShadow: 'var(--shadow-xl)', position: 'relative', zIndex: 1, backdropFilter: 'blur(10px)' }}>
                <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: '700', marginBottom: '3rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    ← Back to Store
                </Link>

                <div className="brand" style={{ justifyContent: 'center', marginBottom: '1.5rem' }}>
                    <span className="brand-icon" style={{ fontSize: '3rem' }}>🐟</span>
                    <div className="brand-text">
                        <h1 style={{ color: 'var(--primary)', fontSize: '2rem' }}>SeaStar</h1>
                        <span style={{ color: 'var(--text-light)', letterSpacing: '4px' }}>AQUARIUM</span>
                    </div>
                </div>

                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Central Control</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Authorized Personnel Access Systems Only.</p>
                </div>

                {error && (
                    <div style={{ background: '#FFF1F2', color: '#E11D48', padding: '1rem', borderRadius: 'var(--radius-sm)', fontSize: '0.875rem', fontWeight: '700', border: '1px solid #FFE4E6', marginBottom: '2rem', textAlign: 'center' }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Registry Email</label>
                        <input
                            className="form-control"
                            type="email"
                            placeholder="admin@seastar.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                            style={{ padding: '1rem 1.25rem' }}
                        />
                    </div>
                    <div className="form-group">
                        <label>Access Password</label>
                        <input
                            className="form-control"
                            type="password"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required
                            style={{ padding: '1rem 1.25rem' }}
                        />
                    </div>

                    <button type="submit" className="btn btn-primary btn-full btn-lg" style={{ marginTop: '1rem', padding: '1.25rem' }} disabled={loading}>
                        {loading ? 'Authenticating...' : 'Sign In To Console'}
                    </button>

                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2.5rem', gap: '2rem' }}>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-light)', fontWeight: '700', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>🔒 Encrypted</span>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-light)', fontWeight: '700', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>🛡️ Protected</span>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
