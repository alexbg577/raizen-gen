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

  // Check invite statuses every 5 minutes
  cron.schedule('*/5 * * * *', async () => {
    try {
      const guild = client.guilds.cache.get(config.guildId);
      if (!guild) return;
      await guild.members.fetch();
      const members = guild.members.cache.filter(m => !m.user.bot);

      for (const [, member] of members) {
        const presence = member.presence;
        const hasInvite = presence?.activities?.some(a =>
          a.state?.includes(config.inviteLink) || a.name?.includes(config.inviteLink)
        );
        const hasRole = member.roles.cache.has(config.roles.basicGen);

        if (hasInvite && !hasRole) {
          await member.roles.add(config.roles.basicGen).catch(() => {});
        } else if (!hasInvite && hasRole && !member.roles.cache.has(config.roles.premiumGen) &&
          !member.roles.cache.has(config.roles.boosterGen) && !member.roles.cache.has(config.roles.extremeGen)) {
          await member.roles.remove(config.roles.basicGen).catch(() => {});
        }
      }
    } catch (e) {
      console.error('Invite check cron error:', e);
    }
  });

  console.log('✅ Cron jobs started (stock every 2h, invite check every 5min)');
}
