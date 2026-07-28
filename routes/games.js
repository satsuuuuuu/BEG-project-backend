const express = require('express');
const router = express.Router();
const Game = require('../models/Game');

// ADD NEW GAME
router.post('/', async (req, res) => {
    try {
        const newGame = new Game(req.body);
        const savedGame = await newGame.save();
        res.status(201).json(savedGame);
    } catch (err) { 
        res.status(400).json({ message: err.message }); 
    }
});

// GET all active games (excluding deleted ones)
router.get('/', async (req, res) => {
    try {
        const games = await Game.find({ isDeleted: { $ne: true } });
        res.json(games);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET trash (only deleted ones)
router.get('/trash', async (req, res) => {
    try {
        const trash = await Game.find({ isDeleted: true });
        res.json(trash);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

// UPDATE GAME (Corrected: Updates the actual data)
router.put('/:id', async (req, res) => {
    try {
        const updatedGame = await Game.findByIdAndUpdate(
            req.params.id, 
            req.body, // This now takes the data from your frontend
            { new: true }
        );
        res.json(updatedGame);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

// SOFT DELETE (Moved to a specific route so it doesn't conflict with updates)
router.put('/soft-delete/:id', async (req, res) => {
    try {
        const updatedGame = await Game.findByIdAndUpdate(
            req.params.id, 
            { isDeleted: true }, 
            { new: true }
        );
        res.json(updatedGame);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

// RESTORE from trash
router.put('/restore/:id', async (req, res) => {
    try {
        const restoredGame = await Game.findByIdAndUpdate(
            req.params.id, 
            { isDeleted: false }, 
            { new: true }
        );
        res.json(restoredGame);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

// EMPTY TRASH (Permanent delete)
router.delete('/trash/clear', async (req, res) => {
    try {
        await Game.deleteMany({ isDeleted: true });
        res.json({ message: "Trash emptied" });
    } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;