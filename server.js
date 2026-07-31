require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const axios = require('axios');
const cheerio = require('cheerio');
const puppeteer = require('puppeteer');
const bcrypt = require('bcryptjs');

// Models & Routes
const User = require('./models/User');
const gameRoutes = require('./routes/games');
const categoryRoutes = require('./routes/categories');
const authRoutes = require('./routes/auth');

const app = express();

// --- DYNAMIC CORS CONFIGURATION ---
const allowedOrigins = [
    'http://localhost:5173',
    'https://bes-gamification.vercel.app',
    'https://basiadesgamification.aretian.dpdns.org' // Add your new domain here
];

app.use(cors({
    origin: function (origin, callback) {

        if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

app.use(express.json({ limit: '50mb' })); 
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Custom logger
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Routes
app.use('/api/games', gameRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/auth', authRoutes);

// Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    // Admin seeding
    try {
      const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
      const adminPassword = process.env.ADMIN_PASSWORD || 'admin';
      const existing = await User.findOne({ email: adminEmail });
      if (!existing) {
        const hash = await bcrypt.hash(adminPassword, 10);
        await User.create({ email: adminEmail, username: 'admin', passwordHash: hash, role: 'admin' });
      }
    } catch (e) { console.error('Seeding failed'); }
  })
  .catch(err => console.error('DB Connection error:', err));

// Helper: Ensure images have absolute paths
const getAbsoluteUrl = (url, baseUrl) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    try {
        const { origin } = new URL(baseUrl);
        return `${origin}${url.startsWith('/') ? '' : '/'}${url}`;
    } catch (e) { return url; }
};

// --- FETCH METADATA ROUTE ---
app.get('/api/fetch-metadata', async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).json({ title: '', description: '', imageUrl: '' });

  // 1. FAST PATH (Axios)
  try {
    const { data } = await axios.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
      timeout: 8000 
    });
    const $ = cheerio.load(data);
    const metadata = {
      title: $('meta[property="og:title"]').attr('content') || $('title').text() || '',
      description: $('meta[property="og:description"]').attr('content') || $('meta[name="description"]').attr('content') || '',
      imageUrl: $('meta[property="og:image"]').attr('content') || ''
    };
    if (metadata.title || metadata.imageUrl) {
        metadata.imageUrl = getAbsoluteUrl(metadata.imageUrl, url);
        return res.json(metadata);
    }
  } catch (err) { console.log("Axios failed, trying Puppeteer."); }

  // 2. HEAVY PATH (Puppeteer)
  let browser = null;
  try {
    browser = await puppeteer.launch({ headless: "new", args: ['--no-sandbox'] });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 10000 });
    const metadata = await page.evaluate(() => ({
        title: document.querySelector('meta[property="og:title"]')?.content || document.title || '',
        description: document.querySelector('meta[property="og:description"]')?.content || '',
        imageUrl: document.querySelector('meta[property="og:image"]')?.content || ''
    }));
    metadata.imageUrl = getAbsoluteUrl(metadata.imageUrl, url);
    return res.json(metadata);
  } catch (error) { return res.json({ title: '', description: '', imageUrl: '' });
  } finally { if (browser) await browser.close(); }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));