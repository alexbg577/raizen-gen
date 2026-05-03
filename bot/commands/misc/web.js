import { EmbedBuilder } from 'discord.js';

export const name = 'web';

export async function execute(message, args) {
  const embed = new EmbedBuilder()
    .setColor(0x5865F2)
    .setTitle('🌐 Raizen Gen Web')
    .setDescription('Access the web dashboard:')
    .addFields(
      { name: '🔗 Link', value: 'https://raizen-gen-web.onrender.com', inline: false },
      { name: '📋 Features', value: '• View stock\n• Generate accounts\n• Leaderboard\n• Giveaways', inline: false }
    )
    .setFooter({ text: 'Raizen Gen • Web Dashboard' })
    .setTimestamp();

  await message.reply({ embeds: [embed] });
}
