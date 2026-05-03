import { EmbedBuilder } from 'discord.js';
import { config } from '../../shared/config.js';
import { sendLog, LogColors } from '../utils/logger.js';

export async function handleGuildMemberAdd(member) {
  // Give unverified role
  await member.roles.add(config.roles.unverified).catch(() => {});

  await sendLog(member.client, {
    color: LogColors.join,
    title: '✅ Member Joined',
    description: `**${member.user.tag}** joined the server.`,
    fields: [
      { name: 'Account Created', value: `<t:${Math.floor(member.user.createdTimestamp / 1000)}:R>`, inline: true },
      { name: 'Members', value: `${member.guild.memberCount}`, inline: true },
    ],
    thumbnail: member.user.displayAvatarURL(),
  });
}

export async function handleGuildMemberRemove(member) {
  await sendLog(member.client, {
    color: LogColors.leave,
    title: '❌ Member Left',
    description: `**${member.user.tag}** left the server.`,
    fields: [
      { name: 'Roles', value: member.roles.cache.filter(r => r.id !== member.guild.id).map(r => r.name).join(', ') || 'None', inline: false },
    ],
    thumbnail: member.user.displayAvatarURL(),
  });
}

export async function handlePresenceUpdate(oldPresence, newPresence) {
  if (!newPresence?.member) return;
  const member = newPresence.member;
  if (!member || member.user.bot) return;

  const inviteLink = config.inviteLink;
  const basicGenRole = config.roles.basicGen;

  // Check if user has the invite in their status
  const hasInvite = newPresence.activities?.some(a =>
    a.state?.includes(inviteLink) || a.name?.includes(inviteLink)
  );
  const hadInvite = oldPresence?.activities?.some(a =>
    a.state?.includes(inviteLink) || a.name?.includes(inviteLink)
  );

  if (hasInvite && !member.roles.cache.has(basicGenRole)) {
    await member.roles.add(basicGenRole).catch(() => {});
  } else if (!hasInvite && hadInvite && member.roles.cache.has(basicGenRole)) {
    await member.roles.remove(basicGenRole).catch(() => {});
  }
}
