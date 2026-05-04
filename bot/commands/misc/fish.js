import { EmbedBuilder, PermissionFlagsBits, ChannelType } from 'discord.js';
import { isAdmin, isMod, isStaff } from '../../utils/permissions.js';
import { config } from '../../../shared/config.js';

// Emoji list
export const name = 'fish';
export async function execute(message, args) {
  const fish = ['cod', 'salmon', 'tuna', 'bass', 'trout', 'pike'];
  const caught = fish[Math.floor(Math.random() * fish.length)];
  await message.reply(`🎣 ${message.author} caught a **${caught}**!`);
}