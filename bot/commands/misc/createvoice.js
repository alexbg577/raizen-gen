import { EmbedBuilder, PermissionFlagsBits, ChannelType } from 'discord.js';
import { isAdmin, isMod, isStaff } from '../../utils/permissions.js';
import { config } from '../../../shared/config.js';

// Emoji list
export const name = 'createvoice';
export async function execute(message, args) {
  if (!isAdmin(message.member)) return message.reply('❌ Admin only.');
  
  const name = args.join('-') || 'new-voice';
  const channel = await message.guild.channels.create({
    name,
    type: ChannelType.GuildVoice,
  });
  
  await message.reply(`✅ Created voice channel: ${channel}`);
}