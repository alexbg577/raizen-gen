import express from 'express';
import session from 'express-session';
import passport from 'passport';
import { Strategy as DiscordStrategy } from 'passport-discord';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';
import AdmZip from 'adm-zip';
import { getAllStockCounts, getStockCount, popAccount, getVouches, getGiveaways, saveGiveaway } from '../bot/utils/github.js';
import { config } from '../shared/config.js';

dotenv.config();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const upload = multer({ storage: multer.memoryStorage() });

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: process.env.SESSION_SECRET || 'raizen_secret',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 }
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new DiscordStrategy({
  clientID: config.clientId,
  clientSecret: config.clientSecret,
  callbackURL: process.env.REDIRECT_URI,
  scope: ['identify', 'guilds', 'guilds.members.read'],
}, (accessToken, refreshToken, profile, done) => {
  profile.accessToken = accessToken;
  return done(null, profile);
}));

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

function isAuth(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/login');
}

// Static guild data since we no longer have bot HTTP bridge
const guild = { name: 'Raizen Gen', memberCount: '—', online: '—' };

// ── ROUTES ──
app.get('/', async (req, res) => {
  const counts = await getAllStockCounts();
  const guild = { name: 'Raizen Gen', memberCount: '—', online: '—' };
  res.render('index', { user: req.user, counts, guild });
});

app.get('/login', passport.authenticate('discord'));
app.get('/auth/callback', passport.authenticate('discord', { failureRedirect: '/' }), (req, res) => res.redirect('/dashboard'));
app.get('/logout', (req, res) => { req.logout(() => res.redirect('/')); });

app.get('/dashboard', isAuth, async (req, res) => {
  const counts = await getAllStockCounts();
  res.render('dashboard', { user: req.user, counts, guild });
});

app.get('/gen', isAuth, async (req, res) => {
  const counts = await getAllStockCounts();
  res.render('gen', { user: req.user, counts, message: null });
});

app.post('/gen', isAuth, async (req, res) => {
  const { tier, service } = req.body;
  const counts = await getAllStockCounts();

  if (!['free', 'premium', 'booster', 'extreme'].includes(tier)) {
    return res.render('gen', { user: req.user, counts, message: { type: 'error', text: 'Invalid tier.' } });
  }

  const count = await getStockCount(tier);
  if (count === 0) {
    return res.render('gen', { user: req.user, counts, message: { type: 'error', text: `No ${tier} accounts in stock.` } });
  }

  const account = await popAccount(tier);
  if (!account) {
    return res.render('gen', { user: req.user, counts, message: { type: 'error', text: 'Failed to retrieve account.' } });
  }

  const [email, password] = account.includes(':') ? account.split(':') : [account, 'N/A'];
  return res.render('gen', {
    user: req.user, counts,
    message: { type: 'success', text: 'Account delivered!', account: { email, password, service, tier } }
  });
});

// Profile page
app.get('/profile/:id', isAuth, async (req, res) => {
  const userId = req.params.id;
  const vouches = await getVouches();
  const vouchData = vouches[userId] || { count: 0 };
  const rank = vouchData.count >= 100 ? 'Admin' : vouchData.count >= 60 ? 'Mega Droper' : vouchData.count >= 30 ? 'Trained Mod' : 'Member';
  const tier = 'Basic Gen'; // Simplified for web
  res.render('profile', { user: req.user, vouchCount: vouchData.count, rank, tier, path: '/profile' });
});

// Docs page
app.get('/docs', (req, res) => {
  res.render('docs', { user: req.user, path: '/docs' });
});

app.get('/leaderboard', async (req, res) => {
  const vouches = await getVouches();
  const sorted = Object.entries(vouches)
    .map(([id, d]) => ({ id, count: d.count || 0 }))
    .filter(e => e.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 20);
  res.render('leaderboard', { user: req.user, leaderboard: sorted, path: '/leaderboard' });
});

app.get('/giveaways', async (req, res) => {
  const giveaways = await getGiveaways();
  const list = Object.values(giveaways).sort((a, b) => b.endsAt - a.endsAt);
  res.render('giveaways', { user: req.user, giveaways: list });
});

// Enter giveaway from website
app.post('/giveaways/enter/:msgId', isAuth, async (req, res) => {
  const msgId = req.params.msgId;
  const giveaways = await getGiveaways();
  const g = giveaways[msgId];
  
  if (!g || g.ended) {
    return res.json({ success: false, message: 'Giveaway ended' });
  }
  
  if (g.entries.includes(req.user.id)) {
    return res.json({ success: false, message: 'Already entered' });
  }
  
  g.entries.push(req.user.id);
  await saveGiveaway(g);
  
  // Notify bot to update embed (send webhook or use log channel)
  const notifyMsg = `🎉 **${req.user.username}** entered giveaway: **${g.prize}**`;
  // Here you could send to bot's log channel via webhook
  console.log(notifyMsg);
  
  res.json({ success: true, message: 'Entered giveaway!' });
});

// API endpoints
app.get('/api/stock', async (req, res) => {
  const counts = await getAllStockCounts();
  res.json(counts);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🌐 Web server running on port ${PORT}`));
