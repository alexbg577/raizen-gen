import { EmbedBuilder, PermissionFlagsBits, ChannelType } from 'discord.js';
import { isAdmin, isMod, isStaff } from '../../utils/permissions.js';
import { config } from '../../../shared/config.js';

// Emoji list
export const name = 'boostinfo';
export async function execute(message, args) {
  const guild = message.guild;
  const boosts = guild.premiumSubscriptionCount || 0;
  const tier = guild.premiumTier || 0;
  
  const embed = new EmbedBuilder()
    .setColor(0xFEE75C)
    .setTitle(`🚀 Boost Info - ${guild.name}`)
    .addFields(
      { name: '🚀 Boosts', value: `${boosts}`, inline: true },
      { name: '📊 Tier', value: `Tier ${tier}`, inline: true },
      { name: '📁 Extra Emojis', value: tier >= 1 ? 'Yes' : 'No', inline: true },
      { name: '🎬 Extra Bitrate', value: tier >= 2 ? 'Yes' : 'No', inline: true }
    )
    .setFooter({ text: 'Raizen Gen • Boost Info' });
  
  await message.reply({ embeds: [embed] });
}