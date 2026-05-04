import { EmbedBuilder, PermissionFlagsBits, ChannelType } from 'discord.js';
import { isAdmin, isMod, isStaff } from '../../utils/permissions.js';
import { config } from '../../../shared/config.js';

// Emoji list
export const name = 'createrole';
export async function execute(message, args) {
  if (!isAdmin(message.member)) return message.reply('❌ Admin only.');
  
  const name = args.join(' ') || 'New Role';
  const role = await message.guild.roles.create({ name });
  
  await message.reply(`✅ Created role: ${role}`);
}