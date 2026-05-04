import { EmbedBuilder, PermissionFlagsBits, ChannelType } from 'discord.js';
import { isAdmin, isMod, isStaff } from '../../utils/permissions.js';
import { config } from '../../../shared/config.js';

// Emoji list
export const name = 'clearreactions';
export async function execute(message, args) {
  if (!isMod(message.member)) return message.reply('❌ Mod only.');
  
  const msg = message.reference?.messageId
    ? await message.channel.messages.fetch(message.reference.messageId)
    : (await message.channel.messages.fetch({ limit: 1 })).first();
  
  if (!msg) return message.reply('❌ No message found.');
  
  await msg.reactions.removeAll();
  await message.reply('✅ Reactions cleared!');
}