import { EmbedBuilder, PermissionFlagsBits, ChannelType } from 'discord.js';
import { isAdmin, isMod, isStaff } from '../../utils/permissions.js';
import { config } from '../../../shared/config.js';

// Emoji list
export const name = 'credit';
export async function execute(message, args) {
  const amount = parseInt(args[0]) || 100;
  await message.reply(`💰 ${message.author} received **${amount}** credits! (Mock economy)`);
}