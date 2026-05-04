import { EmbedBuilder, PermissionFlagsBits, ChannelType } from 'discord.js';
import { isAdmin, isMod, isStaff } from '../../utils/permissions.js';
import { config } from '../../../shared/config.js';

// Emoji list
export const name = 'mine';
export async function execute(message, args) {
  const ores = ['diamond', 'gold', 'iron', 'coal', 'emerald', 'redstone'];
  const ore = ores[Math.floor(Math.random() * ores.length)];
  const amount = Math.floor(Math.random() * 64) + 1;
  await message.reply(`⛏️ ${message.author} mined **${amount}** ${ore}!`);
}