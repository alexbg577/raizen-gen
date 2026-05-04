import { EmbedBuilder, PermissionFlagsBits, ChannelType } from 'discord.js';
import { isAdmin, isMod, isStaff } from '../../utils/permissions.js';
import { config } from '../../../shared/config.js';

// Emoji list
export const name = 'inventory';
export async function execute(message, args) {
  const items = ['Sword', 'Shield', 'Potion', 'Bow', 'Arrow', 'Armor'];
  const inv = items.slice(0, Math.floor(Math.random() * items.length) + 1).join(', ') || 'Empty';
  await message.reply(`🎒 ${message.author}'s Inventory: ${inv}`);
}