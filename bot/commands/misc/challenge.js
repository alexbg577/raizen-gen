import { EmbedBuilder, PermissionFlagsBits, ChannelType } from 'discord.js';
import { isAdmin, isMod, isStaff } from '../../utils/permissions.js';
import { config } from '../../../shared/config.js';

// Emoji list
export const name = 'challenge';
export async function execute(message, args) {
  const challenges = [
    'Code a bot feature in under 1 hour.',
    'Fix 3 bugs without looking at documentation.',
    'Deploy a feature without any errors.',
    'Help 5 users in one day.',
    'Learn a new coding concept this week.'
  ];
  await message.reply(`🏆 Challenge: ${challenges[Math.floor(Math.random() * challenges.length)]}`);
}