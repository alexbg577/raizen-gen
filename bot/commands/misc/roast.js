import { EmbedBuilder, PermissionFlagsBits, ChannelType } from 'discord.js';
import { isAdmin, isMod, isStaff } from '../../utils/permissions.js';
import { config } from '../../../shared/config.js';

// Emoji list
export const name = 'roast';
export async function execute(message, args) {
  const roasts = [
    'You\'re like a cloud. When you go away, it\'s a beautiful day.',
    'You\'re the reason the gene pool needs a lifeguard.',
    'If you were a spice, you\'d be flour.',
    'You bring everyone so much joy... when you leave the room.',
    'You\'re not stupid; you just have bad luck thinking.'
  ];
  const text = roasts[Math.floor(Math.random() * roasts.length)];
  const target = message.mentions.members.first() || message.member;
  await message.reply(`🔥 ${target}, ${text}`);
}