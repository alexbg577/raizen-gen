import { EmbedBuilder, PermissionFlagsBits, ChannelType } from 'discord.js';
import { isAdmin, isMod, isStaff } from '../../utils/permissions.js';
import { config } from '../../../shared/config.js';

// Emoji list
export const name = 'announce';
export async function execute(message, args) {
  if (!isAdmin(message.member)) return message.reply('❌ Admin only.');
  
  const text = args.join(' ');
  if (!text) return message.reply('❌ Usage: `!announce <message>`');
  
  const embed = new EmbedBuilder()
    .setColor(0xFEE75C)
    .setTitle('📢 Announcement')
    .setDescription(text)
    .setFooter({ text: `Announced by ${message.author.tag}` })
    .setTimestamp();
  
  await message.channel.send({ content: '@everyone', embeds: [embed] });
}