import { EmbedBuilder, PermissionFlagsBits, ChannelType } from 'discord.js';
import { isAdmin, isMod, isStaff } from '../../utils/permissions.js';
import { config } from '../../../shared/config.js';

// Emoji list
export const name = 'nick';
export async function execute(message, args) {
  if (!isMod(message.member)) return message.reply('❌ Mod only.');
  
  const target = message.mentions.members.first() || message.member;
  const nick = args.slice(target.id === message.member.id ? 0 : 1).join(' ') || null;
  
  await target.setNickname(nick);
  await message.reply(`✅ Changed nickname for ${target.user.tag}`);
}