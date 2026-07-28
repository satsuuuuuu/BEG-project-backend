const express = require('express');
const router = express.Router();
const Category = require('../models/Category');

// GET all categories
router.get('/', async (req, res) => {
    const categories = await Category.find();
    res.json(categories);
});

// POST new category
router.post('/', async (req, res) => {
    try {
        const newCat = new Category({ name: req.body.name });
        await newCat.save();
        res.status(201).json(newCat);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;