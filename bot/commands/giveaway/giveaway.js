import {
  SlashCommandBuilder, EmbedBuilder, ButtonBuilder,
  ButtonStyle, ActionRowBuilder
} from 'discord.js';
import { isAdmin } from '../../utils/permissions.js';
import { saveGiveaway, deleteGiveaway, getGiveaways } from '../../utils/github.js';
import { sendLog, LogColors } from '../../utils/logger.js';

export const giveaway = {
  data: new SlashCommandBuilder()
    .setName('giveaway')
    .setDescription('Giveaway management')
    .addSubcommand(s => s.setName('create').setDescription('Create a giveaway')
      .addStringOption(o => o.setName('prize').setDescription('Prize').setRequired(true))
      .addIntegerOption(o => o.setName('duration').setDescription('Duration in minutes').setRequired(true).setMinValue(1))
      .addIntegerOption(o => o.setName('winners').setDescription('Number of winners').setRequired(false).setMinValue(1).setMaxValue(10))
    )
    .addSubcommand(s => s.setName('end').setDescription('End a giveaway early')
      .addStringOption(o => o.setName('message_id').setDescription('Giveaway message ID').setRequired(true))
    )
    .addSubcommand(s => s.setName('reroll').setDescription('Reroll a giveaway')
      .addStringOption(o => o.setName('message_id').setDescription('Giveaway message ID').setRequired(true))
    ),

  async execute(interaction) {
    if (!isAdmin(interaction.member)) {
      return interaction.reply({ content: '❌ Admin only.', ephemeral: true });
    }
    const sub = interaction.options.getSubcommand();

    if (sub === 'create') {
      const prize = interaction.options.getString('prize');
      const duration = interaction.options.getInteger('duration');
      const winners = interaction.options.getInteger('winners') || 1;
      const endsAt = Date.now() + duration * 60 * 1000;

      const embed = new EmbedBuilder()
        .setColor(0xFEE75C)
        .setTitle('🎉 GIVEAWAY')
        .setDescription(`**Prize:** ${prize}\n\n**Winners:** ${winners}\n**Ends:** <t:${Math.floor(endsAt / 1000)}:R>\n\nClick the button below to enter!`)
        .setFooter({ text: `Hosted by ${interaction.user.tag}` })
        .setTimestamp(endsAt);

      const btn = new ButtonBuilder()
        .setCustomId('giveaway_enter')
        .setLabel('🎉 Enter')
        .setStyle(ButtonStyle.Primary);

      const row = new ActionRowBuilder().addComponents(btn);
      await interaction.reply({ content: '✅ Giveaway created!', ephemeral: true });
      const msg = await interaction.channel.send({ embeds: [embed], components: [row] });

      await saveGiveaway({
        messageId: msg.id,
        channelId: interaction.channelId,
        prize,
        winners,
        endsAt,
        entries: [],
        ended: false,
        hostId: interaction.user.id,
      });

      // Auto-end
      setTimeout(() => endGiveaway(interaction.client, msg.id, interaction.channelId), duration * 60 * 1000);

      await sendLog(interaction.client, {
        color: LogColors.info,
        title: '🎉 Giveaway Started',
        description: `**${prize}** — ${winners} winner(s) — ends <t:${Math.floor(endsAt / 1000)}:R>`,
      });
    }

    if (sub === 'end') {
      const msgId = interaction.options.getString('message_id');
      await interaction.deferReply({ ephemeral: true });
      await endGiveaway(interaction.client, msgId, interaction.channelId);
      await interaction.editReply({ content: '✅ Giveaway ended.' });
    }

    if (sub === 'reroll') {
      const msgId = interaction.options.getString('message_id');
      await interaction.deferReply({ ephemeral: true });
      const giveaways = await getGiveaways();
      const g = giveaways[msgId];
      if (!g || !g.ended) return interaction.editReply({ content: '❌ Giveaway not found or not ended.' });
      const newWinners = pickWinners(g.entries, g.winners);
      const channel = interaction.guild.channels.cache.get(g.channelId || interaction.channelId);
      if (channel) {
        await channel.send({ content: `🎉 **Reroll!** New winner(s): ${newWinners.map(id => `<@${id}>`).join(', ')} — Prize: **${g.prize}**` });
      }
      await interaction.editReply({ content: '✅ Rerolled.' });
    }
  }
};

function pickWinners(entries, count) {
  const shuffled = [...entries].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

export async function endGiveaway(client, messageId, channelId) {
  const giveaways = await getGiveaways();
  const g = giveaways[messageId];
  if (!g || g.ended) return;

  g.ended = true;
  await saveGiveaway(g);

  const guild = client.guilds.cache.get(process.env.GUILD_ID);
  if (!guild) return;
  const channel = guild.channels.cache.get(channelId || g.channelId);
  if (!channel) return;

  const msg = await channel.messages.fetch(messageId).catch(() => null);
  if (!msg) return;

  const winners = pickWinners(g.entries, g.winners);

  const embed = new EmbedBuilder()
    .setColor(winners.length ? 0x57F287 : 0xED4245)
    .setTitle('🎉 GIVEAWAY ENDED')
    .setDescription(winners.length
      ? `**Prize:** ${g.prize}\n**Winner(s):** ${winners.map(id => `<@${id}>`).join(', ')}`
      : `**Prize:** ${g.prize}\n\nNo valid entries.`)
    .setFooter({ text: `Hosted by ${g.hostId}` })
    .setTimestamp();

  await msg.edit({ embeds: [embed], components: [] });

  if (winners.length) {
    await channel.send({ content: `🎉 Congratulations ${winners.map(id => `<@${id}>`).join(', ')}! You won **${g.prize}**!` });
  }
}

export async function restoreGiveaways(client) {
  const giveaways = await getGiveaways();
  const now = Date.now();
  for (const [msgId, g] of Object.entries(giveaways)) {
    if (g.ended) continue;
    const remaining = g.endsAt - now;
    if (remaining <= 0) {
      await endGiveaway(client, msgId, g.channelId);
    } else {
      setTimeout(() => endGiveaway(client, msgId, g.channelId), remaining);
    }
  }
}
