import { EmbedBuilder, PermissionFlagsBits, ChannelType } from 'discord.js';
import { isAdmin, isMod, isStaff } from '../../utils/permissions.js';
import { config } from '../../../shared/config.js';

// Emoji list
export const name = 'watch';
export async function execute(message, args) {
  const movie = args.join(' ') || 'a movie';
  await message.member.setPresence({ activities: [{ name: movie, type: 3 }] });
  await message.reply(`🎬 Now watching: **${movie}**`);
}