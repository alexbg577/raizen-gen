import { EmbedBuilder, PermissionFlagsBits, ChannelType } from 'discord.js';
import { isAdmin, isMod, isStaff } from '../../utils/permissions.js';
import { config } from '../../../shared/config.js';

// Emoji list
export const name = 'shuffle';
export async function execute(message, args) {
  const text = args.join(' ');
  if (!text) return message.reply('❌ Usage: `!shuffle <text>`');
  const shuffled = text.split('').sort(() => Math.random() - 0.5).join('');
  await message.reply(shuffled);
}