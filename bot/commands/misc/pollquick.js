import { EmbedBuilder, PermissionFlagsBits, ChannelType } from 'discord.js';
import { isAdmin, isMod, isStaff } from '../../utils/permissions.js';
import { config } from '../../../shared/config.js';

// Emoji list
export const name = 'pollquick';
export async function execute(message, args) {
  if (args.length < 2) return message.reply('❌ Usage: `!pollquick <question> | yes | no`');
    
  const [question, ...options] = args.join(' ').split('|').map(s => s.trim());
  const embed = new EmbedBuilder()
    .setColor(0x5865F2)
    .setTitle(`📊 Quick Poll: ${question}`)
    .setDescription('👍 Yes | 👎 No')
    .setFooter({ text: `Poll by ${message.author.tag}` })
    .setTimestamp();
    
  const pollMsg = await message.reply({ embeds: [embed] });
  await pollMsg.react('👍');
  await pollMsg.react('👎');
}