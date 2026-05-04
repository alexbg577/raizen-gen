import { EmbedBuilder, PermissionFlagsBits, ChannelType } from 'discord.js';
import { isAdmin, isMod, isStaff } from '../../utils/permissions.js';
import { config } from '../../../shared/config.js';

// Emoji list
export const name = 'advice';
export async function execute(message, args) {
  const advices = [
    'Always back up your code.',
    'Read the documentation first.',
    'Test your code before deploying.',
    'Keep your dependencies updated.',
    'Use version control for everything.'
  ];
  await message.reply(`💡 Advice: ${advices[Math.floor(Math.random() * advices.length)]}`);
}