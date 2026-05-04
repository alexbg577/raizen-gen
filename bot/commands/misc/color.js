import { EmbedBuilder, PermissionFlagsBits, ChannelType } from 'discord.js';
import { isAdmin, isMod, isStaff } from '../../utils/permissions.js';
import { config } from '../../../shared/config.js';

// Emoji list
export const name = 'color';
export async function execute(message, args) {
  const hex = args[0] || '#5865F2';
  const embed = new EmbedBuilder()
    .setColor(hex)
    .setTitle(`🎨 Color Preview`)
    .setDescription(`Hex: ${hex}`)
    .setFooter({ text: 'Raizen Gen • Color Tool' });
  
  await message.reply({ embeds: [embed] });
}