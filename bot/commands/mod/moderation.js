import { EmbedBuilder } from 'discord.js';
import { isMod, isAdmin } from '../../utils/permissions.js';
import { sendLog, LogColors } from '../../utils/logger.js';

export const banName = 'ban';
export async function banExec(message, args) {
  if (!isMod(message.member)) return message.reply('❌ No permission.');
  const target = message.mentions.members.first();
  if (!target) return message.reply('❌ Usage: `!ban @user [reason]`');
  const reason = args.slice(1).join(' ') || 'No reason provided';
  await target.ban({ reason });
  const embed = new EmbedBuilder().setColor(0xED4245).setTitle('🔨 Member Banned')
    .setDescription(`**${target.user.tag}** has been banned.\n**Reason:** ${reason}`)
    .setTimestamp();
  await message.reply({ embeds: [embed] });
  await sendLog(message.client, { color: LogColors.mod, title: '🔨 Ban', description: `**${target.user.tag}** was banned by **${message.author.tag}**\nReason: ${reason}` });
}

export const kickName = 'kick';
export async function kickExec(message, args) {
  if (!isMod(message.member)) return message.reply('❌ No permission.');
  const target = message.mentions.members.first();
  if (!target) return message.reply('❌ Usage: `!kick @user [reason]`');
  const reason = args.slice(1).join(' ') || 'No reason provided';
  await target.kick(reason);
  const embed = new EmbedBuilder().setColor(0xFEE75C).setTitle('👟 Member Kicked')
    .setDescription(`**${target.user.tag}** has been kicked.\n**Reason:** ${reason}`).setTimestamp();
  await message.reply({ embeds: [embed] });
  await sendLog(message.client, { color: LogColors.mod, title: '👟 Kick', description: `**${target.user.tag}** was kicked by **${message.author.tag}**\nReason: ${reason}` });
}

export const muteName = 'mute';
export async function muteExec(message, args) {
  if (!isMod(message.member)) return message.reply('❌ No permission.');
  const target = message.mentions.members.first();
  if (!target) return message.reply('❌ Usage: `!mute @user <duration_min> [reason]`');
  const duration = parseInt(args[1]) || 5;
  const reason = args.slice(2).join(' ') || 'No reason provided';
  await target.timeout(duration * 60 * 1000, reason);
  const embed = new EmbedBuilder().setColor(0xFEE75C).setTitle('🔇 Member Muted')
    .setDescription(`**${target.user.tag}** muted for **${duration}min**.\n**Reason:** ${reason}`).setTimestamp();
  await message.reply({ embeds: [embed] });
  await sendLog(message.client, { color: LogColors.mod, title: '🔇 Mute', description: `**${target.user.tag}** muted ${duration}min by **${message.author.tag}**` });
}

export const unmuteName = 'unmute';
export async function unmuteExec(message, args) {
  if (!isMod(message.member)) return message.reply('❌ No permission.');
  const target = message.mentions.members.first();
  if (!target) return message.reply('❌ Usage: `!unmute @user`');
  await target.timeout(null);
  await message.reply(`✅ ${target} has been unmuted.`);
}

export const warnName = 'warn';
export async function warnExec(message, args) {
  if (!isMod(message.member)) return message.reply('❌ No permission.');
  const target = message.mentions.users.first();
  if (!target) return message.reply('❌ Usage: `!warn @user <reason>`');
  const reason = args.slice(1).join(' ');
  if (!reason) return message.reply('❌ Usage: `!warn @user <reason>`');
  const embed = new EmbedBuilder().setColor(0xFEE75C).setTitle('⚠️ Warning Issued')
    .setDescription(`${target} has been warned.\n**Reason:** ${reason}`).setTimestamp();
  await message.reply({ embeds: [embed] });
  await sendLog(message.client, { color: LogColors.warn, title: '⚠️ Warn', description: `**${target.tag}** warned by **${message.author.tag}**\nReason: ${reason}` });
}

export const purgeName = 'purge';
export async function purgeExec(message, args) {
  if (!isMod(message.member)) return message.reply('❌ No permission.');
  const amount = parseInt(args[0]);
  if (!amount || amount < 1 || amount > 100) return message.reply('❌ Usage: `!purge <amount>` (1-100)');
  const deleted = await message.channel.bulkDelete(amount, true);
  const reply = await message.reply(`✅ Deleted **${deleted.size}** messages.`);
  setTimeout(() => reply.delete().catch(() => {}), 3000);
}

export const announcementName = 'announcement';
export async function announcementExec(message, args) {
  if (!isAdmin(message.member)) return message.reply('❌ Admin only.');
  const announcementMessage = args.join(' ');
  if (!announcementMessage) return message.reply('❌ Usage: `!announcement <message>`');
  const embed = new EmbedBuilder()
    .setColor(0x5865F2)
    .setTitle('📢 Announcement')
    .setDescription(announcementMessage)
    .setFooter({ text: `Announced by ${message.author.tag}` })
    .setTimestamp();
  await message.channel.send({ content: '@everyone', embeds: [embed] });
  await message.reply(`✅ Announcement sent.`);
}

export const closeName = 'close';
export async function closeExec(message, args) {
  if (!isMod(message.member)) return message.reply('❌ No permission.');
  const reason = args.join(' ') || 'Closed by staff';
  await message.reply(`🔒 Closing ticket: **${reason}**`);
  await sendLog(message.client, { color: LogColors.ticket, title: '🔒 Ticket Closed', description: `**${message.channel.name}** closed by **${message.author.tag}**\nReason: ${reason}` });
  setTimeout(() => message.channel.delete().catch(() => {}), 3000);
}
