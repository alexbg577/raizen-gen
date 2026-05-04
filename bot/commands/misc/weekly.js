import { EmbedBuilder, PermissionFlagsBits, ChannelType } from 'discord.js';
import { isAdmin, isMod, isStaff } from '../../utils/permissions.js';
import { config } from '../../../shared/config.js';

// Emoji list
export const name = 'weekly';
export async function execute(message, args) {
  const amount = Math.floor(Math.random() * 2000) + 500;
  await message.reply(`💰 ${message.author} claimed weekly reward: **${amount}** credits!`);
}