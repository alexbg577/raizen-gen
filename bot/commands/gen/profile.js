import { EmbedBuilder } from 'discord.js';
import { getUserVouches } from '../../utils/github.js';
import { getTier, isStaff, isAdmin, isMod } from '../../utils/permissions.js';

export const name = 'profile';

export async function execute(message, args) {
  const target = message.mentions.members.first() || message.member;

  const vouchData = await getUserVouches(target.id);
  const vouches = vouchData.count || 0;
  const tier = getTier(target);

  const tierEmoji = { free: '🟢', premium: '🔵', booster: '🟣', extreme: '🔴' };
  const tierLabel = tier ? `${tierEmoji[tier]} ${tier.charAt(0).toUpperCase() + tier.slice(1)}` : '❌ None';

  const staffBadge = isAdmin(target) ? '👑 Admin' : isMod(target) ? '🔨 Moderator' : isStaff(target) ? '🛡️ Staff' : '👤 Member';

  const embed = new EmbedBuilder()
    .setColor(0x5865F2)
    .setTitle(`👤 ${target.user.username}'s Profile`)
    .setThumbnail(target.user.displayAvatarURL({ size: 256 }))
    .addFields(
      { name: '🏷️ Tag', value: target.user.tag, inline: true },
      { name: '🎭 Staff Rank', value: staffBadge, inline: true },
      { name: '🎫 Gen Tier', value: tierLabel, inline: true },
      { name: '⭐ Vouches', value: `**${vouches}**`, inline: true },
      { name: '📅 Joined', value: `<t:${Math.floor(target.joinedTimestamp / 1000)}:R>`, inline: true },
      { name: '🗓️ Account Created', value: `<t:${Math.floor(target.user.createdTimestamp / 1000)}:R>`, inline: true },
    )
    .setFooter({ text: 'Raizen Gen' })
    .setTimestamp();

  await message.reply({ embeds: [embed] });
}
