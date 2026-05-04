import { EmbedBuilder, PermissionFlagsBits, ChannelType } from 'discord.js';
import { isAdmin, isMod, isStaff } from '../../utils/permissions.js';
import { config } from '../../../shared/config.js';

// Emoji list
export const name = 'lottery';
export async function execute(message, args) {
  const numbers = [];
  for (let i = 0; i < 6; i++) {
    numbers.push(Math.floor(Math.random() * 49) + 1);
  }
  await message.reply(`🎰 Lottery numbers: **${numbers.join(', ')}**\n*Good luck!*`);
}