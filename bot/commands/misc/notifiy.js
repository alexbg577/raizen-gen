import { EmbedBuilder, PermissionFlagsBits, ChannelType } from 'discord.js';
import { isAdmin, isMod, isStaff } from '../../utils/permissions.js';
import { config } from '../../../shared/config.js';

// Emoji list
export const name = 'notifiy';
export async function execute(message, args) {
  if (!isStaff(message.member)) return message.reply('❌ Staff only.');
  const msg = args.join(' ') || 'Important notification!';
  const embed = new EmbedBuilder()
    .setColor(0xED4245)
    .setTitle('📢 Notification')
    .setDescription(msg)
    .setFooter({ text: `Sent by ${message.author.tag}` })
    .setTimestamp();
    
  await message.channel.send({ content: '@here', embeds: [embed] });
  await message.delete().catch(() => {});
}