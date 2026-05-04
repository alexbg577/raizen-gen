import { EmbedBuilder, PermissionFlagsBits, ChannelType } from 'discord.js';
import { isAdmin, isMod, isStaff } from '../../utils/permissions.js';
import { config } from '../../../shared/config.js';

// Emoji list
export const name = 'lock';
export async function execute(message, args) {
  if (!isMod(message.member)) return message.reply('❌ Mod only.');
  
  await message.channel.permissionOverwrites.edit(message.guild.roles.everyone, { SendMessages: false });
  await message.reply('🔒 Channel locked!');
}