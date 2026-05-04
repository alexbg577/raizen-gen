import { EmbedBuilder, PermissionFlagsBits, ChannelType } from 'discord.js';
import { isAdmin, isMod, isStaff } from '../../utils/permissions.js';
import { config } from '../../../shared/config.js';

// Emoji list
export const name = 'purgeuser';
export async function execute(message, args) {
  if (!isMod(message.member)) return message.reply('❌ Mod only.');
  const target = message.mentions.users.first();
  const amount = parseInt(args[1]) || 100;
  
  if (!target) return message.reply('❌ Usage: `!purgeuser @user [amount]`');
  
  const messages = await message.channel.messages.fetch({ limit: amount });
  const userMessages = messages.filter(m => m.author.id === target.id);
  await message.channel.bulkDelete(userMessages);
  await message.reply(`✅ Deleted ${userMessages.size} messages from ${target.tag}`).then(m => setTimeout(() => m.delete(), 3000));
}