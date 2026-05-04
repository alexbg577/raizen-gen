import { EmbedBuilder, PermissionFlagsBits, ChannelType } from 'discord.js';
import { isAdmin, isMod, isStaff } from '../../utils/permissions.js';
import { config } from '../../../shared/config.js';

// Emoji list
export const name = 'purgebot';
export async function execute(message, args) {
  if (!isAdmin(message.member)) return message.reply('❌ Admin only.');
  const amount = parseInt(args[0]) || 100;
  const messages = await message.channel.messages.fetch({ limit: amount });
  const botMessages = messages.filter(m => m.author.bot);
  await message.channel.bulkDelete(botMessages);
  await message.reply(`✅ Deleted ${botMessages.size} bot messages.`).then(m => setTimeout(() => m.delete(), 3000));
}