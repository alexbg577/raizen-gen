import { EmbedBuilder } from 'discord.js';
import { isAdmin } from '../../utils/permissions.js';
import { addVouch, removeVouch, getUserVouches, canVouch } from '../../utils/github.js';
import { config } from '../../../shared/config.js';
import { sendLog, LogColors } from '../../utils/logger.js';

export const name = 'vouch';

export async function execute(message, args) {
  const target = message.mentions.users.first();
  if (!target) {
    return message.reply('❌ Usage: `!vouch @user [amount]`');
  }

  const amount = parseInt(args[1]) || 1;
  const giver = message.author;
  const admin = isAdmin(message.member);

  if (target.id === giver.id && !admin) {
    return message.reply('❌ You cannot vouch yourself.');
  }

  if (amount > 1 && !admin) {
    return message.reply('❌ Only admins can add more than 1 vouch at a time.');
  }

  if (!admin) {
    const ok = await canVouch(giver.id, target.id);
    if (!ok) {
      return message.reply('❌ You already vouched this person in the last hour.');
    }
  }

  const updated = await addVouch(target.id, giver.id, admin);
  const targetVouches = updated[target.id]?.count || 0;

  // Check promotion thresholds
  const guild = message.guild;
  const member = await guild.members.fetch(target.id).catch(() => null);
  let promoted = null;

  if (member) {
    const { trainedMod, megaDroper, admin: adminThresh } = config.vouchThresholds;
    if (targetVouches >= adminThresh && !member.roles.cache.has(config.roles.admin)) {
      await member.roles.add(config.roles.admin).catch(() => {});
      promoted = 'Admin';
    } else if (targetVouches >= megaDroper && !member.roles.cache.has(config.roles.megaDroper)) {
      await member.roles.add(config.roles.megaDroper).catch(() => {});
      promoted = 'Mega Droper';
    } else if (targetVouches >= trainedMod && !member.roles.cache.has(config.roles.trainedMod)) {
      await member.roles.add(config.roles.trainedMod).catch(() => {});
      promoted = 'Trained Mod';
    }
  }

  const embed = new EmbedBuilder()
    .setColor(0x57F287)
    .setTitle('✅ Vouch Added')
    .setDescription(`${giver} vouched for ${target}!`)
    .addFields(
      { name: 'Total Vouches', value: `**${targetVouches}**`, inline: true },
      { name: 'Given by', value: `${giver}`, inline: true },
    )
    .setThumbnail(target.displayAvatarURL())
    .setTimestamp();

  if (promoted) {
    embed.addFields({ name: '🎉 Promoted!', value: `${target} has been promoted to **${promoted}**!`, inline: false });
  }

  await message.reply({ embeds: [embed] });

  await sendLog(message.client, {
    color: LogColors.info,
    title: '⭐ Vouch Added',
    description: `**${giver.tag}** vouched for **${target.tag}** (now **${targetVouches}** vouches)${promoted ? `\n🎉 Promoted to **${promoted}**` : ''}`,
  });
}
