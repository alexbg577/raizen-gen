import { Client, GatewayIntentBits, Partials, Collection } from 'discord.js';
import dotenv from 'dotenv';
dotenv.config();

import { config } from '../shared/config.js';
import { handleButton, handleModal } from './events/buttonHandler.js';
import { handleGuildMemberAdd, handleGuildMemberRemove, handlePresenceUpdate } from './events/memberEvents.js';
import { startCronJobs } from './events/cron.js';
import { sendLog, LogColors } from './utils/logger.js';
import { restoreGiveaways } from './commands/giveaway/giveaway.js';

// Commands
import { name as genName, execute as genExec } from './commands/gen/gen.js';
import { name as profileName, execute as profileExec } from './commands/gen/profile.js';
import { name as verifyName, execute as verifyExec } from './commands/staff/verify.js';
import { name as vouchName, execute as vouchExec } from './commands/staff/vouch.js';
import { name as rvouchName, execute as rvouchExec } from './commands/staff/vouches.js';
import { leaderboardName, leaderboardExec } from './commands/staff/vouches.js';
import { banName, banExec } from './commands/mod/moderation.js';
import { kickName, kickExec } from './commands/mod/moderation.js';
import { muteName, muteExec } from './commands/mod/moderation.js';
import { unmuteName, unmuteExec } from './commands/mod/moderation.js';
import { warnName, warnExec } from './commands/mod/moderation.js';
import { purgeName, purgeExec } from './commands/mod/moderation.js';
import { announcementName, announcementExec } from './commands/mod/moderation.js';
import { closeName, closeExec } from './commands/mod/moderation.js';
import { addstockName, addstockExec } from './commands/admin/stock.js';
import { stockName, stockExec } from './commands/admin/stock.js';
import { rallName, rallExec } from './commands/admin/stock.js';
import { backupName, backupExec } from './commands/admin/stock.js';
import { name as servicesName, execute as servicesExec } from './commands/admin/services.js';
import { name as sendName, execute as sendExec } from './commands/admin/send.js';
import { name as webName, execute as webExec } from './commands/misc/web.js';
import { name as giveawayName, execute as giveawayExec } from './commands/giveaway/giveaway.js';
import { name as helpName, execute as helpExec } from './commands/help.js';

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
client.commands.set(genName, { execute: genExec });
client.commands.set(profileName, { execute: profileExec });
client.commands.set(verifyName, { execute: verifyExec });
client.commands.set(vouchName, { execute: vouchExec });
client.commands.set(rvouchName, { execute: rvouchExec });
client.commands.set(leaderboardName, { execute: leaderboardExec });
client.commands.set(banName, { execute: banExec });
client.commands.set(kickName, { execute: kickExec });
client.commands.set(muteName, { execute: muteExec });
client.commands.set(unmuteName, { execute: unmuteExec });
client.commands.set(warnName, { execute: warnExec });
client.commands.set(purgeName, { execute: purgeExec });
client.commands.set(announcementName, { execute: announcementExec });
client.commands.set(closeName, { execute: closeExec });
client.commands.set(addstockName, { execute: addstockExec });
client.commands.set(stockName, { execute: stockExec });
client.commands.set(rallName, { execute: rallExec });
client.commands.set(backupName, { execute: backupExec });
client.commands.set(servicesName, { execute: servicesExec });
client.commands.set(sendName, { execute: sendExec });
client.commands.set(webName, { execute: webExec });
client.commands.set(giveawayName, { execute: giveawayExec });
client.commands.set(helpName, { execute: helpExec });

const PREFIX = '!';

client.once('clientReady', async () => {
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
const port = process.env.PORT || 3000;
http.createServer((req, res) => {
  res.writeHead(200);
  res.end('OK');
}).listen(port, () => console.log(`🌐 Health check server on port ${port}`));
