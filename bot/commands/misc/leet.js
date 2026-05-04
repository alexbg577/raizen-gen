import { EmbedBuilder, PermissionFlagsBits, ChannelType } from 'discord.js';
import { isAdmin, isMod, isStaff } from '../../utils/permissions.js';
import { config } from '../../../shared/config.js';

// Emoji list
export const name = 'leet';
export async function execute(message, args) {
  const text = args.join(' ');
  if (!text) return message.reply('❌ Usage: `!leet <text>`');
  const leet = text
    .replace(/a/gi, '4').replace(/e/gi, '3').replace(/i/gi, '1')
    .replace(/o/gi, '0').replace(/s/gi, '5').replace(/t/gi, '7');
  await message.reply(`1337: ${leet}`);
}