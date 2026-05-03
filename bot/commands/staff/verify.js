import { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } from 'discord.js';
import { isFounder } from '../../utils/permissions.js';

export const data = new SlashCommandBuilder()
  .setName('verify')
  .setDescription('Send verification panel (Founder only)')
  .addUserOption(o => o.setName('user').setDescription('Member to verify').setRequired(false));

export async function execute(interaction) {
  if (!isFounder(interaction.member)) {
    return interaction.reply({ content: '❌ Only Founders can use this command.', ephemeral: true });
  }

  const target = interaction.options.getUser('user');

  const embed = new EmbedBuilder()
    .setColor(0x5865F2)
    .setTitle('🔐 Verification Required')
    .setDescription(`**Welcome to the server!**\n\nTo gain access, you need to pass a quick verification.\n\nClick the button below and answer the question to get verified.`)
    .setFooter({ text: 'Raizen Gen • Verification System' })
    .setTimestamp();

  const btn = new ButtonBuilder()
    .setCustomId('start_verify')
    .setLabel('✅ Start Verification')
    .setStyle(ButtonStyle.Primary);

  const row = new ActionRowBuilder().addComponents(btn);

  const content = target ? `${target}` : null;
  await interaction.reply({ content, embeds: [embed], components: [row] });
}
