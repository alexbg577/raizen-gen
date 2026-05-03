import { Client, GatewayIntentBits, Partials, Collection, REST, Routes } from 'discord.js';
import dotenv from 'dotenv';
dotenv.config();

import { config } from '../shared/config.js';
import { handleButton, handleModal } from './events/buttonHandler.js';
import { handleGuildMemberAdd, handleGuildMemberRemove, handlePresenceUpdate } from './events/memberEvents.js';
import { startCronJobs } from './events/cron.js';
import { sendLog, LogColors } from './utils/logger.js';
import { restoreGiveaways } from './commands/giveaway/giveaway.js';

// Commands
import * as genCmd from './commands/gen/gen.js';
import * as profileCmd from './commands/gen/profile.js';
import * as verifyCmd from './commands/staff/verify.js';
import * as vouchCmd from './commands/staff/vouch.js';
import { rvouch, leaderboard } from './commands/staff/vouches.js';
import { ban, kick, mute, unmute, warn, purge, announcement, close } from './commands/mod/moderation.js';
import { addstock, stock, rall, backup } from './commands/admin/stock.js';
import { giveaway } from './commands/giveaway/giveaway.js';

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages,
  ],
  partials: [Partials.Channel, Partials.Message, Partials.GuildMember],
});

client.commands = new Collection();

const commands = [
  genCmd, profileCmd, verifyCmd, vouchCmd, rvouch, leaderboard,
  ban, kick, mute, unmute, warn, purge,
  { data: announcement.data, execute: announcement.execute },
  { data: close.data, execute: close.execute },
  addstock, stock, rall, backup, giveaway,
];

for (const cmd of commands) {
  const data = cmd.data || cmd;
  const execute = cmd.execute;
  if (data && execute) {
    client.commands.set(data.name, { data, execute });
  }
}

// Register slash commands
async function registerCommands() {
  const rest = new REST({ version: '10' }).setToken(config.token);
  const commandData = commands.map(c => (c.data || c).toJSON ? (c.data || c).toJSON() : null).filter(Boolean);
  try {
    await rest.put(Routes.applicationGuildCommands(config.clientId, config.guildId), { body: commandData });
    console.log('✅ Slash commands registered.');
  } catch (e) {
    console.error('Command register error:', e);
  }
}

client.once('ready', async () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
  await registerCommands();
  startCronJobs(client);
  await restoreGiveaways(client);
  console.log('🚀 Raizen Gen Bot is running!');
});

client.on('guildMemberAdd', handleGuildMemberAdd);
client.on('guildMemberRemove', handleGuildMemberRemove);
client.on('presenceUpdate', handlePresenceUpdate);

client.on('interactionCreate', async (interaction) => {
  if (interaction.isChatInputCommand()) {
    const cmd = client.commands.get(interaction.commandName);
    if (!cmd) return;
    try {
      await cmd.execute(interaction);
    } catch (e) {
      console.error(`Command error [${interaction.commandName}]:`, e);
      const msg = { content: '❌ An error occurred.', ephemeral: true };
      if (interaction.deferred) await interaction.editReply(msg).catch(() => {});
      else await interaction.reply(msg).catch(() => {});
    }
  } else if (interaction.isButton()) {
    await handleButton(interaction).catch(e => console.error('Button error:', e));
  } else if (interaction.isModalSubmit()) {
    await handleModal(interaction).catch(e => console.error('Modal error:', e));
  }
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  // Log messages with attachments for stock
  if (message.attachments.size > 0 && message.guild) {
    const att = message.attachments.first();
    if (att.name?.endsWith('.zip') || att.name?.endsWith('.txt')) {
      await sendLog(client, {
        color: LogColors.info,
        title: '📎 File Upload',
        description: `**${message.author.tag}** uploaded **${att.name}** in ${message.channel}`,
      });
    }
  }
});

client.login(config.token);

// HTTP bridge for web dashboard
import http from 'http';
import { getAllStockCounts, getVouches } from './utils/github.js';

const bridge = http.createServer(async (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');

  if (req.url === '/api/stock') {
    const counts = await getAllStockCounts().catch(() => ({}));
    res.end(JSON.stringify(counts));
  } else if (req.url === '/api/guild') {
    const guild = client.guilds.cache.get(config.guildId);
    res.end(JSON.stringify({
      name: guild?.name || 'Raizen Gen',
      memberCount: guild?.memberCount || 0,
      online: guild?.members.cache.filter(m => m.presence?.status === 'online').size || 0,
    }));
  } else if (req.url === '/api/health') {
    res.end(JSON.stringify({ status: 'ok', tag: client.user?.tag }));
  } else {
    res.statusCode = 404;
    res.end(JSON.stringify({ error: 'Not found' }));
  }
});

bridge.listen(process.env.BOT_PORT || 3001, () => {
  console.log(`🌐 Bot HTTP bridge running on port ${process.env.BOT_PORT || 3001}`);
});
