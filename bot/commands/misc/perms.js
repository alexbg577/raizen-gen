import { EmbedBuilder, PermissionFlagsBits, ChannelType } from 'discord.js';
import { isAdmin, isMod, isStaff } from '../../utils/permissions.js';
import { config } from '../../../shared/config.js';

// Emoji list
export const name = 'perms';
export async function execute(message, args) {
  const member = message.mentions.members.first() || message.member;
  const channel = message.mentions.channels.first() || message.channel;
  
  const perms = channel.permissionsFor(member).toArray();
  
  const embed = new EmbedBuilder()
    .setColor(0x5865F2)
    .setTitle(`🔐 ${member.user.username} in #${channel.name}`)
    .setDescription(perms.slice(0, 20).join('\n') || 'No permissions')
    .setFooter({ text: `Requested by ${message.author.tag}` });
  
  await message.reply({ embeds: [embed] });
}