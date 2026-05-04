import { EmbedBuilder, PermissionFlagsBits, ChannelType } from 'discord.js';
import { isAdmin, isMod, isStaff } from '../../utils/permissions.js';
import { config } from '../../../shared/config.js';

// Emoji list
export const name = 'remind';
export async function execute(message, args) {
  if (args.length < 2) return message.reply('❌ Usage: `!remind <minutes> <message>`');
  
  const minutes = parseInt(args[0]);
  const reminder = args.slice(1).join(' ');
  
  if (isNaN(minutes) || minutes < 1) return message.reply('❌ Invalid time.');
  
  await message.reply(`✅ I'll remind you in ${minutes} minute(s).`);
  
  setTimeout(async () => {
    await message.author.send(`⏰ Reminder: ${reminder}`).catch(() => {});
  }, minutes * 60 * 1000);
}