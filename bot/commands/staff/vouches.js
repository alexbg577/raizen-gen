import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { isAdmin } from '../../utils/permissions.js';
import { removeVouch, getVouches } from '../../utils/github.js';

export const rvouch = {
  data: new SlashCommandBuilder()
    .setName('rvouch')
    .setDescription('Remove vouches from a user (Admin only)')
    .addUserOption(o => o.setName('user').setDescription('Target user').setRequired(true))
    .addIntegerOption(o => o.setName('amount').setDescription('Amount to remove').setRequired(false).setMinValue(1)),

  async execute(interaction) {
    if (!isAdmin(interaction.member)) {
      return interaction.reply({ content: '❌ Admin only.', ephemeral: true });
    }
    const target = interaction.options.getUser('user');
    const amount = interaction.options.getInteger('amount') || 1;
    await interaction.deferReply({ ephemeral: true });
    const updated = await removeVouch(target.id, amount);
    const remaining = updated[target.id]?.count || 0;
    await interaction.editReply({ content: `✅ Removed **${amount}** vouch(es) from ${target}. They now have **${remaining}** vouches.` });
  }
};

export const leaderboard = {
  data: new SlashCommandBuilder()
    .setName('leaderboard')
    .setDescription('Show vouch leaderboard'),

  async execute(interaction) {
    await interaction.deferReply();
    const vouches = await getVouches();
    const sorted = Object.entries(vouches)
      .map(([id, data]) => ({ id, count: data.count || 0 }))
      .filter(e => e.count > 0)
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    if (!sorted.length) {
      return interaction.editReply({ content: 'No vouches yet.' });
    }

    const medals = ['🥇', '🥈', '🥉'];
    const desc = sorted.map((e, i) => {
      const medal = medals[i] || `**#${i + 1}**`;
      return `${medal} <@${e.id}> — **${e.count}** vouches`;
    }).join('\n');

    const embed = new EmbedBuilder()
      .setColor(0xFEE75C)
      .setTitle('⭐ Vouch Leaderboard')
      .setDescription(desc)
      .setFooter({ text: 'Raizen Gen' })
      .setTimestamp();

    await interaction.editReply({ embeds: [embed] });
  }
};
