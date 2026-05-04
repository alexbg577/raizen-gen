import { EmbedBuilder, PermissionFlagsBits, ChannelType } from 'discord.js';
import { isAdmin, isMod, isStaff } from '../../utils/permissions.js';
import { config } from '../../../shared/config.js';

// Emoji list
export const name = 'vaporwave';
export async function execute(message, args) {
  const text = args.join(' ');
  if (!text) return message.reply('❌ Usage: `!vaporwave <text>`');
  const vapor = text.toUpperCase().split('').join(' ');
  await message.reply(`Ｖ Ａ Ｐ Ｏ Ｒ Ｗ Ａ Ｖ Ｅ: ${vapor}`);
}