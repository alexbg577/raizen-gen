import { EmbedBuilder, PermissionFlagsBits, ChannelType } from 'discord.js';
import { isAdmin, isMod, isStaff } from '../../utils/permissions.js';
import { config } from '../../../shared/config.js';

// Emoji list
export const name = 'translate';
export async function execute(message, args) {
  const text = args.slice(1).join(' ');
  const lang = args[0] || 'en';
  await message.reply(`🌐 [Mock] ${text} → [${lang.toUpperCase()}] ${text.split('').reverse().join('')}`);
}