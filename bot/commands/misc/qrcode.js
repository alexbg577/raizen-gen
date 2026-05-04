import { EmbedBuilder, PermissionFlagsBits, ChannelType } from 'discord.js';
import { isAdmin, isMod, isStaff } from '../../utils/permissions.js';
import { config } from '../../../shared/config.js';

// Emoji list
export const name = 'qrcode';
export async function execute(message, args) {
  const text = args.join(' ') || 'https://raizen-gen.com';
  await message.reply(`📱 QR Code for: ${text}\n[Mock QR Code Image Here]`);
}