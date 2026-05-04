import { EmbedBuilder, PermissionFlagsBits, ChannelType } from 'discord.js';
import { isAdmin, isMod, isStaff } from '../../utils/permissions.js';
import { config } from '../../../shared/config.js';

// Emoji list
export const name = 'dm';
export async function execute(message, args) {
  if (!isStaff(message.member)) return message.reply('❌ Staff only.');
  
  const target = message.mentions.users.first();
  const text = args.slice(1).join(' ');
  
  if (!target || !text) return message.reply('❌ Usage: `!dm @user <message>`');
  
  await target.send(`📧 Message from ${message.author.tag}:\n${text}`).catch(() => {
    return message.reply('❌ Cannot send DM to this user.');
  });
  
  await message.reply('✅ Message sent!');
}