import { EmbedBuilder, PermissionFlagsBits, ChannelType } from 'discord.js';
import { isAdmin, isMod, isStaff } from '../../utils/permissions.js';
import { config } from '../../../shared/config.js';

// Emoji list
export const name = 'define';
export async function execute(message, args) {
  const word = args[0] || 'computer';
  const defs = {
    'computer': 'An electronic device for storing and processing data.',
    'discord': 'A VoIP and instant messaging social platform.',
    'bot': 'A software application that runs automated tasks.',
    'code': 'A system of words, letters, or symbols used to represent instructions.',
  };
  const def = defs[word.toLowerCase()] || 'Definition not found.';
  await message.reply(`📖 ${word}: ${def}`);
}