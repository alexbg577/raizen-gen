import { EmbedBuilder, PermissionFlagsBits, ChannelType } from 'discord.js';
import { isAdmin, isMod, isStaff } from '../../utils/permissions.js';
import { config } from '../../../shared/config.js';

// Emoji list
export const name = 'movemsg';
export async function execute(message, args) {
  if (!isMod(message.member)) return message.reply('❌ Mod only.');
  const target = message.mentions.channels.first();
  if (!target) return message.reply('❌ Usage: `!movemsg #channel`');
    
  const messages = await message.channel.messages.fetch({ limit: 100 });
  for (const msg of messages.reverse().values()) {
    await target.send({ content: msg.content, embeds: msg.embeds }).catch(() => {});
    await msg.delete().catch(() => {});
  }
  await message.reply(`✅ Moved messages to ${target}`);
}