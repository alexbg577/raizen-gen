import { EmbedBuilder, PermissionFlagsBits, ChannelType } from 'discord.js';
import { isAdmin, isMod, isStaff } from '../../utils/permissions.js';
import { config } from '../../../shared/config.js';

// Emoji list
export const name = 'kiss';
export async function execute(message, args) {
  const target = message.mentions.members.first() || message.member;
  await message.reply(`💋 ${message.author} kisses ${target}!`);
}