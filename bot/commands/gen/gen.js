import {
  SlashCommandBuilder, EmbedBuilder, ButtonBuilder,
  ButtonStyle, ActionRowBuilder, ChannelType, PermissionFlagsBits
} from 'discord.js';
import { config } from '../../../shared/config.js';
import { canGenInChannel, getTierFromChannel, isStaff } from '../../utils/permissions.js';
import { popAccount, createTicket, getStockCount } from '../../utils/github.js';
import { sendLog, LogColors } from '../../utils/logger.js';

export const data = new SlashCommandBuilder()
  .setName('gen')
  .setDescription('Generate an account')
  .addStringOption(o => o.setName('service').setDescription('Service name (ex: Netflix)').setRequired(true));

export async function execute(interaction) {
  const member = interaction.member;
  const channelId = interaction.channelId;
  const service = interaction.options.getString('service');
  const tier = getTierFromChannel(channelId);

  if (!tier) {
    return interaction.reply({ content: '❌ Use this command in a gen channel.', ephemeral: true });
  }

  if (!canGenInChannel(member, channelId)) {
    return interaction.reply({ content: `❌ You don't have the required role to gen in this channel.`, ephemeral: true });
  }

  const count = await getStockCount(tier);
  if (count === 0) {
    return interaction.reply({ content: `❌ No **${service}** accounts in stock for **${tier}** tier. Try again later.`, ephemeral: true });
  }

  await interaction.deferReply({ ephemeral: true });

  // Create ticket channel
  const guild = interaction.guild;
  const category = interaction.channel.parent;

  const ticketChannel = await guild.channels.create({
    name: `ticket-${member.user.username}-${service.toLowerCase()}`,
    type: ChannelType.GuildText,
    parent: category?.id,
    permissionOverwrites: [
      { id: guild.id, deny: [PermissionFlagsBits.ViewChannel] },
      { id: member.id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory] },
      { id: config.roles.staff, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages] },
      { id: config.roles.helper, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages] },
      { id: config.roles.admin, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages] },
      { id: config.roles.founder, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages] },
    ],
  });

  await createTicket({
    channelId: ticketChannel.id,
    userId: member.id,
    service,
    tier,
    staffId: null,
    vouchGiven: false,
    createdAt: Date.now(),
  });

  const embed = new EmbedBuilder()
    .setColor(0x5865F2)
    .setTitle(`🎟️ Gen Ticket — ${service}`)
    .setDescription(`Hey ${member}, a staff member will deliver your **${service}** account shortly.\n\nPlease be patient and do not leave the server.`)
    .addFields(
      { name: 'Service', value: service, inline: true },
      { name: 'Tier', value: tier.charAt(0).toUpperCase() + tier.slice(1), inline: true },
      { name: 'User', value: `${member}`, inline: true }
    )
    .setFooter({ text: 'Raizen Gen • Do not share your credentials' })
    .setTimestamp();

  const deliverBtn = new ButtonBuilder()
    .setCustomId(`deliver_${ticketChannel.id}`)
    .setLabel('✅ Deliver Account')
    .setStyle(ButtonStyle.Success);

  const closeBtn = new ButtonBuilder()
    .setCustomId(`close_ticket_${ticketChannel.id}`)
    .setLabel('🔒 Close Ticket')
    .setStyle(ButtonStyle.Danger);

  const row = new ActionRowBuilder().addComponents(deliverBtn, closeBtn);

  // Ping staff
  const staffPing = `<@&${config.roles.staff}> <@&${config.roles.helper}>`;
  await ticketChannel.send({ content: staffPing, embeds: [embed], components: [row] });

  await interaction.editReply({ content: `✅ Your ticket has been created: ${ticketChannel}` });

  await sendLog(interaction.client, {
    color: LogColors.ticket,
    title: '🎟️ Gen Ticket Opened',
    description: `**${member.user.tag}** opened a gen ticket for **${service}**`,
    fields: [
      { name: 'User', value: `${member}`, inline: true },
      { name: 'Service', value: service, inline: true },
      { name: 'Tier', value: tier, inline: true },
      { name: 'Channel', value: `${ticketChannel}`, inline: true },
    ],
    thumbnail: member.user.displayAvatarURL(),
  });
}
