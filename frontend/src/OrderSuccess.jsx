import React from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import './OrderSuccess.css';

const OrderSuccess = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const orderId = location.state?.orderId;

    return (
        <div className="os-root">
            <div className="os-card">
                {/* Success Icon */}
                <div className="os-icon">✓</div>

                <h1 className="os-title">Treasures Secured!</h1>

                {/* Tracking ID Block */}
                {orderId && (
                    <div className="os-tracking-block">
                        <span className="os-tracking-label">Consignment ID / Tracking</span>
                        <strong className="os-tracking-id">{orderId}</strong>
                        <p className="os-tracking-hint">Please record this unique ID to track your biological transport.</p>
                    </div>
                )}

                <p className="os-message">
                    Thank you for choosing SeaStarFish Aquarium. Your aquatic specimens have been reserved,
                    and our marine biologists are currently preparing them for their safe journey to your sanctuary.
                </p>

                {/* Actions */}
                <div className="os-actions">
                    <button className="os-btn os-btn--primary" onClick={() => navigate('/shop')}>
                        Back to Registry
                    </button>
                    <button className="os-btn os-btn--outline" onClick={() => navigate(`/track?id=${orderId || ''}`)}>
                        Track Logistics →
                    </button>
                </div>

                {/* Footer Notes */}
                <div className="os-footer">
                    <p className="os-footer-title">Next Steps</p>
                    <p className="os-footer-text">
                        A specialist will contact you shortly regarding the logistics and live arrival guarantee
                        for your new specimens.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default OrderSuccess;
