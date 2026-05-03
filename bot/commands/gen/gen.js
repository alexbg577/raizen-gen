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
    return message.reply('❌ Utilise cette commande dans un canal de gen.');
  }

  if (!canGenInChannel(member, channelId)) {
    return message.reply('❌ Tu n\'as pas le rôle requis pour gen dans ce canal.');
  }

  const count = await getStockCount(tier);
  if (count === 0) {
    return message.reply(`❌ Pas de comptes **${service}** en stock pour le tier **${tier}**. Réessaie plus tard.`);
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
    .setDescription(`Hey ${member}, un staff va te deliver ton compte **${service}** rapidement.\n\nSois patient et ne quitte pas le serveur.`)
    .addFields(
      { name: 'Service', value: service, inline: true },
      { name: 'Tier', value: tier.charAt(0).toUpperCase() + tier.slice(1), inline: true },
      { name: 'User', value: `${member}`, inline: true }
    )
    .setFooter({ text: 'Raizen Gen • Ne partage pas tes identifiants' })
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

  await message.reply(`✅ Ton ticket a été créé: ${ticketChannel}`);

  await sendLog(message.client, {
    color: LogColors.ticket,
    title: '🎟️ Gen Ticket Opened',
    description: `**${member.user.tag}** a ouvert un ticket de gen pour **${service}**`,
    fields: [
      { name: 'User', value: `${member}`, inline: true },
      { name: 'Service', value: service, inline: true },
      { name: 'Tier', value: tier, inline: true },
      { name: 'Channel', value: `${ticketChannel}`, inline: true },
    ],
    thumbnail: member.user.displayAvatarURL(),
  });
}
