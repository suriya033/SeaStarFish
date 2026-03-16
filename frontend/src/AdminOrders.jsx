import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './App.css';

const AdminOrders = () => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchOrders = () => {
        const token = localStorage.getItem('adminToken');
        if (!token) {
            navigate('/login');
            return;
        }

        axios.get('http://localhost:5000/api/orders/all', {
            headers: { 'x-auth-token': token }
        })
            .then(res => {
                setOrders(res.data);
                setLoading(false);
            })
            .catch(err => {
                setLoading(false);
                if (err.response?.status === 401 || err.response?.status === 403) {
                    localStorage.removeItem('adminToken');
                    localStorage.removeItem('adminUser');
                    navigate('/login');
                }
            });
    };

    useEffect(() => {
        fetchOrders();
    }, [navigate]);

    const updateStatus = async (id, newStatus) => {
        const token = localStorage.getItem('adminToken');
        try {
            await axios.put(`http://localhost:5000/api/orders/${id}/status`, { status: newStatus }, {
                headers: { 'x-auth-token': token }
            });
            fetchOrders();
        } catch (err) {
            alert('Failed to update biological transport status.');
        }
    };

    return (
        <div className="admin-layout">
            <aside className="admin-sidebar">
                <div className="brand" style={{ marginBottom: '4rem' }}>
                    <span className="brand-icon">🐟</span>
                    <div className="brand-text">
                        <h1 style={{ color: 'white' }}>SeaStar</h1>
                        <span style={{ color: 'rgba(255,255,255,0.4)', letterSpacing: '2px' }}>CONTROL PANEL</span>
                    </div>
                </div>
                <nav className="admin-nav">
                    <Link to="/admin" className="admin-nav-item">📊 Dashboard</Link>
                    <Link to="/admin/products" className="admin-nav-item">📦 Inventory</Link>
                    <Link to="/admin/orders" className="admin-nav-item active">📝 Orders</Link>
                </nav>
            </aside>

            <main className="admin-main">
                <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3.5rem' }}>
                    <div>
                        <h1 style={{ fontSize: '1.8rem', marginBottom: '0.25rem' }}>Fulfillment Queue</h1>
                        <p style={{ color: 'var(--text-muted)' }}>Manage your active deliveries and customer logistics.</p>
                    </div>
                </header>

                <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-md)', overflow: 'hidden' }}>
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Consignment ID</th>
                                <th>Client Details</th>
                                <th>Destination</th>
                                <th>Logistics Status</th>
                                <th>Date</th>
                                <th>Operations</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="6" style={{ textAlign: 'center', padding: '5rem' }}>Retrieving order logistics...</td></tr>
                            ) : orders.length > 0 ? (
                                orders.map(o => (
                                    <tr key={o._id}>
                                        <td style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-light)' }}>#{o._id.slice(-6).toUpperCase()}</td>
                                        <td>
                                            <div style={{ fontWeight: '700', color: 'var(--primary)' }}>{o.customerName}</div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{o.customerEmail}</div>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--secondary)', fontWeight: '700' }}>₹{o.totalAmount.toLocaleString()}</div>
                                        </td>
                                        <td>
                                            <div style={{ fontSize: '0.8rem' }}>{o.shippingAddress?.address}</div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{o.shippingAddress?.city}, {o.shippingAddress?.state}</div>
                                        </td>
                                        <td>
                                            <select
                                                value={o.status}
                                                onChange={(e) => updateStatus(o._id, e.target.value)}
                                                style={{
                                                    padding: '0.4rem 0.8rem',
                                                    borderRadius: 'var(--radius-sm)',
                                                    fontSize: '0.75rem',
                                                    fontWeight: '700',
                                                    border: '1px solid var(--border)',
                                                    background: o.status === 'Pending' ? '#FEE2E2' : '#DCFCE7',
                                                    color: o.status === 'Pending' ? '#991B1B' : '#166534',
                                                }}
                                            >
                                                <option value="Pending">Pending</option>
                                                <option value="Shipped">Shipped</option>
                                                <option value="Delivered">Delivered</option>
                                                <option value="Cancelled">Cancelled</option>
                                            </select>
                                        </td>
                                        <td style={{ fontSize: '0.85rem' }}>{new Date(o.dateOrdered).toLocaleDateString('en-IN')}</td>
                                        <td>
                                            <Link to={`/track?id=${o._id}`} className="btn btn-ghost btn-sm" style={{ padding: '0.4rem 0.8rem' }}>View Log</Link>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan="6" style={{ textAlign: 'center', padding: '5rem', color: 'var(--text-muted)' }}>No aquatic consignments in the registry.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
};

export default AdminOrders;
