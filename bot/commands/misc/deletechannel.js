import { EmbedBuilder, PermissionFlagsBits, ChannelType } from 'discord.js';
import { isAdmin, isMod, isStaff } from '../../utils/permissions.js';
import { config } from '../../../shared/config.js';

// Emoji list
export const name = 'deletechannel';
export async function execute(message, args) {
  if (!isAdmin(message.member)) return message.reply('❌ Admin only.');
  
  const channel = message.mentions.channels.first() || message.channel;
  await channel.delete();
}