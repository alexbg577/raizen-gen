import { EmbedBuilder, PermissionFlagsBits, ChannelType } from 'discord.js';
import { isAdmin, isMod, isStaff } from '../../utils/permissions.js';
import { config } from '../../../shared/config.js';

// Emoji list
export const name = 'shop';
export async function execute(message, args) {
  const embed = new EmbedBuilder()
    .setColor(0xFEE75C)
    .setTitle('🏪 Item Shop')
    .addFields(
      { name: '⚔️ Sword', value: '500 credits', inline: true },
      { name: '🛡️ Shield', value: '400 credits', inline: true },
      { name: '🧪 Potion', value: '100 credits', inline: true },
      { name: '🏹 Bow', value: '300 credits', inline: true },
      { name: '🏹 Arrow (10x)', value: '50 credits', inline: true },
      { name: '🛡️ Armor', value: '600 credits', inline: true }
    )
    .setFooter({ text: 'Raizen Gen • Mock Economy' });
  
  await message.reply({ embeds: [embed] });
}