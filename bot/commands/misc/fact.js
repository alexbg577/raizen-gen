import { EmbedBuilder, PermissionFlagsBits, ChannelType } from 'discord.js';
import { isAdmin, isMod, isStaff } from '../../utils/permissions.js';
import { config } from '../../../shared/config.js';

// Emoji list
export const name = 'fact';
export async function execute(message, args) {
  const facts = [
    'The first computer virus was created in 1983.',
    'The term "robot" comes from a Czech word meaning "forced labor".',
    'The first website is still online: http://info.cern.ch',
    'Approximately 90% of the world\'s data was created in the last two years.',
    'The average person spends 5 years of their life on social media.'
  ];
  await message.reply(`💡 Did you know? ${facts[Math.floor(Math.random() * facts.length)]}`);
}