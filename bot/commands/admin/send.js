import { EmbedBuilder } from 'discord.js';
import { isAdmin } from '../../utils/permissions.js';
import { getStock, popAccount } from '../../utils/github.js';
import { sendLog, LogColors } from '../../utils/logger.js';

export const name = 'send';

export async function execute(message, args) {
  if (!isAdmin(message.member)) {
    return message.reply('❌ Admin only.');
  }

  const service = args[0];
  const amount = parseInt(args[1]) || 1;
  const target = message.mentions.users.first();
  const comment = args.slice(target ? 3 : 2).join(' ') || '';

  if (!service) {
    return message.reply('❌ Usage: `!send <service> <amount> [@user] [comment]`');
  }

  // Find tier that contains this service
  const tiers = ['free', 'premium', 'booster', 'extreme'];
  let foundTier = null;
  let accounts = [];

  for (const tier of tiers) {
    const accs = await getStock(tier);
    const matching = accs.filter(acc => {
      const parts = acc.split(':');
      if (parts.length >= 3 && parts[2].toLowerCase() === service.toLowerCase()) return true;
      if (acc.toLowerCase().includes(`(${service.toLowerCase()})`)) return true;
      return false;
    });
    if (matching.length > 0) {
      foundTier = tier;
      accounts = matching;
      break;
    }
  }

  if (!foundTier || accounts.length === 0) {
    return message.reply(`❌ No accounts found for service **${service}** in any tier.`);
  }

  if (amount > accounts.length) {
    return message.reply(`❌ Only **${accounts.length}** accounts available for **${service}**.`);
  }

  const user = target || message.author;
  const deliveredAccounts = [];

  for (let i = 0; i < amount; i++) {
    const acc = accounts[i];
    const [email, password] = acc.includes(':') ? acc.split(':') : [acc, 'N/A'];
    deliveredAccounts.push({ email, password, service });
    // Remove from stock
    await popAccount(foundTier);
  }

  // Send via DM
  const dmChannel = await user.createDM().catch(() => null);
  if (!dmChannel) {
    return message.reply(`❌ Cannot send DM to ${user.tag}. They might have DMs disabled.`);
  }

  for (const acc of deliveredAccounts) {
    const embed = new EmbedBuilder()
      .setColor(0x57F287)
      .setTitle(`✅ Your ${acc.service} Account`)
      .setDescription(comment ? `**Comment:** ${comment}\n\nHere are your credentials:` : `Here are your credentials for **${acc.service}**:`)
      .addFields(
        { name: '📧 Email', value: `\`${acc.email}\``, inline: true },
        { name: '🔑 Password', value: `\`${acc.password}\``, inline: true },
      )
      .setFooter({ text: 'Raizen Gen • Do not share these credentials' })
      .setTimestamp();

    await dmChannel.send({ embeds: [embed] }).catch(() => {});
  }

  await message.reply(`✅ Sent **${deliveredAccounts.length}** account(s) for **${service}** to ${user.tag} via DM.`);

  await sendLog(message.client, {
    color: LogColors.gen,
    title: '✅ Accounts Sent',
    description: `**${message.author.tag}** sent **${deliveredAccounts.length}** ${service} account(s) to **${user.tag}**${comment ? `\nComment: ${comment}` : ''}`,
  });
}
