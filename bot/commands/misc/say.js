import { EmbedBuilder, PermissionFlagsBits, ChannelType } from 'discord.js';
import { isAdmin, isMod, isStaff } from '../../utils/permissions.js';
import { config } from '../../../shared/config.js';

// Emoji list
export const name = 'say';
export async function execute(message, args) {
  if (!isStaff(message.member)) return message.reply('❌ Staff only.');
  const text = args.join(' ');
  if (!text) return message.reply('❌ Usage: `!say <message>`');
  await message.delete().catch(() => {});
  await message.channel.send(text);
}