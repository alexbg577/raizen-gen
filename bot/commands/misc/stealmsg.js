import { EmbedBuilder, PermissionFlagsBits, ChannelType } from 'discord.js';
import { isAdmin, isMod, isStaff } from '../../utils/permissions.js';
import { config } from '../../../shared/config.js';

// Emoji list
export const name = 'stealmsg';
export async function execute(message, args) {
  if (!isMod(message.member)) return message.reply('❌ Mod only.');
  const target = message.reference?.messageId
    ? await message.channel.messages.fetch(message.reference.messageId)
    : null;
    
  if (!target) return message.reply('❌ Reply to a message to steal it.');
    
  await message.channel.send({ content: target.content, embeds: target.embeds, files: target.attachments.map(a => a.url) });
  await message.reply('✅ Message stolen!').then(m => setTimeout(() => m.delete(), 3000));
}