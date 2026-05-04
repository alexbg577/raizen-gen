import { EmbedBuilder, PermissionFlagsBits, ChannelType } from 'discord.js';
import { isAdmin, isMod, isStaff } from '../../utils/permissions.js';
import { config } from '../../../shared/config.js';

// Emoji list
export const name = 'ticactoe';
export async function execute(message, args) {
  await message.reply('❌ Tic-Tac-Toe is a multiplayer game. Use `!tictactoe @opponent` (Coming soon!)');
}