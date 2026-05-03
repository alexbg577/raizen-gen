import { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } from 'discord.js';
import { isFounder } from '../../utils/permissions.js';

export const name = 'verify';

export async function execute(message, args) {
  if (!isFounder(message.member)) {
    return message.reply('❌ Only Founders can use this command.');
  }

  const target = message.mentions.users.first();

  const embed = new EmbedBuilder()
    .setColor(0x5865F2)
    .setTitle('🔐 Verification Required')
    .setDescription(`**Welcome to the server!**\n\nTo gain access, you need to pass a quick verification.\n\nClick the button below and answer the question to get verified.`)
    .setFooter({ text: 'Raizen Gen • Verification System' })
    .setTimestamp();

  const btn = new ButtonBuilder()
    .setCustomId('start_verify')
    .setLabel('✅ Start Verification')
    .setStyle(ButtonStyle.Primary);

  const row = new ActionRowBuilder().addComponents(btn);

  const content = target ? `${target}` : null;
  await message.reply({ content, embeds: [embed], components: [row] });
}
