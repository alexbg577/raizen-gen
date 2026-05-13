import { Client, GatewayIntentBits, Partials, Collection } from 'discord.js';
import dotenv from 'dotenv';
dotenv.config();

import { config } from '../shared/config.js';
import { handleButton, handleModal } from './events/buttonHandler.js';
import { handleGuildMemberAdd, handleGuildMemberRemove, handlePresenceUpdate } from './events/memberEvents.js';
import { startCronJobs } from './events/cron.js';
import { sendLog, LogColors } from './utils/logger.js';
import { restoreGiveaways } from './commands/giveaway/giveaway.js';
import { loadCommands } from './loadCommands.js';

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

// Register prefix commands
await loadCommands(client.commands);

const PREFIX = '!';

client.once('ready', async () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
  startCronJobs(client);
  await restoreGiveaways(client);
  console.log('🚀 Raizen Gen Bot is running!');
});

client.on('guildMemberAdd', handleGuildMemberAdd);
client.on('guildMemberRemove', handleGuildMemberRemove);
client.on('presenceUpdate', handlePresenceUpdate);

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  // Log file uploads
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

  // Handle prefix commands
  if (!message.content.startsWith(PREFIX)) return;

  const args = message.content.slice(PREFIX.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  const cmd = client.commands.get(commandName);
  if (!cmd) return;

  try {
    await cmd.execute(message, args);
  } catch (e) {
    console.error(`Command error [${commandName}]:`, e);
    message.reply('❌ An error occurred.').catch(() => {});
  }
});

// Handle button interactions (for tickets, etc.)
client.on('interactionCreate', async (interaction) => {
  if (interaction.isButton()) {
    await handleButton(interaction).catch(e => console.error('Button error:', e));
  } else if (interaction.isModalSubmit()) {
    await handleModal(interaction).catch(e => console.error('Modal error:', e));
  }
});

client.login(config.token);

// Serveur HTTP minimal pour Render (health check)
import http from 'http';
const healthPort = process.env.BOT_PORT || process.env.PORT || 3001;
http.createServer((req, res) => {
  res.writeHead(200);
  res.end('OK');
}).listen(healthPort, () => console.log(`🌐 Health check server on port ${healthPort}`));
