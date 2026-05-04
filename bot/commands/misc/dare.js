import { EmbedBuilder, PermissionFlagsBits, ChannelType } from 'discord.js';
import { isAdmin, isMod, isStaff } from '../../utils/permissions.js';
import { config } from '../../../shared/config.js';

// Emoji list
export const name = 'dare';
export async function execute(message, args) {
  const dares = [
    'Send a DM to someone you hardly talk to.',
    'Change your Discord nickname to "I love Raizen Gen" for 10 minutes.',
    'Sing a song in voice chat (or record and send).',
    'Send a friend request to the 10th person in your friends list.',
    'Change your avatar to something funny for 1 hour.'
  ];
  await message.reply(`❗ Dare: ${dares[Math.floor(Math.random() * dares.length)]}`);
}