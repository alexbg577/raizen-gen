import { EmbedBuilder } from 'discord.js';
import { config } from '../../shared/config.js';

export async function sendLog(client, options) {
  try {
    const guild = client.guilds.cache.get(config.guildId);
    if (!guild) return;
    const channel = guild.channels.cache.get(config.channels.log);
    if (!channel) return;

    const embed = new EmbedBuilder()
      .setColor(options.color || 0x5865F2)
      .setTitle(options.title || 'Log')
      .setDescription(options.description || '')
      .setTimestamp();

    if (options.fields) embed.addFields(options.fields);
    if (options.footer) embed.setFooter({ text: options.footer });
    if (options.thumbnail) embed.setThumbnail(options.thumbnail);

    await channel.send({ embeds: [embed] });
  } catch (e) {
    console.error('Log error:', e);
  }
}

export const LogColors = {
  join: 0x57F287,
  leave: 0xED4245,
  ticket: 0xFEE75C,
  gen: 0x5865F2,
  mod: 0xEB459E,
  info: 0x5865F2,
  warn: 0xFEE75C,
  error: 0xED4245,
};
