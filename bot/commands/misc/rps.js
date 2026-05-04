import { EmbedBuilder, PermissionFlagsBits, ChannelType } from 'discord.js';
import { isAdmin, isMod, isStaff } from '../../utils/permissions.js';
import { config } from '../../../shared/config.js';

// Emoji list
export const name = 'rps';
export async function execute(message, args) {
  const choices = ['rock', 'paper', 'scissors'];
  const botChoice = choices[Math.floor(Math.random() * 3)];
  const userChoice = args[0]?.toLowerCase();
  
  if (!choices.includes(userChoice)) {
    return message.reply('❌ Usage: `!rps <rock|paper|scissors>`');
  }
  
  let result = 'It\'s a tie!';
  if (
    (userChoice === 'rock' && botChoice === 'scissors') ||
    (userChoice === 'paper' && botChoice === 'rock') ||
    (userChoice === 'scissors' && botChoice === 'paper')
  ) {
    result = 'You win!';
  } else if (userChoice !== botChoice) {
    result = 'Bot wins!';
  }
  
  await message.reply(`🎮 You: **${userChoice}** | Bot: **${botChoice}**\n${result}`);
}