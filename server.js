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

// 1. Initialize app
const app = express();

// 2. Apply Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' })); 
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Custom logger middleware
app.use((req, res, next) => {
    console.log("Incoming request body keys:", Object.keys(req.body || {}));
    next();
});

// 3. Define routes
app.use('/api/games', gameRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/auth', authRoutes);

// Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    // Seed admin user if not present
    try {
      const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
      const adminPassword = process.env.ADMIN_PASSWORD || 'admin';
      const existing = await User.findOne({ email: adminEmail });
      if (!existing) {
        const hash = await bcrypt.hash(adminPassword, 10);
        await User.create({ email: adminEmail, username: 'admin', passwordHash: hash, role: 'admin' });
        console.log('Seeded admin user:', adminEmail);
      }
    } catch (e) { console.error('Seeding admin failed', e.message); }
  })
  .catch(err => console.error('Could not connect to MongoDB:', err));

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
    console.log("--- Attempting Axios scrape for:", url);
    const { data } = await axios.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36' },
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
  } catch (err) {
    console.log("Axios failed, switching to Puppeteer:", err.message);
  }

  // 2. HEAVY PATH (Puppeteer Fallback)
  try {
    console.log("Puppeteer starting for:", url);
    const browser = await puppeteer.launch({
      headless: "new",
      executablePath: '/usr/bin/chromium', 
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    // Create new page and navigate
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 10000 });

    const metadata = await page.evaluate(() => {
        return {
            title: document.querySelector('meta[property="og:title"]')?.content || document.title || '',
            description: document.querySelector('meta[property="og:description"]')?.content || document.querySelector('meta[name="description"]')?.content || '',
            imageUrl: document.querySelector('meta[property="og:image"]')?.content || ''
        };
    });

    await browser.close();
    metadata.imageUrl = getAbsoluteUrl(metadata.imageUrl, url);
    return res.json(metadata);
  } catch (error) {
    console.error("Critical failure:", error.message);
    return res.json({ title: '', description: '', imageUrl: '' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));