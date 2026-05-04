import { EmbedBuilder, PermissionFlagsBits, ChannelType } from 'discord.js';
import { isAdmin, isMod, isStaff } from '../../utils/permissions.js';
import { config } from '../../../shared/config.js';

// Emoji list
export const name = 'deleterole';
export async function execute(message, args) {
  if (!isAdmin(message.member)) return message.reply('❌ Admin only.');
  
  const role = message.mentions.roles.first();
  if (!role) return message.reply('❌ Usage: `!deleterole @role`');
  
  await role.delete();
  await message.reply(`✅ Deleted role: ${role.name}`);
}