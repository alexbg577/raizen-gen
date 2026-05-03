import { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder } from 'discord.js';
import { isAdmin, isMegaDroper, isStaff } from '../../utils/permissions.js';
import { addStock, getStockCount, getAllStockCounts, getStock, writeFileContent } from '../../utils/github.js';
import { sendLog, LogColors } from '../../utils/logger.js';
import AdmZip from 'adm-zip';
import { config, TIERS } from '../../../shared/config.js';

export const addstock = {
  data: new SlashCommandBuilder()
    .setName('addstock')
    .setDescription('Add stock accounts (Staff only)')
    .addStringOption(o => o.setName('tier').setDescription('Tier').setRequired(true)
      .addChoices(
        { name: 'Free', value: 'free' },
        { name: 'Premium', value: 'premium' },
        { name: 'Booster', value: 'booster' },
        { name: 'Extreme', value: 'extreme' },
      ))
    .addAttachmentOption(o => o.setName('file').setDescription('.txt or .zip file').setRequired(true)),

  async execute(interaction) {
    if (!isStaff(interaction.member)) return interaction.reply({ content: '❌ Staff only.', ephemeral: true });
    const tier = interaction.options.getString('tier');
    const attachment = interaction.options.getAttachment('file');
    await interaction.deferReply({ ephemeral: true });

    const url = attachment.url;
    const filename = attachment.name.toLowerCase();

    // Fetch file
    const response = await fetch(url);
    const buffer = Buffer.from(await response.arrayBuffer());

    let lines = [];

    if (filename.endsWith('.zip')) {
      const zip = new AdmZip(buffer);
      const entries = zip.getEntries();
      for (const entry of entries) {
        if (entry.name.endsWith('.txt')) {
          const content = entry.getData().toString('utf-8');
          lines.push(...content.split('\n').map(l => l.trim()).filter(Boolean));
        }
      }
    } else if (filename.endsWith('.txt')) {
      lines = buffer.toString('utf-8').split('\n').map(l => l.trim()).filter(Boolean);
    } else {
      return interaction.editReply({ content: '❌ Only .txt or .zip files are accepted.' });
    }

    if (!lines.length) return interaction.editReply({ content: '❌ No valid accounts found in the file.' });

    const total = await addStock(tier, lines);

    await interaction.editReply({ content: `✅ Added **${lines.length}** accounts to **${tier}** tier. Total: **${total}**` });

    await sendLog(interaction.client, {
      color: LogColors.info,
      title: '📦 Stock Added',
      description: `**${interaction.user.tag}** added **${lines.length}** accounts to **${tier}**`,
    });
  }
};

export const stock = {
  data: new SlashCommandBuilder()
    .setName('stock')
    .setDescription('View stock counts'),

  async execute(interaction) {
    await interaction.deferReply();
    const counts = await getAllStockCounts();

    const embed = new EmbedBuilder()
      .setColor(0x5865F2)
      .setTitle('📦 Current Stock')
      .addFields(
        { name: '🟢 Free', value: `**${counts.free}** accounts`, inline: true },
        { name: '🔵 Premium', value: `**${counts.premium}** accounts`, inline: true },
        { name: '🟣 Booster', value: `**${counts.booster}** accounts`, inline: true },
        { name: '🔴 Extreme', value: `**${counts.extreme}** accounts`, inline: true },
      )
      .setFooter({ text: 'Raizen Gen • Stock' })
      .setTimestamp();

    await interaction.editReply({ embeds: [embed] });
  }
};

export const rall = {
  data: new SlashCommandBuilder()
    .setName('rall')
    .setDescription('Clear all stock from a tier (Mega Droper+)')
    .addStringOption(o => o.setName('tier').setDescription('Tier to clear').setRequired(true)
      .addChoices(
        { name: 'Free', value: 'free' },
        { name: 'Premium', value: 'premium' },
        { name: 'Booster', value: 'booster' },
        { name: 'Extreme', value: 'extreme' },
        { name: 'ALL', value: 'all' },
      )),

  async execute(interaction) {
    if (!isMegaDroper(interaction.member)) return interaction.reply({ content: '❌ Mega Droper+ only.', ephemeral: true });
    const tier = interaction.options.getString('tier');
    await interaction.deferReply({ ephemeral: true });

    const tiersToWipe = tier === 'all' ? TIERS : [tier];
    for (const t of tiersToWipe) {
      await writeFileContent(`stock/${t}.txt`, '', `Clear ${t} stock`);
    }

    await interaction.editReply({ content: `✅ Cleared stock for: **${tiersToWipe.join(', ')}**` });
    await sendLog(interaction.client, {
      color: LogColors.warn,
      title: '🗑️ Stock Cleared',
      description: `**${interaction.user.tag}** cleared stock for: **${tiersToWipe.join(', ')}**`,
    });
  }
};

export const backup = {
  data: new SlashCommandBuilder()
    .setName('backup')
    .setDescription('Create a server backup (Admin only)'),

  async execute(interaction) {
    if (!isAdmin(interaction.member)) return interaction.reply({ content: '❌ Admin only.', ephemeral: true });
    await interaction.deferReply({ ephemeral: true });

    const { createBackup } = await import('../../utils/github.js');
    const bk = await createBackup(interaction.guild);

    const json = JSON.stringify(bk, null, 2);
    const attachment = new AttachmentBuilder(Buffer.from(json), { name: `backup_${Date.now()}.json` });

    await interaction.editReply({ content: '✅ Backup created and saved to GitHub.', files: [attachment] });
    await sendLog(interaction.client, {
      color: LogColors.info,
      title: '💾 Backup Created',
      description: `**${interaction.user.tag}** created a server backup.`,
    });
  }
};
