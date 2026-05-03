import { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } from 'discord.js';
import { isMod, isAdmin } from '../../utils/permissions.js';
import { sendLog, LogColors } from '../../utils/logger.js';

export const ban = {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Ban a member')
    .addUserOption(o => o.setName('user').setDescription('User to ban').setRequired(true))
    .addStringOption(o => o.setName('reason').setDescription('Reason').setRequired(false)),
  async execute(interaction) {
    if (!isMod(interaction.member)) return interaction.reply({ content: '❌ No permission.', ephemeral: true });
    const target = interaction.options.getMember('user');
    const reason = interaction.options.getString('reason') || 'No reason provided';
    if (!target) return interaction.reply({ content: '❌ User not found.', ephemeral: true });
    await target.ban({ reason });
    const embed = new EmbedBuilder().setColor(0xED4245).setTitle('🔨 Member Banned')
      .setDescription(`**${target.user.tag}** has been banned.\n**Reason:** ${reason}`)
      .setTimestamp();
    await interaction.reply({ embeds: [embed] });
    await sendLog(interaction.client, { color: LogColors.mod, title: '🔨 Ban', description: `**${target.user.tag}** was banned by **${interaction.user.tag}**\nReason: ${reason}` });
  }
};

export const kick = {
  data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Kick a member')
    .addUserOption(o => o.setName('user').setDescription('User to kick').setRequired(true))
    .addStringOption(o => o.setName('reason').setDescription('Reason').setRequired(false)),
  async execute(interaction) {
    if (!isMod(interaction.member)) return interaction.reply({ content: '❌ No permission.', ephemeral: true });
    const target = interaction.options.getMember('user');
    const reason = interaction.options.getString('reason') || 'No reason provided';
    if (!target) return interaction.reply({ content: '❌ User not found.', ephemeral: true });
    await target.kick(reason);
    const embed = new EmbedBuilder().setColor(0xFEE75C).setTitle('👟 Member Kicked')
      .setDescription(`**${target.user.tag}** has been kicked.\n**Reason:** ${reason}`).setTimestamp();
    await interaction.reply({ embeds: [embed] });
    await sendLog(interaction.client, { color: LogColors.mod, title: '👟 Kick', description: `**${target.user.tag}** was kicked by **${interaction.user.tag}**\nReason: ${reason}` });
  }
};

export const mute = {
  data: new SlashCommandBuilder()
    .setName('mute')
    .setDescription('Timeout a member')
    .addUserOption(o => o.setName('user').setDescription('User').setRequired(true))
    .addIntegerOption(o => o.setName('duration').setDescription('Duration in minutes').setRequired(true))
    .addStringOption(o => o.setName('reason').setDescription('Reason').setRequired(false)),
  async execute(interaction) {
    if (!isMod(interaction.member)) return interaction.reply({ content: '❌ No permission.', ephemeral: true });
    const target = interaction.options.getMember('user');
    const duration = interaction.options.getInteger('duration');
    const reason = interaction.options.getString('reason') || 'No reason provided';
    await target.timeout(duration * 60 * 1000, reason);
    const embed = new EmbedBuilder().setColor(0xFEE75C).setTitle('🔇 Member Muted')
      .setDescription(`**${target.user.tag}** muted for **${duration}min**.\n**Reason:** ${reason}`).setTimestamp();
    await interaction.reply({ embeds: [embed] });
    await sendLog(interaction.client, { color: LogColors.mod, title: '🔇 Mute', description: `**${target.user.tag}** muted ${duration}min by **${interaction.user.tag}**` });
  }
};

export const unmute = {
  data: new SlashCommandBuilder()
    .setName('unmute')
    .setDescription('Remove timeout from a member')
    .addUserOption(o => o.setName('user').setDescription('User').setRequired(true)),
  async execute(interaction) {
    if (!isMod(interaction.member)) return interaction.reply({ content: '❌ No permission.', ephemeral: true });
    const target = interaction.options.getMember('user');
    await target.timeout(null);
    await interaction.reply({ content: `✅ ${target} has been unmuted.` });
  }
};

export const warn = {
  data: new SlashCommandBuilder()
    .setName('warn')
    .setDescription('Warn a member')
    .addUserOption(o => o.setName('user').setDescription('User').setRequired(true))
    .addStringOption(o => o.setName('reason').setDescription('Reason').setRequired(true)),
  async execute(interaction) {
    if (!isMod(interaction.member)) return interaction.reply({ content: '❌ No permission.', ephemeral: true });
    const target = interaction.options.getUser('user');
    const reason = interaction.options.getString('reason');
    const embed = new EmbedBuilder().setColor(0xFEE75C).setTitle('⚠️ Warning Issued')
      .setDescription(`${target} has been warned.\n**Reason:** ${reason}`).setTimestamp();
    await interaction.reply({ embeds: [embed] });
    await sendLog(interaction.client, { color: LogColors.warn, title: '⚠️ Warn', description: `**${target.tag}** warned by **${interaction.user.tag}**\nReason: ${reason}` });
  }
};

export const purge = {
  data: new SlashCommandBuilder()
    .setName('purge')
    .setDescription('Delete messages')
    .addIntegerOption(o => o.setName('amount').setDescription('Number of messages (1-100)').setRequired(true).setMinValue(1).setMaxValue(100)),
  async execute(interaction) {
    if (!isMod(interaction.member)) return interaction.reply({ content: '❌ No permission.', ephemeral: true });
    const amount = interaction.options.getInteger('amount');
    await interaction.channel.bulkDelete(amount, true);
    await interaction.reply({ content: `✅ Deleted **${amount}** messages.`, ephemeral: true });
  }
};

export const announcement = {
  data: new SlashCommandBuilder()
    .setName('announcement')
    .setDescription('Send an announcement')
    .addStringOption(o => o.setName('message').setDescription('Announcement content').setRequired(true))
    .addChannelOption(o => o.setName('channel').setDescription('Target channel').setRequired(false)),
  async execute(interaction) {
    if (!isAdmin(interaction.member)) return interaction.reply({ content: '❌ Admin only.', ephemeral: true });
    const message = interaction.options.getString('message');
    const channel = interaction.options.getChannel('channel') || interaction.channel;
    const embed = new EmbedBuilder()
      .setColor(0x5865F2)
      .setTitle('📢 Announcement')
      .setDescription(message)
      .setFooter({ text: `Announced by ${interaction.user.tag}` })
      .setTimestamp();
    await channel.send({ content: '@everyone', embeds: [embed] });
    await interaction.reply({ content: `✅ Announcement sent to ${channel}.`, ephemeral: true });
  }
};

export const close = {
  data: new SlashCommandBuilder()
    .setName('close')
    .setDescription('Close a ticket channel')
    .addStringOption(o => o.setName('reason').setDescription('Reason').setRequired(false)),
  async execute(interaction) {
    if (!isMod(interaction.member)) return interaction.reply({ content: '❌ No permission.', ephemeral: true });
    const reason = interaction.options.getString('reason') || 'Closed by staff';
    await interaction.reply({ content: `🔒 Closing ticket: **${reason}**` });
    await sendLog(interaction.client, { color: LogColors.ticket, title: '🔒 Ticket Closed', description: `**${interaction.channel.name}** closed by **${interaction.user.tag}**\nReason: ${reason}` });
    setTimeout(() => interaction.channel.delete().catch(() => {}), 3000);
  }
};
