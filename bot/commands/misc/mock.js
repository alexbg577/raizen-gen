import { EmbedBuilder, PermissionFlagsBits, ChannelType } from 'discord.js';
import { isAdmin, isMod, isStaff } from '../../utils/permissions.js';
import { config } from '../../../shared/config.js';

// Emoji list
export const name = 'mock';
export async function execute(message, args) {
  const text = args.join(' ');
  if (!text) return message.reply('❌ Usage: `!mock <text>`');
  const mocked = text.split('').map((c, i) => i % 2 === 0 ? c.toLowerCase() : c.toUpperCase()).join('');
  await message.reply(mocked);
}