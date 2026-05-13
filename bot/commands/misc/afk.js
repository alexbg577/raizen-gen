import { EmbedBuilder, PermissionFlagsBits, ChannelType } from 'discord.js';
import { isAdmin, isMod, isStaff } from '../../utils/permissions.js';
import { config } from '../../../shared/config.js';

const afkUsers = new Map();

export const name = 'afk';
export async function execute(message, args) {
  const reason = args.join(' ') || 'AFK';
  afkUsers.set(message.author.id, { reason, time: Date.now() });
  await message.reply(`✅ ${message.author} is now AFK: ${reason}`);
}