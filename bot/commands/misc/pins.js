import { EmbedBuilder, PermissionFlagsBits, ChannelType } from 'discord.js';
import { isAdmin, isMod, isStaff } from '../../utils/permissions.js';
import { config } from '../../../shared/config.js';

// Emoji list
export const name = 'pins';
export async function execute(message, args) {
  const pins = await message.channel.messages.fetchPinned();
  if (!pins.size) return message.reply('❌ No pinned messages.');
      
  const desc = pins.map(m => `[${m.id}] ${m.content.substring(0, 50)}... by ${m.author.tag}`).join('\n');
  await message.reply(`📌 Pinned Messages:\n${desc}`);
}