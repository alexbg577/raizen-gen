import { EmbedBuilder, PermissionFlagsBits, ChannelType } from 'discord.js';
import { isAdmin, isMod, isStaff } from '../../utils/permissions.js';
import { config } from '../../../shared/config.js';

// Emoji list
export const name = 'monthly';
export async function execute(message, args) {
  const amount = Math.floor(Math.random() * 5000) + 1000;
  await message.reply(`💰 ${message.author} claimed monthly reward: **${amount}** credits!`);
}