import { EmbedBuilder, PermissionFlagsBits, ChannelType } from 'discord.js';
import { isAdmin, isMod, isStaff } from '../../utils/permissions.js';
import { config } from '../../../shared/config.js';

// Emoji list
export const name = 'blackjack';
export async function execute(message, args) {
  await message.reply('🃏 Blackjack! Your hand: **15**\nDealer shows: **10**\n*Hit or stand? (Coming soon!)*');
}