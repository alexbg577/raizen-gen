import { EmbedBuilder, PermissionFlagsBits, ChannelType } from 'discord.js';
import { isAdmin, isMod, isStaff } from '../../utils/permissions.js';
import { config } from '../../../shared/config.js';

// Emoji list
export const name = 'meme';
export async function execute(message, args) {
  const memes = [
    'When you realize it\'s Monday tomorrow',
    'That feeling when code works on first try',
    'Discord down for maintenance',
    'Me waiting for the weekend',
    'When someone asks for help at 11 PM'
  ];
  await message.reply(`😂 Meme: ${memes[Math.floor(Math.random() * memes.length)]}`);
}