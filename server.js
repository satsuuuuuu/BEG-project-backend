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

// 2. Apply Middleware & Security
// Use the environment variable to restrict access to your specific frontend
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
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

// 3. Define routes
app.use('/api/games', gameRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/auth', authRoutes);

// Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
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
    console.log("Attempting Axios scrape for:", url);
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
    console.log("Axios failed, switching to Puppeteer fallback.");
  }

  // 2. HEAVY PATH (Puppeteer)
  let browser = null;
  try {
    console.log("Puppeteer starting...");
    browser = await puppeteer.launch({
      headless: "new",
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 10000 });

    const metadata = await page.evaluate(() => {
        return {
            title: document.querySelector('meta[property="og:title"]')?.content || document.title || '',
            description: document.querySelector('meta[property="og:description"]')?.content || document.querySelector('meta[name="description"]')?.content || '',
            imageUrl: document.querySelector('meta[property="og:image"]')?.content || ''
        };
    });

    metadata.imageUrl = getAbsoluteUrl(metadata.imageUrl, url);
    return res.json(metadata);
  } catch (error) {
    console.error("Critical scraper failure:", error.message);
    return res.json({ title: '', description: '', imageUrl: '' });
  } finally {
    // This is critical: ensures browser memory is freed even if scraping fails
    if (browser) await browser.close();
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));