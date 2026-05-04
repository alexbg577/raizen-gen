import { EmbedBuilder, PermissionFlagsBits, ChannelType } from 'discord.js';
import { isAdmin, isMod, isStaff } from '../../utils/permissions.js';
import { config } from '../../../shared/config.js';

// Emoji list
export const name = 'uptime';
export async function execute(message, args) {
  const uptime = Math.floor(message.client.uptime / 1000);
  const days = Math.floor(uptime / 86400);
  const hours = Math.floor((uptime % 86400) / 3600);
  const mins = Math.floor((uptime % 3600) / 60);
  await message.reply(`⏰ Uptime: ${days}d ${hours}h ${mins}m`);
}