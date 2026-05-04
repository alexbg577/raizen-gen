import { EmbedBuilder, PermissionFlagsBits, ChannelType } from 'discord.js';
import { isAdmin, isMod, isStaff } from '../../utils/permissions.js';
import { config } from '../../../shared/config.js';

// Emoji list
export const name = 'servericon';
export async function execute(message, args) {
  const icon = message.guild.iconURL({ dynamic: true, size: 1024 });
  if (!icon) return message.reply('❌ No server icon set.');
  
  const embed = new EmbedBuilder()
    .setColor(0x5865F2)
    .setTitle(`🏷 ${message.guild.name} Icon`)
    .setImage(icon);
  
  await message.reply({ embeds: [embed] });
}