import { EmbedBuilder, PermissionFlagsBits, ChannelType } from 'discord.js';
import { isAdmin, isMod, isStaff } from '../../utils/permissions.js';
import { config } from '../../../shared/config.js';

// Emoji list
export const name = 'rolemembers';
export async function execute(message, args) {
  const role = message.mentions.roles.first();
  if (!role) return message.reply('❌ Usage: `!rolemembers @role`');
  
  const members = role.members.map(m => m.user.tag).join('\n') || 'None';
  
  const embed = new EmbedBuilder()
    .setColor(role.color || 0x5865F2)
    .setTitle(`👥 Members with ${role.name} (${role.members.size})`)
    .setDescription(members.substring(0, 4096))
    .setFooter({ text: `Requested by ${message.author.tag}` });
  
  await message.reply({ embeds: [embed] });
}