import cron from 'node-cron';
import { EmbedBuilder } from 'discord.js';
import { config } from '../../shared/config.js';
import { getAllStockCounts } from '../utils/github.js';

export function startCronJobs(client) {
  // Post stock every 2 hours (full details with services)
  cron.schedule('0 */2 * * *', async () => {
    try {
      const guild = client.guilds.cache.get(config.guildId);
      if (!guild) return;
      const channel = guild.channels.cache.get(config.channels.stockLog);
      if (!channel) return;

      const tiers = ['free', 'premium', 'booster', 'extreme'];
      const fields = [];
      let totalAccounts = 0;

      for (const tier of tiers) {
        const accounts = await getStock(tier);
        totalAccounts += accounts.length;
        let serviceList = 'No accounts';
        if (accounts.length > 0) {
          const services = {};
          for (const acc of accounts) {
            const parts = acc.split(':');
            let service = 'Unknown';
            if (parts.length >= 3) service = parts[2].trim();
            services[service] = (services[service] || 0) + 1;
          }
          serviceList = Object.entries(services).map(([s, c]) => `**${s}**: ${c}`).join('\n');
        }
        fields.push({
          name: `${tier.charAt(0).toUpperCase() + tier.slice(1)} (${accounts.length})`,
          value: serviceList,
          inline: false
        });
      }

      const embed = new EmbedBuilder()
        .setColor(0x5865F2)
        .setTitle('📦 Stock Update')
        .setDescription(`Total: **${totalAccounts}** accounts`)
        .addFields(fields)
        .setFooter({ text: 'Raizen Gen • Auto Stock Update' })
        .setTimestamp();

      await channel.send({ embeds: [embed] }).catch(e => console.error('Stock log send error:', e));
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
