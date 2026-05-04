import { EmbedBuilder, PermissionFlagsBits, ChannelType } from 'discord.js';
import { isAdmin, isMod, isStaff } from '../../utils/permissions.js';
import { config } from '../../../shared/config.js';

// Emoji list
export const name = 'emojis';
export async function execute(message, args) {
  const emojis = message.guild.emojis.cache;
  if (!emojis.size) return message.reply('❌ No custom emojis in this server.');
  
  const emojiList = emojis.map(e => e.animated ? `<a:${e.name}:${e.id}>` : `<:${e.name}:${e.id}>`).join(' ');
  
  const embed = new EmbedBuilder()
    .setColor(0xFFD700)
    .setTitle(`😀 Custom Emojis (${emojis.size})`)
    .setDescription(emojiList.substring(0, 4096))
    .setFooter({ text: 'Raizen Gen • Emoji List' });
  
  await message.reply({ embeds: [embed] });
}