import { EmbedBuilder, PermissionFlagsBits, ChannelType } from 'discord.js';
import { isAdmin, isMod, isStaff } from '../../utils/permissions.js';
import { config } from '../../../shared/config.js';

// Emoji list
export const name = 'slot';
export async function execute(message, args) {
  const emojis = ['🍒', '🍋', '🍊', '7️⃣', '📊', '💰'];
  const r1 = emojis[Math.floor(Math.random() * emojis.length)];
  const r2 = emojis[Math.floor(Math.random() * emojis.length)];
  const r3 = emojis[Math.floor(Math.random() * emojis.length)];
  const win = r1 === r2 && r2 === r3;
  await message.reply(`🎰 ${r1} | ${r2} | ${r3}\n${win ? '🎉 JACKPOT! You won!' : 'Better luck next time!'}`);
}