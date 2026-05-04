import { EmbedBuilder, PermissionFlagsBits, ChannelType } from 'discord.js';
import { isAdmin, isMod, isStaff } from '../../utils/permissions.js';
import { config } from '../../../shared/config.js';

// Emoji list
export const name = 'poker';
export async function execute(message, args) {
  const hand = ['A♠️', 'K♠️', 'Q♠️', 'J♠️', '10♠️'];
  await message.reply(`🃏 Your poker hand:\n${hand.join(' ')}\n*Royal Flush! (Mock)*`);
}