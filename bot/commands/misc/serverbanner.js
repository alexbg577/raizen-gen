import { EmbedBuilder, PermissionFlagsBits, ChannelType } from 'discord.js';
import { isAdmin, isMod, isStaff } from '../../utils/permissions.js';
import { config } from '../../../shared/config.js';

// Emoji list
export const name = 'serverbanner';
export async function execute(message, args) {
  const banner = message.guild.bannerURL({ size: 1024 });
  if (!banner) return message.reply('❌ No server banner set.');
  
  const embed = new EmbedBuilder()
    .setColor(0x5865F2)
    .setTitle(`🏷 ${message.guild.name} Banner`)
    .setImage(banner);
  
  await message.reply({ embeds: [embed] });
}