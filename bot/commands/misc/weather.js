import { EmbedBuilder, PermissionFlagsBits, ChannelType } from 'discord.js';
import { isAdmin, isMod, isStaff } from '../../utils/permissions.js';
import { config } from '../../../shared/config.js';

// Emoji list
export const name = 'weather';
export async function execute(message, args) {
  const city = args.join(' ') || 'Paris';
  const embed = new EmbedBuilder()
    .setColor(0x57F287)
    .setTitle(`🌤 Weather in ${city}`)
    .addFields(
      { name: '🌡️ Temp', value: '22°C', inline: true },
      { name: '☁️ Condition', value: 'Clear sky', inline: true },
      { name: '💧 Humidity', value: '65%', inline: true }
    )
    .setFooter({ text: 'Mock data • Use real API for production' });
  
  await message.reply({ embeds: [embed] });
}