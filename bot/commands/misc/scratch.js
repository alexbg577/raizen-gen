import { EmbedBuilder, PermissionFlagsBits, ChannelType } from 'discord.js';
import { isAdmin, isMod, isStaff } from '../../utils/permissions.js';
import { config } from '../../../shared/config.js';

// Emoji list
export const name = 'scratch';
export async function execute(message, args) {
  const prize = Math.random() > 0.7 ? '🎉 You won 1000 credits!' : '❌ No prize this time.';
  await message.reply(`🎫 Scratch ticket...\n${prize}`);
}