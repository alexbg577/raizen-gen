import { EmbedBuilder, PermissionFlagsBits, ChannelType } from 'discord.js';
import { isAdmin, isMod, isStaff } from '../../utils/permissions.js';
import { config } from '../../../shared/config.js';

// Emoji list
export const name = 'compliment';
export async function execute(message, args) {
  const compliments = [
    'You\'re amazing!', 'You\'re doing great!', 'You\'re a wonderful person!',
    'You\'re so talented!', 'You make the world better!', 'You\'re awesome!',
    'You\'re appreciated!', 'You\'re unique and special!', 'You\'re loved!',
    'You\'re a star!'
  ];
  const text = compliments[Math.floor(Math.random() * compliments.length)];
  const target = message.mentions.members.first() || message.member;
  await message.reply(`💖 ${target}, ${text}`);
}