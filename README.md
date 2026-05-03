# 🚀 Raizen Gen

Bot Discord + Site Web complet pour la génération de comptes.

## Stack
- **Bot**: Node.js 20, discord.js v14, ES Modules
- **Web**: Express + EJS + CSS custom
- **Storage**: GitHub (Octokit) comme base de données
- **Hosting**: Render (bot worker + web service)

## Structure
```
raizen-gen/
├── bot/
│   ├── index.js              # Entry point bot
│   ├── commands/
│   │   ├── gen/              # /gen, /profile
│   │   ├── staff/            # /verify, /vouch, /leaderboard
│   │   ├── mod/              # /ban, /kick, /mute, /warn, /purge, /announcement, /close
│   │   ├── admin/            # /addstock, /stock, /rall, /backup
│   │   └── giveaway/         # /giveaway
│   ├── events/
│   │   ├── buttonHandler.js  # Boutons & Modals
│   │   ├── memberEvents.js   # Join/Leave/Presence
│   │   └── cron.js           # Stock auto-post (2h)
│   └── utils/
│       ├── github.js         # GitHub API (stock, data)
│       ├── logger.js         # Log channel
│       └── permissions.js    # Roles helpers
├── web/
│   ├── server.js             # Express server
│   ├── views/                # EJS templates
│   └── public/               # CSS + JS
├── shared/
│   └── config.js             # Configuration globale
└── render.yaml               # Déploiement Render
```

## Fonctionnalités

### Bot
- ✅ `/gen <service>` — Génère un compte via ticket
- ✅ `/verify` — Panel de vérification (Founder)
- ✅ `/vouch @user` — Vouch un staff
- ✅ `/rvouch @user` — Retire des vouches (Admin)
- ✅ `/leaderboard` — Top vouches
- ✅ `/profile [@user]` — Profil membre
- ✅ `/addstock <tier> <fichier>` — Ajoute du stock (zip/txt)
- ✅ `/stock` — Voir le stock
- ✅ `/rall <tier>` — Vide un tier (Mega Droper+)
- ✅ `/backup` — Backup serveur (Admin)
- ✅ `/giveaway create/end/reroll` — Giveaways
- ✅ `/ban /kick /mute /unmute /warn /purge` — Modération
- ✅ `/announcement` — Annonces (Admin)
- ✅ `/close` — Ferme un ticket

### Automatique
- 🔄 Stock posté toutes les 2h dans #stock-logs
- 👥 Rôle `basic-gen` auto si invite en statut
- 🎟️ Ticket auto à chaque `/gen`
- ⭐ +1 vouch automatique quand staff délivre
- 📈 Promotions auto (30/60/100 vouches)
- 🔴 Rôle `unverified` à l'arrivée

### Site Web
- 🏠 Page d'accueil avec stats live
- 📦 Stock en temps réel
- 🎯 Interface de génération
- 🏆 Leaderboard vouches
- 🎉 Page giveaways avec countdown
- 📊 Dashboard personnel
- 🔐 Login Discord OAuth2

## Déploiement Render

1. Push ce repo sur GitHub
2. Aller sur [render.com](https://render.com)
3. New → Blueprint → connecter le repo
4. Render lit `render.yaml` et crée les 2 services automatiquement
5. Configurer l'URL de callback OAuth2: `https://raizen-gen-web.onrender.com/auth/callback`

## GitHub Stock Structure
```
pejxjcykzlqjsloshvhbb/
├── stock/
│   ├── free.txt
│   ├── premium.txt
│   ├── booster.txt
│   └── extreme.txt
├── data/
│   ├── vouches.json
│   ├── tickets.json
│   └── giveaways.json
└── backups/
```
