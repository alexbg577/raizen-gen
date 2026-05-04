import { EmbedBuilder, PermissionFlagsBits, ChannelType } from 'discord.js';
import { isAdmin, isMod, isStaff } from '../../utils/permissions.js';
import { config } from '../../../shared/config.js';

// Emoji list
export const name = 'stream';
export async function execute(message, args) {
  const game = args.join(' ') || 'a stream';
  await message.member.setPresence({ activities: [{ name: game, type: 1 }] });
  await message.reply(`📹 Now streaming: **${game}**`);
}