import { EmbedBuilder, PermissionFlagsBits, ChannelType } from 'discord.js';
import { isAdmin, isMod, isStaff } from '../../utils/permissions.js';
import { config } from '../../../shared/config.js';

// Emoji list
export const name = 'unpin';
export async function execute(message, args) {
  const target = message.reference?.messageId
    ? await message.channel.messages.fetch(message.reference.messageId)
    : null;
        
  if (!target) return message.reply('❌ Reply to a message to unpin it.');
        
  await target.unpin();
  await message.reply('✅ Message unpinned!');
}