import { EmbedBuilder, PermissionFlagsBits, ChannelType } from 'discord.js';
import { isAdmin, isMod, isStaff } from '../../utils/permissions.js';
import { config } from '../../../shared/config.js';

// Emoji list
export const name = 'hunt';
export async function execute(message, args) {
  const animals = ['deer', 'rabbit', 'fox', 'bear', 'wolf', 'boar'];
  const animal = animals[Math.floor(Math.random() * animals.length)];
  const success = Math.random() > 0.3;
  if (success) {
    await message.reply(`🏹 ${message.author} hunted a **${animal}** successfully!`);
  } else {
    await message.reply(`🏹 ${message.author} failed to hunt. The **${animal}** got away!`);
  }
}