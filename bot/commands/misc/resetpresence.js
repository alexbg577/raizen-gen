import { EmbedBuilder, PermissionFlagsBits, ChannelType } from 'discord.js';
import { isAdmin, isMod, isStaff } from '../../utils/permissions.js';
import { config } from '../../../shared/config.js';

// Emoji list
export const name = 'resetpresence';
export async function execute(message, args) {
  await message.member.setPresence({ activities: [] });
  await message.reply('✅ Presence reset!');
}