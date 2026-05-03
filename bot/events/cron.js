import cron from 'node-cron';
import { EmbedBuilder } from 'discord.js';
import { config } from '../../shared/config.js';
import { getAllStockCounts } from '../utils/github.js';

export function startCronJobs(client) {
  // Post stock every 2 hours
  cron.schedule('0 */2 * * *', async () => {
    try {
      const guild = client.guilds.cache.get(config.guildId);
      if (!guild) return;
      const channel = guild.channels.cache.get(config.channels.stockLog);
      if (!channel) return;

      const counts = await getAllStockCounts();
      const total = Object.values(counts).reduce((a, b) => a + b, 0);

      const embed = new EmbedBuilder()
        .setColor(0x5865F2)
        .setTitle('📦 Stock Update')
        .setDescription('Here is the current stock status:')
        .addFields(
          { name: '🟢 Free', value: `**${counts.free}** accounts`, inline: true },
          { name: '🔵 Premium', value: `**${counts.premium}** accounts`, inline: true },
          { name: '🟣 Booster', value: `**${counts.booster}** accounts`, inline: true },
          { name: '🔴 Extreme', value: `**${counts.extreme}** accounts`, inline: true },
          { name: '📊 Total', value: `**${total}** accounts`, inline: false },
        )
        .setFooter({ text: 'Raizen Gen • Auto Stock Update' })
        .setTimestamp();

      await channel.send({ embeds: [embed] });
    } catch (e) {
      console.error('Stock cron error:', e);
    }
  });

  // Check invite statuses every 5 minutes (only log, don't change roles to avoid messages)
  cron.schedule('*/5 * * * *', async () => {
    try {
      const guild = client.guilds.cache.get(config.guildId);
      if (!guild) return;
      // Just fetch members, don't modify roles to avoid spam
      await guild.members.fetch();
    } catch (e) {
      console.error('Invite check cron error:', e);
    }
  });

  console.log('✅ Cron jobs started (stock every 2h, invite check every 5min)');
}
