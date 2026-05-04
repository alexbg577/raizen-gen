import { EmbedBuilder, PermissionFlagsBits, ChannelType } from 'discord.js';
import { isAdmin, isMod, isStaff } from '../../utils/permissions.js';
import { config } from '../../../shared/config.js';

// Emoji list
export const name = 'gamble';
export async function execute(message, args) {
  const amount = parseInt(args[0]) || 10;
  const win = Math.random() > 0.4;
  if (win) {
    const winAmount = amount * 2;
    await message.reply(`🎰 ${message.author} gambled **${amount}** and won **${winAmount}**!`);
  } else {
    await message.reply(`🎰 ${message.author} gambled **${amount}** and lost everything!`);
  }
}