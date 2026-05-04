import { EmbedBuilder, PermissionFlagsBits, ChannelType } from 'discord.js';
import { isAdmin, isMod, isStaff } from '../../utils/permissions.js';
import { config } from '../../../shared/config.js';

// Emoji list
export const name = 'esay';
export async function execute(message, args) {
  if (!isStaff(message.member)) return message.reply('❌ Staff only.');
  
  const text = args.join(' ');
  if (!text) return message.reply('❌ Usage: `!esay <message>`');
  
  const embed = new EmbedBuilder()
    .setColor(0x5865F2)
    .setDescription(text)
    .setFooter({ text: `Sent by ${message.author.tag}` })
    .setTimestamp();
  
  await message.delete().catch(() => {});
  await message.channel.send({ embeds: [embed] });
}