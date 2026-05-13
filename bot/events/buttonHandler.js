import {
  ModalBuilder, TextInputBuilder, TextInputStyle,
  ActionRowBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle
} from 'discord.js';
import { config } from '../../shared/config.js';
import { popAccount, closeTicket, getTicket, addVouch, saveGiveaway, getGiveaways } from '../utils/github.js';
import { sendLog, LogColors } from '../utils/logger.js';
import { isStaff } from '../utils/permissions.js';

export async function handleButton(interaction) {
  const { customId } = interaction;

  if (customId === 'start_verify') {
    const modal = new ModalBuilder()
      .setCustomId('verify_modal')
      .setTitle('Verification');
    const input = new TextInputBuilder()
      .setCustomId('verify_answer')
      .setLabel('What is 2 + 2?')
      .setStyle(TextInputStyle.Short)
      .setRequired(true)
      .setMinLength(1)
      .setMaxLength(5);
    modal.addComponents(new ActionRowBuilder().addComponents(input));
    return interaction.showModal(modal);
  }

  if (customId === 'giveaway_enter') {
    const msgId = interaction.message.id;
    const giveaways = await getGiveaways();
    const g = giveaways[msgId];
    if (!g || g.ended) return interaction.reply({ content: '❌ This giveaway has ended.', ephemeral: true });
    if (g.entries.includes(interaction.user.id)) {
      return interaction.reply({ content: '✅ You are already entered!', ephemeral: true });
    }
    g.entries.push(interaction.user.id);
    await saveGiveaway(g);
    const embed = EmbedBuilder.from(interaction.message.embeds[0])
      .setFooter({ text: `${g.entries.length} entries • Hosted by ${g.hostId}` });
    await interaction.message.edit({ embeds: [embed] });
    return interaction.reply({ content: '🎉 You have entered the giveaway!', ephemeral: true });
  }

  if (customId.startsWith('deliver_')) {
    const ticketChannelId = customId.replace('deliver_', '');
    if (!isStaff(interaction.member)) {
      return interaction.reply({ content: '❌ Staff only.', ephemeral: true });
    }
    const ticket = await getTicket(ticketChannelId);
    if (!ticket) return interaction.reply({ content: '❌ Ticket not found.', ephemeral: true });
    await interaction.deferReply({ ephemeral: true });
    const account = await popAccount(ticket.tier);
    if (!account) {
      return interaction.editReply({ content: `❌ No accounts left in **${ticket.tier}** stock!` });
    }
    const user = await interaction.client.users.fetch(ticket.userId).catch(() => null);
    const [email, password] = account.includes(':') ? account.split(':') : [account, 'N/A'];
    const accountEmbed = new EmbedBuilder()
      .setColor(0x57F287)
      .setTitle(`✅ Your ${ticket.service} Account`)
      .setDescription(`Here are your credentials for **${ticket.service}**:`)
      .addFields(
        { name: '📧 Email', value: `\`${email}\``, inline: true },
        { name: '🔑 Password', value: `\`${password}\``, inline: true },
      )
      .setFooter({ text: 'Raizen Gen • Do not share these credentials' })
      .setTimestamp();
    if (user) await user.send({ embeds: [accountEmbed] }).catch(() => {});
    const ticketChannel = interaction.guild.channels.cache.get(ticketChannelId);
    if (ticketChannel) await ticketChannel.send({ content: `<@${ticket.userId}> ✅ Account delivered to your DMs! Check your private messages.` });
    const vouchBtn = new ButtonBuilder()
      .setCustomId(`vouch_staff_${interaction.user.id}`)
      .setLabel('⭐ Vouch Staff')
      .setStyle(ButtonStyle.Success);
    const closeBtn = new ButtonBuilder()
      .setCustomId(`close_ticket_${ticketChannelId}`)
      .setLabel('🔒 Close Ticket')
      .setStyle(ButtonStyle.Danger);
    if (ticketChannel) await ticketChannel.send({
      content: `✅ Account delivered by ${interaction.member}! Rate your experience:`,
      components: [new ActionRowBuilder().addComponents(vouchBtn, closeBtn)]
    });
    await closeTicket(ticketChannelId);
    await interaction.editReply({ content: '✅ Account delivered successfully!' });
    await sendLog(interaction.client, {
      color: LogColors.gen,
      title: '✅ Account Delivered',
      description: `**${interaction.user.tag}** delivered **${ticket.service}** to <@${ticket.userId}> (${ticket.tier} tier)`,
    });
    setTimeout(async () => {
      const ch = interaction.guild.channels.cache.get(ticketChannelId);
      if (ch) await ch.delete().catch(() => {});
    }, 30000);
  }

  if (customId.startsWith('vouch_staff_')) {
    const staffId = customId.replace('vouch_staff_', '');
    if (interaction.user.id === staffId) {
      return interaction.reply({ content: '❌ You cannot vouch yourself.', ephemeral: true });
    }
    await addVouch(staffId, interaction.user.id, false);
    await interaction.reply({ content: `⭐ You vouched for <@${staffId}>!`, ephemeral: true });
    await sendLog(interaction.client, {
      color: LogColors.info,
      title: '⭐ Vouch from Ticket',
      description: `**${interaction.user.tag}** vouched for <@${staffId}> via ticket`,
    });
  }

  if (customId.startsWith('close_ticket_')) {
    const ch = interaction.guild.channels.cache.get(customId.replace('close_ticket_', ''));
    await interaction.reply({ content: '🔒 Closing...', ephemeral: true });
    await sendLog(interaction.client, {
      color: LogColors.ticket,
      title: '🔒 Ticket Closed',
      description: `**${interaction.channel?.name || 'ticket'}** closed by **${interaction.user.tag}**`,
    });
    setTimeout(() => ch?.delete().catch(() => {}), 2000);
  }
}

export async function handleModal(interaction) {
  if (interaction.customId === 'verify_modal') {
    const answer = interaction.fields.getTextInputValue('verify_answer').trim();
    if (answer === '4') {
      await interaction.deferReply({ ephemeral: true });
      try {
        const member = await interaction.guild.members.fetch(interaction.user.id);
        await member.roles.add(config.roles.verified);
        await member.roles.remove(config.roles.unverified);
        return interaction.editReply({
          content: '✅ You are now verified! Welcome to **Raizen Gen**.',
        });
      } catch (err) {
        console.error('Verification role error:', err);
        return interaction.editReply({
          content: `❌ Verification failed: ${err.message}. Please contact a staff member.`,
        });
      }
    } else {
      return interaction.reply({ content: '❌ Wrong answer. Try again!', ephemeral: true });
    }
  }
}