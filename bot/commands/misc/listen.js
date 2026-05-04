import { EmbedBuilder, PermissionFlagsBits, ChannelType } from 'discord.js';
import { isAdmin, isMod, isStaff } from '../../utils/permissions.js';
import { config } from '../../../shared/config.js';

// Emoji list
export const name = 'listen';
export async function execute(message, args) {
  const song = args.join(' ') || 'a song';
  await message.member.setPresence({ activities: [{ name: song, type: 2 }] });
  await message.reply(`🎵 Now listening to: **${song}**`);
}