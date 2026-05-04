import { EmbedBuilder, PermissionFlagsBits, ChannelType } from 'discord.js';
import { isAdmin, isMod, isStaff } from '../../utils/permissions.js';
import { config } from '../../../shared/config.js';

// Emoji list
export const name = 'play';
export async function execute(message, args) {
  const game = args.join(' ') || 'a game';
  await message.member.setPresence({ activities: [{ name: game, type: 0 }] });
  await message.reply(`🎮 Now playing: **${game}**`);
}