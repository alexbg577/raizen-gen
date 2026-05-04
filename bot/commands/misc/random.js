import { EmbedBuilder, PermissionFlagsBits, ChannelType } from 'discord.js';
import { isAdmin, isMod, isStaff } from '../../utils/permissions.js';
import { config } from '../../../shared/config.js';

// Emoji list
export const name = 'random';
export async function execute(message, args) {
  const min = parseInt(args[0]) || 1;
  const max = parseInt(args[1]) || 100;
  const num = Math.floor(Math.random() * (max - min + 1)) + min;
  await message.reply(`🎲 Random number between ${min} and ${max}: **${num}**`);
}