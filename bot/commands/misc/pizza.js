import { EmbedBuilder, PermissionFlagsBits, ChannelType } from 'discord.js';
import { isAdmin, isMod, isStaff } from '../../utils/permissions.js';
import { config } from '../../../shared/config.js';

// Emoji list
export const name = 'pizza';
export async function execute(message, args) {
  const target = message.mentions.members.first();
  if (target) {
    await message.reply(`🍕 ${message.author} gives pizza to ${target}!`);
  } else {
    await message.reply(`🍕 ${message.author} eats pizza!`);
  }
}