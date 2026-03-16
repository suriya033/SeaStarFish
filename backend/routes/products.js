const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { auth, admin } = require('../middleware/auth');

// Get all products with filters
router.get('/', async (req, res) => {
    try {
        const { category, subcategory, search, minPrice, maxPrice, sort } = req.query;
        let query = {};

        if (category) query.category = category;
        if (subcategory) query.subcategory = subcategory;
        if (search) query.name = { $regex: search, $options: 'i' };
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }

        let products = Product.find(query);

        if (sort) {
            if (sort === 'priceLow') products = products.sort({ price: 1 });
            if (sort === 'priceHigh') products = products.sort({ price: -1 });
            if (sort === 'popularity') products = products.sort({ popularity: -1 });
        } else {
            products = products.sort({ dateAdded: -1 });
        }

        const results = await products;
        res.json(results);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching products' });
    }
});

// Get single product
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching product' });
    }
});

// Admin: Add product
router.post('/', auth, admin, async (req, res) => {
    try {
        const newProduct = new Product(req.body);
        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(500).json({ message: 'Error adding product' });
    }
});

// Admin: Update product
router.put('/:id', auth, admin, async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedProduct);
    } catch (error) {
        res.status(500).json({ message: 'Error updating product' });
    }
});

// Admin: Delete product
router.delete('/:id', auth, admin, async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.json({ message: 'Product deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting product' });
    }
});

module.exports = router;
