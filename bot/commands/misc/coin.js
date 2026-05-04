import { EmbedBuilder, PermissionFlagsBits, ChannelType } from 'discord.js';
import { isAdmin, isMod, isStaff } from '../../utils/permissions.js';
import { config } from '../../../shared/config.js';

// Emoji list
export const name = 'coin';
export async function execute(message, args) {
  const result = Math.random() < 0.5 ? 'Heads' : 'Tails';
  await message.reply(`🪙 **${result}**!`);
}