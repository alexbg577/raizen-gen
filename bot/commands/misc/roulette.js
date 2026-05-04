import { EmbedBuilder, PermissionFlagsBits, ChannelType } from 'discord.js';
import { isAdmin, isMod, isStaff } from '../../utils/permissions.js';
import { config } from '../../../shared/config.js';

// Emoji list
export const name = 'roulette';
export async function execute(message, args) {
  const num = Math.floor(Math.random() * 36) + 1;
  const color = num % 2 === 0 ? 'Red' : 'Black';
  await message.reply(`🎰 Roulette: **${num}** (${color})\n*Place your bets!*`);
}