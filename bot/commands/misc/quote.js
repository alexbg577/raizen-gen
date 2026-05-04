import { EmbedBuilder, PermissionFlagsBits, ChannelType } from 'discord.js';
import { isAdmin, isMod, isStaff } from '../../utils/permissions.js';
import { config } from '../../../shared/config.js';

// Emoji list
export const name = 'quote';
export async function execute(message, args) {
  const quotes = [
    '"The only way to do great work is to love what you do." - Steve Jobs',
    '"Innovation distinguishes between a leader and a follower." - Steve Jobs',
    '"Life is what happens when you\'re busy making other plans." - John Lennon',
    '"The future belongs to those who believe in the beauty of their dreams." - Eleanor Roosevelt',
    '"In the middle of difficulty lies opportunity." - Albert Einstein'
  ];
  await message.reply(`💬 ${quotes[Math.floor(Math.random() * quotes.length)]}`);
}