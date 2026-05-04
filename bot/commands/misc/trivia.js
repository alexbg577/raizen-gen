import { EmbedBuilder, PermissionFlagsBits, ChannelType } from 'discord.js';
import { isAdmin, isMod, isStaff } from '../../utils/permissions.js';
import { config } from '../../../shared/config.js';

// Emoji list
export const name = 'trivia';
export async function execute(message, args) {
  const questions = [
    { q: 'What is the capital of France?', a: 'Paris' },
    { q: 'How many continents are there?', a: '7' },
    { q: 'What is 2 + 2?', a: '4' },
    { q: 'What color is the sky?', a: 'Blue' }
  ];
  const q = questions[Math.floor(Math.random() * questions.length)];
  await message.reply(`❓ Trivia: ${q.q}\n\n*Answer in 30 seconds...*`);
}