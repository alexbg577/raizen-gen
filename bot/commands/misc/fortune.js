import { EmbedBuilder, PermissionFlagsBits, ChannelType } from 'discord.js';
import { isAdmin, isMod, isStaff } from '../../utils/permissions.js';
import { config } from '../../../shared/config.js';

// Emoji list
export const name = 'fortune';
export async function execute(message, args) {
  const fortunes = [
    'You will have a pleasant surprise.',
    'Good things come to those who wait.',
    'A chance meeting will open new doors.',
    'Your hard work will pay off soon.',
    'Adventure awaits you in the near future.'
  ];
  await message.reply(`🔮 Your fortune: ${fortunes[Math.floor(Math.random() * fortunes.length)]}`);
}