import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './App.css';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [enquiries, setEnquiries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [admin, setAdmin] = useState(null);
    const [totalProducts, setTotalProducts] = useState(0);
    const [totalOrders, setTotalOrders] = useState(0);

    useEffect(() => {
        const token = localStorage.getItem('adminToken');
        const userStr = localStorage.getItem('adminUser');
        if (userStr) setAdmin(JSON.parse(userStr));

        const fetchData = async () => {
            setLoading(true);
            try {
                const [enqRes, prodRes, ordRes] = await Promise.all([
                    axios.get('http://localhost:5000/api/admin/enquiries', { headers: { 'x-auth-token': token } }),
                    axios.get('http://localhost:5000/api/products'),
                    axios.get('http://localhost:5000/api/orders/all', { headers: { 'x-auth-token': token } })
                ]);
                setEnquiries(enqRes.data);
                setTotalProducts(prodRes.data.length);
                setTotalOrders(ordRes.data.length);
            } catch (err) {
                console.error('Fast sync failed:', err);
                if (err.response?.status === 401 || err.response?.status === 403) {
                    handleLogout();
                }
            }
            setLoading(false);
        };
        fetchData();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        navigate('/login');
    };

    return (
        <div className="admin-layout">
            {/* Sidebar */}
            <aside className="admin-sidebar" style={{ background: 'var(--primary)', color: 'white', display: 'flex', flexDirection: 'column' }}>
                <div className="brand" style={{ marginBottom: '4rem' }}>
                    <span className="brand-icon">🐟</span>
                    <div className="brand-text">
                        <h1 style={{ color: 'white', textTransform: 'none', letterSpacing: '-1px' }}>SeaStar</h1>
                        <span style={{ color: 'rgba(255,255,255,0.4)', letterSpacing: '4px', fontSize: '0.65rem' }}>OPERATIONS COMMAND</span>
                    </div>
                </div>

                <nav style={{ flex: 1 }}>
                    <div className="admin-nav">
                        <Link to="/admin" className="admin-nav-item active">📊 Dashboard</Link>
                        <Link to="/admin/products" className="admin-nav-item">📦 Inventory</Link>
                        <Link to="/admin/orders" className="admin-nav-item">📝 Orders</Link>
                        <Link to="/admin/customers" className="admin-nav-item">👥 Customers</Link>
                    </div>
                </nav>

                <div style={{ marginTop: 'auto', paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <strong style={{ display: 'block', fontSize: '0.9rem' }}>{admin?.name}</strong>
                        <span style={{ fontSize: '0.75rem', opacity: 0.6 }}>Primary Administrator</span>
                    </div>
                    <button onClick={handleLogout} className="btn btn-outline btn-sm btn-full" style={{ color: 'white', borderColor: 'rgba(255,255,255,0.2)' }}>Sign Out</button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="admin-main" style={{ background: 'var(--bg-main)' }}>
                <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                    <div>
                        <h1 style={{ fontSize: '2.25rem', marginBottom: '0.25rem' }}>Operations Hub</h1>
                        <p style={{ color: 'var(--text-muted)' }}>Synchronizing with biological and logistics registries.</p>
                    </div>
                    <Link to="/" className="btn btn-outline btn-sm">View Public Site →</Link>
                </header>

                {/* Stats Grid */}
                <div className="stats-grid">
                    <div className="stat-card" onClick={() => navigate('/admin/products')} style={{ cursor: 'pointer' }}>
                        <span>Biological Registry</span>
                        <strong>{totalProducts}</strong>
                        <p style={{ fontSize: '0.75rem', color: '#16A34A', marginTop: '0.5rem', fontWeight: '700' }}>Active Specimens</p>
                    </div>
                    <div className="stat-card">
                        <span>Pending Consultations</span>
                        <strong>{enquiries.length}</strong>
                        <p style={{ fontSize: '0.75rem', color: 'var(--secondary)', marginTop: '0.5rem', fontWeight: '700' }}>Action Required</p>
                    </div>
                    <div className="stat-card" onClick={() => navigate('/admin/orders')} style={{ cursor: 'pointer' }}>
                        <span>Consignment Volume</span>
                        <strong>{totalOrders}</strong>
                        <p style={{ fontSize: '0.75rem', color: 'var(--highlight)', marginTop: '0.5rem', fontWeight: '700' }}>Tracking Logs</p>
                    </div>
                    <div className="stat-card">
                        <span>Success Rate</span>
                        <strong>100%</strong>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginTop: '0.5rem', fontWeight: '700' }}>Live arrival guarantee</p>
                    </div>
                </div>

                {/* Enquiries Table */}
                <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', padding: '2rem', boxShadow: 'var(--shadow-md)', border: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                        <h2 style={{ fontSize: '1.25rem' }}>Recent Enquiries</h2>
                        <button className="btn btn-ghost btn-sm">Export Data</button>
                    </div>

                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Requester Name</th>
                                <th>Contact Information</th>
                                <th>Project Interest</th>
                                <th>Date Received</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="5" style={{ textAlign: 'center', padding: '4rem' }}>Synchronizing local database...</td></tr>
                            ) : enquiries.length > 0 ? (
                                enquiries.map(enq => (
                                    <tr key={enq._id}>
                                        <td style={{ fontWeight: '700', color: 'var(--primary)' }}>{enq.name}</td>
                                        <td style={{ fontSize: '0.875rem' }}>{enq.phone}</td>
                                        <td>
                                            <span style={{ background: 'var(--bg-accent)', color: 'var(--primary)', padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-full)', fontSize: '0.75rem', fontWeight: '800' }}>
                                                {enq.interest}
                                            </span>
                                        </td>
                                        <td style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                                            {new Date(enq.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </td>
                                        <td>
                                            <span style={{ color: '#16A34A', fontSize: '0.8rem', fontWeight: '800' }}>● New</span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan="5" style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-light)' }}>No active enquiries at this moment.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
