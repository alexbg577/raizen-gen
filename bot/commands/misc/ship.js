import { EmbedBuilder, PermissionFlagsBits, ChannelType } from 'discord.js';
import { isAdmin, isMod, isStaff } from '../../utils/permissions.js';
import { config } from '../../../shared/config.js';

// Emoji list
export const name = 'ship';
export async function execute(message, args) {
  const user1 = message.mentions.members.first() || message.member;
  const user2 = message.mentions.members.last() || message.author;
  const score = Math.floor(Math.random() * 100) + 1;
  await message.reply(`💞 Shipping ${user1} with ${user2}...\n**${score}%** compatibility! ${score > 50 ? '💖' : '💔'}`);
}