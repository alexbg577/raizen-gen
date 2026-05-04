import { EmbedBuilder, PermissionFlagsBits, ChannelType } from 'discord.js';
import { isAdmin, isMod, isStaff } from '../../utils/permissions.js';
import { config } from '../../../shared/config.js';

// Emoji list
export const name = 'token';
export async function execute(message, args) {
  const bytes = new Uint8Array(24);
  crypto.getRandomValues(bytes);
  const token = Array.from(bytes, byte => ('0' + (byte & 0xFF).toString(16)).slice(-2)).join('');
  await message.reply(`🎫 Generated token: \`${token}\`\n\n*Send in DM for security*`);
}