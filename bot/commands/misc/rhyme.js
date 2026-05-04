import { EmbedBuilder, PermissionFlagsBits, ChannelType } from 'discord.js';
import { isAdmin, isMod, isStaff } from '../../utils/permissions.js';
import { config } from '../../../shared/config.js';

// Emoji list
export const name = 'rhyme';
export async function execute(message, args) {
  const word = args[0] || 'cat';
  const rhymes = {
    'cat': ['hat', 'bat', 'mat', 'rat', 'sat'],
    'dog': ['log', 'fog', 'hog', 'jog', 'bog'],
    'love': ['dove', 'above', 'glove', 'shove'],
    'cold': ['old', 'bold', 'sold', 'told', 'gold']
  };
  const rhymeList = rhymes[word.toLowerCase()] || ['No rhymes found'];
  await message.reply(`🎵 Words that rhyme with ${word}: ${rhymeList.join(', ')}`);
}