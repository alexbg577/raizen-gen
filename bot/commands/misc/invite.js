import { EmbedBuilder, PermissionFlagsBits, ChannelType } from 'discord.js';
import { isAdmin, isMod, isStaff } from '../../utils/permissions.js';
import { config } from '../../../shared/config.js';

// Emoji list
export const name = 'invite';
export async function execute(message, args) {
  const invite = await message.channel.createInvite({
    maxAge: 0,
    maxUses: 0,
    unique: true,
  });
  
  await message.reply(`📨 Invite created: https://discord.gg/${invite.code}`);
}