import React from 'react';
import { Link } from 'react-router-dom';
import './App.css';

const NotFound = () => {
    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-bg)', padding: '20px', textAlign: 'center' }}>
            <div style={{ maxWidth: '500px' }}>
                <div style={{ fontSize: '8rem', color: 'var(--color-accent)', opacity: 0.15, fontWeight: '900', lineHeight: 1, marginBottom: '-40px' }}>404</div>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '16px' }}>Ocean Not Found</h1>
                <p style={{ color: 'var(--color-muted)', marginBottom: '32px', fontSize: '1.1rem' }}>
                    Oops! Looks like you've drifted into uncharted waters. The page you're looking for doesn't exist.
                </p>
                <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
                    <Link to="/" className="btn btn-primary btn-lg">Back to Shore</Link>
                    <Link to="/shop" className="btn btn-ghost btn-lg">Explore Shop</Link>
                </div>
            </div>
        </div>
    );
};

export default NotFound;
