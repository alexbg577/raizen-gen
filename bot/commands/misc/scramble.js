import { EmbedBuilder, PermissionFlagsBits, ChannelType } from 'discord.js';
import { isAdmin, isMod, isStaff } from '../../utils/permissions.js';
import { config } from '../../../shared/config.js';

// Emoji list
export const name = 'scramble';
export async function execute(message, args) {
  const text = args.join(' ');
  if (!text) return message.reply('❌ Usage: `!scramble <text>`');
  const scrambled = text.split('').sort(() => Math.random() - 0.5).join('');
  await message.reply(`🔡 Scrambled: ${scrambled}`);
}