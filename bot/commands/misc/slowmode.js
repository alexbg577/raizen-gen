import { EmbedBuilder, PermissionFlagsBits, ChannelType } from 'discord.js';
import { isAdmin, isMod, isStaff } from '../../utils/permissions.js';
import { config } from '../../../shared/config.js';

// Emoji list
export const name = 'slowmode';
export async function execute(message, args) {
  if (!isMod(message.member)) return message.reply('❌ Mod only.');
  
  const seconds = parseInt(args[0]) || 0;
  await message.channel.setRateLimitPerUser(seconds);
  await message.reply(`✅ Slowmode set to ${seconds} seconds.`);
}