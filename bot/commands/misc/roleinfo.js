import { EmbedBuilder, PermissionFlagsBits, ChannelType } from 'discord.js';
import { isAdmin, isMod, isStaff } from '../../utils/permissions.js';
import { config } from '../../../shared/config.js';

// Emoji list
export const name = 'roleinfo';
export async function execute(message, args) {
  const role = message.mentions.roles.first() || message.member.roles.cache.first();
  if (!role) return message.reply('❌ Please mention a role.');
  
  const members = role.members.size;
  const perms = role.permissions.toArray().slice(0, 10).join(', ');
  
  const embed = new EmbedBuilder()
    .setColor(role.color || 0x5865F2)
    .setTitle(`🎭 ${role.name} Info`)
    .addFields(
      { name: '📃 Color', value: role.hexColor || 'None', inline: true },
      { name: '👥 Members', value: `${members}`, inline: true },
      { name: '📅 Created', value: `<t:${Math.floor(role.createdTimestamp / 1000)}:R>`, inline: true },
      { name: '🔐 Permissions', value: perms || 'None', inline: false }
    )
    .setFooter({ text: `ID: ${role.id}` });
  
  await message.reply({ embeds: [embed] });
}