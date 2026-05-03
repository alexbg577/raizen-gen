import { EmbedBuilder } from 'discord.js';
import { isStaff } from '../../utils/permissions.js';
import { getStock } from '../../utils/github.js';

export const name = 'services';

export async function execute(message, args) {
  if (!isStaff(message.member)) {
    return message.reply('❌ Staff only.');
  }

  const tier = args[0];
  if (!tier || !['free', 'premium', 'booster', 'extreme'].includes(tier)) {
    return message.reply('❌ Usage: `!services <tier>` (tier: free, premium, booster, extreme)');
  }

  const accounts = await getStock(tier);
  if (!accounts.length) {
    return message.reply(`❌ No accounts in **${tier}** stock.`);
  }

  // Extract services (format: email:pass:service or email:pass or just email:pass)
  const serviceCount = {};
  for (const acc of accounts) {
    const parts = acc.split(':');
    // Try to find service in the account string
    // Common formats: email:pass:service or email:pass (service)
    let service = 'Unknown';
    if (parts.length >= 3) {
      service = parts[2].trim();
    } else if (acc.includes('(') && acc.includes(')')) {
      const match = acc.match(/\(([^)]+)\)/);
      if (match) service = match[1];
    }
    serviceCount[service] = (serviceCount[service] || 0) + 1;
  }

  const sorted = Object.entries(serviceCount).sort((a, b) => b[1] - a[1]);
  const desc = sorted.slice(0, 15).map(([s, c]) => `**${s}**: ${c} accounts`).join('\n');

  const embed = new EmbedBuilder()
    .setColor(0x5865F2)
    .setTitle(`📦 Stock Services — ${tier.charAt(0).toUpperCase() + tier.slice(1)}`)
    .setDescription(desc || 'No services found.')
    .setFooter({ text: `Total: ${accounts.length} accounts` })
    .setTimestamp();

  await message.reply({ embeds: [embed] });
}
