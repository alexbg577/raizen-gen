import { EmbedBuilder, PermissionFlagsBits, ChannelType } from 'discord.js';
import { isAdmin, isMod, isStaff } from '../../utils/permissions.js';
import { config } from '../../../shared/config.js';

// Emoji list
export const name = 'firstmessage';
export async function execute(message, args) {
  const channel = message.mentions.channels.first() || message.channel;
  const messages = await channel.messages.fetch({ limit: 100 });
  const firstMsg = messages.last();
  
  if (!firstMsg) return message.reply('❌ No messages found.');
  
  const embed = new EmbedBuilder()
    .setColor(0x57F287)
    .setTitle(`📜 First Message in #${channel.name}`)
    .addFields(
      { name: '👤 Author', value: `${firstMsg.author.tag}`, inline: true },
      { name: '📅 Sent', value: `<t:${Math.floor(firstMsg.createdTimestamp / 1000)}:R>`, inline: true },
      { name: '📝 Content', value: firstMsg.content.substring(0, 1024) || 'Embed/Attachment', inline: false }
    )
    .setFooter({ text: `ID: ${firstMsg.id}` });
  
  await message.reply({ embeds: [embed] });
}