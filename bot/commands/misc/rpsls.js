import { EmbedBuilder, PermissionFlagsBits, ChannelType } from 'discord.js';
import { isAdmin, isMod, isStaff } from '../../utils/permissions.js';
import { config } from '../../../shared/config.js';

// Emoji list
export const name = 'rpsls';
export async function execute(message, args) {
  const choices = ['rock', 'paper', 'scissors', 'lizard', 'spock'];
  const botChoice = choices[Math.floor(Math.random() * 5)];
  const userChoice = args[0]?.toLowerCase();
    
  if (!choices.includes(userChoice)) {
    return message.reply('❌ Usage: `!rpsls <rock|paper|scissors|lizard|spock>`');
  }
    
  await message.reply(`🎮 You: **${userChoice}** | Bot: **${botChoice}**\n*Extended RPS rules!*`);
}