import {
  EmbedBuilder, ButtonBuilder,
  ButtonStyle, ActionRowBuilder
} from 'discord.js';
import { isAdmin } from '../../utils/permissions.js';
import { saveGiveaway, deleteGiveaway, getGiveaways } from '../../utils/github.js';
import { sendLog, LogColors } from '../../utils/logger.js';

export const name = 'giveaway';

export async function execute(message, args) {
  if (!isAdmin(message.member)) {
    return message.reply('❌ Admin only.');
  }

  const sub = args[0];
  if (!sub) {
    return message.reply('❌ Usage: `!giveaway <create|end|reroll> [args]`');
  }

  if (sub === 'create') {
    const prize = args.slice(1, -2).join(' ');
    const duration = parseInt(args[args.length - 2]);
    const winners = parseInt(args[args.length - 1]) || 1;

    if (!prize || !duration) {
      return message.reply('❌ Usage: `!giveaway create <prize> <duration_min> [winners]`');
    }

    const endsAt = Date.now() + duration * 60 * 1000;

    const embed = new EmbedBuilder()
      .setColor(0xFEE75C)
      .setTitle('🎉 GIVEAWAY')
      .setDescription(`**Prize:** ${prize}\n\n**Winners:** ${winners}\n**Ends:** <t:${Math.floor(endsAt / 1000)}:R>\n\nClick the button below to enter!`)
      .setFooter({ text: `Hosted by ${message.author.tag}` })
      .setTimestamp(endsAt);

    const btn = new ButtonBuilder()
      .setCustomId('giveaway_enter')
      .setLabel('🎉 Enter')
      .setStyle(ButtonStyle.Primary);

    const row = new ActionRowBuilder().addComponents(btn);
    const msg = await message.channel.send({ embeds: [embed], components: [row] });

    await saveGiveaway({
      messageId: msg.id,
      channelId: message.channel.id,
      prize,
      winners,
      endsAt,
      entries: [],
      ended: false,
      hostId: message.author.id,
    });

    // Auto-end
    setTimeout(() => endGiveaway(message.client, msg.id, message.channel.id), duration * 60 * 1000);

    await sendLog(message.client, {
      color: LogColors.info,
      title: '🎉 Giveaway Started',
      description: `**${prize}** — ${winners} winner(s) — ends <t:${Math.floor(endsAt / 1000)}:R>`,
    });

    await message.reply('✅ Giveaway created!');
  }

  if (sub === 'end') {
    const msgId = args[1];
    if (!msgId) return message.reply('❌ Usage: `!giveaway end <message_id>`');
    await endGiveaway(message.client, msgId, message.channel.id);
    await message.reply('✅ Giveaway ended.');
  }

  if (sub === 'reroll') {
    const msgId = args[1];
    if (!msgId) return message.reply('❌ Usage: `!giveaway reroll <message_id>`');
    const giveaways = await getGiveaways();
    const g = giveaways[msgId];
    if (!g || !g.ended) return message.reply('❌ Giveaway not found or not ended.');
    const newWinners = pickWinners(g.entries, g.winners);
    const channel = message.guild.channels.cache.get(g.channelId || message.channel.id);
    if (channel) {
      await channel.send({ content: `🎉 **Reroll!** New winner(s): ${newWinners.map(id => `<@${id}>`).join(', ')} — Prize: **${g.prize}**` });
    }
    await message.reply('✅ Rerolled.');
  }
}

function pickWinners(entries, count) {
  const shuffled = [...entries].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

export async function endGiveaway(client, messageId, channelId) {
  const giveaways = await getGiveaways();
  const g = giveaways[messageId];
  if (!g || g.ended) return;

  g.ended = true;
  await saveGiveaway(g);

  const guild = client.guilds.cache.get(process.env.GUILD_ID);
  if (!guild) return;
  const channel = guild.channels.cache.get(channelId || g.channelId);
  if (!channel) return;

  const msg = await channel.messages.fetch(messageId).catch(() => null);
  if (!msg) return;

  const winners = pickWinners(g.entries, g.winners);

  const embed = new EmbedBuilder()
    .setColor(winners.length ? 0x57F287 : 0xED4245)
    .setTitle('🎉 GIVEAWAY ENDED')
    .setDescription(winners.length
      ? `**Prize:** ${g.prize}\n**Winner(s):** ${winners.map(id => `<@${id}>`).join(', ')}`
      : `**Prize:** ${g.prize}\n\nNo valid entries.`)
    .setFooter({ text: `Hosted by ${g.hostId}` })
    .setTimestamp();

  await msg.edit({ embeds: [embed], components: [] });

  if (winners.length) {
    await channel.send({ content: `🎉 Congratulations ${winners.map(id => `<@${id}>`).join(', ')}! You won **${g.prize}**!` });
  }
}

export async function restoreGiveaways(client) {
  const giveaways = await getGiveaways();
  const now = Date.now();
  for (const [msgId, g] of Object.entries(giveaways)) {
    if (g.ended) continue;
    const remaining = g.endsAt - now;
    if (remaining <= 0) {
      await endGiveaway(client, msgId, g.channelId);
    } else {
      setTimeout(() => endGiveaway(client, msgId, g.channelId), remaining);
    }
  }
}
