import { EmbedBuilder, PermissionFlagsBits, ChannelType } from 'discord.js';
import { isAdmin, isMod, isStaff } from '../../utils/permissions.js';
import { config } from '../../../shared/config.js';

// Emoji list
export const name = 'truth';
export async function execute(message, args) {
  const truths = [
    'What\'s your biggest fear?', 'Have you ever lied to your best friend?',
    'What\'s the most embarrassing thing you\'ve done?',
    'Who was your first crush?', 'What\'s your biggest regret?'
  ];
  await message.reply(`❓ Truth: ${truths[Math.floor(Math.random() * truths.length)]}`);
}