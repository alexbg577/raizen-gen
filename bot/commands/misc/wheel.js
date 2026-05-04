import { EmbedBuilder, PermissionFlagsBits, ChannelType } from 'discord.js';
import { isAdmin, isMod, isStaff } from '../../utils/permissions.js';
import { config } from '../../../shared/config.js';

// Emoji list
export const name = 'wheel';
export async function execute(message, args) {
  const segments = ['100 credits', '200 credits', '500 credits', 'Lose all', 'Jackpot!', 'Try again'];
  const result = segments[Math.floor(Math.random() * segments.length)];
  await message.reply(`🎡 The wheel spins... and lands on: **${result}**!`);
}