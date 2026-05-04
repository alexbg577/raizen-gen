import { EmbedBuilder, PermissionFlagsBits, ChannelType } from 'discord.js';
import { isAdmin, isMod, isStaff } from '../../utils/permissions.js';
import { config } from '../../../shared/config.js';

// Emoji list
export const name = 'joke';
export async function execute(message, args) {
  const jokes = [
    'Why don\'t scientists trust atoms? Because they make up everything!',
    'Why did the scarecrow win an award? He was outstanding in his field!',
    'What do you call a fake noodle? An impasta!',
    'Why don\'t eggs tell jokes? They\'d crack each other up!',
    'What do you call a bear with no teeth? A gummy bear!'
  ];
  await message.reply(`😂 ${jokes[Math.floor(Math.random() * jokes.length)]}`);
}