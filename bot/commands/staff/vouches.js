import { EmbedBuilder } from 'discord.js';
import { isAdmin } from '../../utils/permissions.js';
import { removeVouch, getVouches } from '../../utils/github.js';

export const name = 'rvouch';

export async function execute(message, args) {
  if (!isAdmin(message.member)) {
    return message.reply('❌ Admin only.');
  }
  const target = message.mentions.users.first();
  if (!target) {
    return message.reply('❌ Usage: `!rvouch @user [amount]`');
  }
  const amount = parseInt(args[1]) || 1;
  const updated = await removeVouch(target.id, amount);
  const remaining = updated[target.id]?.count || 0;
  await message.reply(`✅ Removed **${amount}** vouch(es) from ${target}. They now have **${remaining}** vouches.`);
}

export const leaderboardName = 'leaderboard';
export async function leaderboardExec(message, args) {
  const vouches = await getVouches();
  const sorted = Object.entries(vouches)
    .map(([id, data]) => ({ id, count: data.count || 0 }))
    .filter(e => e.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  if (!sorted.length) {
    return message.reply('No vouches yet.');
  }

  const medals = ['🥇', '🥈', '🥉'];
  const desc = sorted.map((e, i) => {
    const medal = medals[i] || `**#${i + 1}**`;
    return `${medal} <@${e.id}> — **${e.count}** vouches`;
  }).join('\n');

  const embed = new EmbedBuilder()
    .setColor(0xFEE75C)
    .setTitle('⭐ Vouch Leaderboard')
    .setDescription(desc)
    .setFooter({ text: 'Raizen Gen' })
    .setTimestamp();

  await message.reply({ embeds: [embed] });
}
