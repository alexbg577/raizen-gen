import { EmbedBuilder, PermissionFlagsBits, ChannelType } from 'discord.js';
import { isAdmin, isMod, isStaff } from '../../utils/permissions.js';
import { config } from '../../../shared/config.js';

// Emoji list
export const name = 'calc';
export async function execute(message, args) {
  if (!args.length) return message.reply('❌ Usage: `!calc <expression>` (ex: `!calc 2 + 2`)');
  
  try {
    const expr = args.join(' ');
    const result = eval(expr);
    await message.reply(`🧮 ${expr} = **${result}**`);
  } catch (e) {
    await message.reply('❌ Invalid expression.');
  }
}