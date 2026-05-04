import { EmbedBuilder, PermissionFlagsBits, ChannelType } from 'discord.js';
import { isAdmin, isMod, isStaff } from '../../utils/permissions.js';
import { config } from '../../../shared/config.js';

// Emoji list
export const name = 'decode';
export async function execute(message, args) {
  const text = args.join(' ');
  if (!text) return message.reply('❌ Usage: `!decode <base64>`');
  try {
    const decoded = Buffer.from(text, 'base64').toString('utf-8');
    await message.reply(`🔓 Decoded: ${decoded}`);
  } catch (e) {
    await message.reply('❌ Invalid base64 string.');
  }
}