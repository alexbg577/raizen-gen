import { EmbedBuilder, PermissionFlagsBits, ChannelType } from 'discord.js';
import { isAdmin, isMod, isStaff } from '../../utils/permissions.js';
import { config } from '../../../shared/config.js';

// Emoji list
export const name = 'poll';
export async function execute(message, args) {
  if (!args.length) return message.reply('❌ Usage: `!poll <question> | option1 | option2 ...`');
  
  const fullText = args.join(' ');
  const [question, ...options] = fullText.split('|').map(s => s.trim());
  
  if (!options.length) return message.reply('❌ Please provide options with | separator.');
  
  const desc = options.map((opt, i) => `${i + 1}. ${opt}`).join('\n');
  
  const embed = new EmbedBuilder()
    .setColor(0x5865F2)
    .setTitle(`📊 Poll: ${question}`)
    .setDescription(desc)
    .setFooter({ text: `Poll by ${message.author.tag}` })
    .setTimestamp();
  
  const pollMsg = await message.reply({ embeds: [embed] });
  
  for (let i = 0; i < Math.min(options.length, 10); i++) {
    await pollMsg.react(String.fromCharCode(0x1F1E6 + i)).catch(() => {});
    await new Promise(r => setTimeout(r, 500));
  }
}