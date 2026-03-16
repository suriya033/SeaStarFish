const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Order = require('../models/Order');
const Product = require('../models/Product');
const { auth, admin } = require('../middleware/auth');

// Create guest order
router.post('/', async (req, res) => {
    if (mongoose.connection.readyState !== 1) {
        return res.status(503).json({ message: 'Registry offline. Synchronizing with ocean systems, please try again in 10s.' });
    }

    try {
        const { items, totalAmount, shippingAddress, customerName, customerEmail, customerPhone } = req.body;

        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ message: 'Invalid manifest: No specimens selected for transport.' });
        }

        // Validate Specimen IDs
        for (const item of items) {
            if (!mongoose.Types.ObjectId.isValid(item.productId)) {
                return res.status(400).json({ message: `Corrupt Specimen ID encountered: ${item.productId}` });
            }
        }

        // Transactional stock update
        const stockUpdates = items.map(item =>
            Product.findByIdAndUpdate(item.productId, { $inc: { stock: -Number(item.quantity) } })
        );
        await Promise.all(stockUpdates);

        const newOrder = new Order({
            customerName,
            customerEmail,
            customerPhone,
            items: items.map(i => ({
                productId: i.productId,
                quantity: Number(i.quantity),
                priceAtPurchase: Number(i.priceAtPurchase)
            })),
            totalAmount: Number(totalAmount),
            shippingAddress
        });

        const savedOrder = await newOrder.save();
        res.status(201).json(savedOrder);
    } catch (error) {
        console.error('FULFILLMENT CRITICAL:', error);

        if (error.name === 'ValidationError') {
            return res.status(400).json({
                message: 'Biological data validation failed.',
                details: Object.values(error.errors).map(e => e.message).join(', '),
                error: 'VALIDATION_ERROR'
            });
        }

        res.status(500).json({
            message: 'Internal Registry Error. Check specimen availability and connection.',
            error: error.message
        });
    }
});

// Get single order for tracking (public)
router.get('/:id', async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('items.productId');
        if (!order) return res.status(404).json({ message: 'Order not found' });
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching order' });
    }
});

// Get user's orders
router.get('/myorders', auth, async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.user.id }).sort({ dateOrdered: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching orders' });
    }
});

// Admin: Get all orders
router.get('/all', auth, admin, async (req, res) => {
    try {
        const orders = await Order.find().populate('userId', 'name email').sort({ dateOrdered: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching orders' });
    }
});

// Admin: Update order status
router.put('/:id/status', auth, admin, async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: 'Error updating order status' });
    }
});

module.exports = router;
