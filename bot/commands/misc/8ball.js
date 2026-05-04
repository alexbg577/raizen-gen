import { EmbedBuilder, PermissionFlagsBits, ChannelType } from 'discord.js';
import { isAdmin, isMod, isStaff } from '../../utils/permissions.js';
import { config } from '../../../shared/config.js';

// Emoji list
export const name = '8ball';
export async function execute(message, args) {
  const responses = [
    'It is certain.', 'Without a doubt.', 'You may rely on it.',
    'Yes definitely.', 'It is decidedly so.', 'As I see it, yes.',
    'Most likely.', 'Outlook good.', 'Yes.', 'Signs point to yes.',
    'Reply hazy, try again.', 'Ask again later.', 'Better not tell you now.',
    'Cannot predict now.', 'Concentrate and ask again.', 'Don\'t count on it.',
    'My reply is no.', 'My sources say no.', 'Outlook not so good.',
    'Very doubtful.'
  ];
  const response = responses[Math.floor(Math.random() * responses.length)];
  await message.reply(`🎱 ${response}`);
}