import { EmbedBuilder, PermissionFlagsBits, ChannelType } from 'discord.js';
import { isAdmin, isMod, isStaff } from '../../utils/permissions.js';
import { config } from '../../../shared/config.js';

// Emoji list
export const name = 'removerole';
export async function execute(message, args) {
  if (!isMod(message.member)) return message.reply('❌ Mod only.');
  
  const target = message.mentions.members.first();
  const role = message.mentions.roles.first();
  
  if (!target || !role) return message.reply('❌ Usage: `!removerole @user @role`');
  
  await target.roles.remove(role);
  await message.reply(`✅ Removed ${role.name} from ${target.user.tag}`);
}