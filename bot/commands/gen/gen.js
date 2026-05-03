import {
  EmbedBuilder, ButtonBuilder,
  ButtonStyle, ActionRowBuilder, ChannelType, PermissionFlagsBits
} from 'discord.js';
import { config } from '../../../shared/config.js';
import { canGenInChannel, getTierFromChannel, isStaff } from '../../utils/permissions.js';
import { popAccount, createTicket, getStockCount } from '../../utils/github.js';
import { sendLog, LogColors } from '../../utils/logger.js';

export const name = 'gen';

export async function execute(message, args) {
  const member = message.member;
  const channelId = message.channel.id;
  const service = args[0];
  const tier = getTierFromChannel(channelId);

  if (!service) {
    return message.reply('❌ Usage: `!gen <service>` (ex: `!gen Netflix`)');
  }

  if (!tier) {
    return message.reply('❌ Use this command in a gen channel.');
  }

  if (!canGenInChannel(member, channelId)) {
    return message.reply('❌ You don\'t have the required role to gen in this channel.');
  }

  const count = await getStockCount(tier);
  if (count === 0) {
    return message.reply(`❌ No **${service}** accounts in stock for **${tier}** tier. Try again later.`);
  }

  // Create ticket channel
  const guild = message.guild;
  const category = message.channel.parent;

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

  await message.reply(`✅ Your ticket has been created: ${ticketChannel}`);

  await sendLog(message.client, {
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
