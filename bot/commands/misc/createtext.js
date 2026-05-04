import { EmbedBuilder, PermissionFlagsBits, ChannelType } from 'discord.js';
import { isAdmin, isMod, isStaff } from '../../utils/permissions.js';
import { config } from '../../../shared/config.js';

// Emoji list
export const name = 'createtext';
export async function execute(message, args) {
  if (!isAdmin(message.member)) return message.reply('❌ Admin only.');
  
  const name = args.join('-') || 'new-channel';
  const channel = await message.guild.channels.create({
    name,
    type: ChannelType.GuildText,
  });
  
  await message.reply(`✅ Created text channel: ${channel}`);
}