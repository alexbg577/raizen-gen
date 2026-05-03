import dotenv from 'dotenv';
dotenv.config();

export const config = {
  token: process.env.DISCORD_TOKEN,
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  guildId: process.env.GUILD_ID,

  channels: {
    ticket: process.env.TICKET_CHANNEL,
    log: process.env.LOG_CHANNEL,
    freeGen: process.env.FREE_GEN_CHANNEL,
    premiumGen: process.env.PREMIUM_GEN_CHANNEL,
    boosterGen: process.env.BOOSTER_GEN_CHANNEL,
    extremeGen: process.env.EXTREME_GEN_CHANNEL,
    stockLog: process.env.STOCK_LOG_CHANNEL,
  },

  roles: {
    helper: process.env.ROLE_HELPER,
    staff: process.env.ROLE_STAFF,
    trainedMod: process.env.ROLE_TRAINED_MOD,
    moderator: process.env.ROLE_MODERATOR,
    admin: process.env.ROLE_ADMIN,
    verified: process.env.ROLE_VERIFIED,
    member: process.env.ROLE_MEMBER,
    founder: process.env.ROLE_FOUNDER,
    superAdmin: process.env.ROLE_SUPER_ADMIN,
    megaDroper: process.env.ROLE_MEGA_DROPER,
    headAdmin: process.env.ROLE_HEAD_ADMIN,
    basicGen: process.env.ROLE_BASIC_GEN,
    premiumGen: process.env.ROLE_PREMIUM_GEN,
    boosterGen: process.env.ROLE_BOOSTER_GEN,
    extremeGen: process.env.ROLE_EXTREME_GEN,
    unverified: process.env.ROLE_UNVERIFIED,
  },

  github: {
    token: process.env.GITHUB_TOKEN,
    owner: process.env.GITHUB_OWNER,
    repo: process.env.GITHUB_REPO,
  },

  inviteLink: 'https://discord.gg/PPdYTSFuby',

  vouchThresholds: {
    trainedMod: 30,
    megaDroper: 60,
    admin: 100,
  },

  stockPostInterval: 2 * 60 * 60 * 1000, // 2h
};

export const TIERS = ['free', 'premium', 'booster', 'extreme'];

export const TIER_ROLES = {
  free: config.roles.basicGen,
  premium: config.roles.premiumGen,
  booster: config.roles.boosterGen,
  extreme: config.roles.extremeGen,
};

export const TIER_CHANNELS = {
  free: config.channels.freeGen,
  premium: config.channels.premiumGen,
  booster: config.channels.boosterGen,
  extreme: config.channels.extremeGen,
};

export const STAFF_ROLES = [
  config.roles.helper,
  config.roles.staff,
  config.roles.trainedMod,
  config.roles.moderator,
  config.roles.admin,
  config.roles.founder,
  config.roles.superAdmin,
  config.roles.megaDroper,
  config.roles.headAdmin,
];

export const ADMIN_ROLES = [
  config.roles.admin,
  config.roles.founder,
  config.roles.superAdmin,
  config.roles.headAdmin,
];

export const MOD_ROLES = [
  config.roles.moderator,
  config.roles.admin,
  config.roles.founder,
  config.roles.superAdmin,
  config.roles.headAdmin,
  config.roles.trainedMod,
];
