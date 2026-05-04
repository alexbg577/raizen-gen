import { EmbedBuilder, PermissionFlagsBits, ChannelType } from 'discord.js';
import { isAdmin, isMod, isStaff } from '../../utils/permissions.js';
import { config } from '../../../shared/config.js';

// Emoji list
export const name = 'ping';
export async function execute(message, args) {
  const start = Date.now();
  const msg = await message.reply('🏓 Pinging...');
  const latency = Date.now() - start;
  await msg.edit(`🏓 Pong! Latency: ${latency}ms | API: ${message.client.ws.ping}ms`);
}