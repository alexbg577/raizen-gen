import { EmbedBuilder, PermissionFlagsBits, ChannelType } from 'discord.js';
import { isAdmin, isMod, isStaff } from '../../utils/permissions.js';
import { config } from '../../../shared/config.js';

// Emoji list
export const name = 'shorturl';
export async function execute(message, args) {
  const url = args[0];
  if (!url) return message.reply('❌ Usage: `!shorturl <url>`');
  await message.reply(`📎 Shortened: https://rzn.gen/abc123`);
}