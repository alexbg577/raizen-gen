import { EmbedBuilder, PermissionFlagsBits, ChannelType } from 'discord.js';
import { isAdmin, isMod, isStaff } from '../../utils/permissions.js';
import { config } from '../../../shared/config.js';

// Emoji list
export const name = 'snipe';
export async function execute(message, args) {
  await message.reply('🛠️ Snipe feature coming soon!');
}