import { EmbedBuilder, PermissionFlagsBits, ChannelType } from 'discord.js';
import { isAdmin, isMod, isStaff } from '../../utils/permissions.js';
import { config } from '../../../shared/config.js';

// Emoji list
export const name = 'leaderboard';
export async function execute(message, args) {
  const players = [
    { name: 'Player1', score: 1500 },
    { name: 'Player2', score: 1200 },
    { name: 'Player3', score: 900 },
    { name: 'Player4', score: 600 },
    { name: 'Player5', score: 300 }
  ];
    
  const desc = players.map((p, i) => `**${i + 1}.** ${p.name} - **${p.score}** pts`).join('\n');
  const embed = new EmbedBuilder()
    .setColor(0xFFD700)
    .setTitle('🏆 Game Leaderboard')
    .setDescription(desc)
    .setFooter({ text: 'Raizen Gen • Mock Leaderboard' });
    
  await message.reply({ embeds: [embed] });
}