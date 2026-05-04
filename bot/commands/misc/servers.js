import { EmbedBuilder, PermissionFlagsBits, ChannelType } from 'discord.js';
import { isAdmin, isMod, isStaff } from '../../utils/permissions.js';
import { config } from '../../../shared/config.js';

// Emoji list
export const name = 'servers';
export async function execute(message, args) {
  if (!isAdmin(message.member)) return message.reply('❌ Admin only.');
  
  const guilds = message.client.guilds.cache;
  const desc = guilds.map(g => `**${g.name}** - ${g.memberCount} members`).join('\n');
  
  const embed = new EmbedBuilder()
    .setColor(0x5865F2)
    .setTitle(`📁 Servers (${guilds.size})`)
    .setDescription(desc)
    .setFooter({ text: 'Raizen Gen • Multi-Server' });
  
  await message.reply({ embeds: [embed] });
}