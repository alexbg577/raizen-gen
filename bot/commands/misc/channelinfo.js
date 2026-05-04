import { EmbedBuilder, PermissionFlagsBits, ChannelType } from 'discord.js';
import { isAdmin, isMod, isStaff } from '../../utils/permissions.js';
import { config } from '../../../shared/config.js';

// Emoji list
export const name = 'channelinfo';
export async function execute(message, args) {
  const channel = message.mentions.channels.first() || message.channel;
  
  const embed = new EmbedBuilder()
    .setColor(0x5865F2)
    .setTitle(`📁 ${channel.name} Info`)
    .addFields(
      { name: '📃 Type', value: channel.type, inline: true },
      { name: '📅 Created', value: `<t:${Math.floor(channel.createdTimestamp / 1000)}:R>`, inline: true },
      { name: '👥 Members', value: `${channel.members?.size || 'N/A'}`, inline: true },
      { name: '🔐 NSFW', value: channel.nsfw ? 'Yes' : 'No', inline: true }
    )
    .setFooter({ text: `ID: ${channel.id}` });
  
  await message.reply({ embeds: [embed] });
}