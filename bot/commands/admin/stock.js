import { EmbedBuilder, AttachmentBuilder } from 'discord.js';
import { isAdmin, isMegaDroper, isStaff } from '../../utils/permissions.js';
import { addStock, getStockCount, getAllStockCounts, getStock, writeFileContent } from '../../utils/github.js';
import { sendLog, LogColors } from '../../utils/logger.js';
import AdmZip from 'adm-zip';
import { config, TIERS } from '../../../shared/config.js';

export const addstockName = 'addstock';
export async function addstockExec(message, args) {
  if (!isStaff(message.member)) return message.reply('❌ Staff only.');
  const tier = args[0];
  const service = args[1] || 'Unknown';
  if (!tier || !['free', 'premium', 'booster', 'extreme'].includes(tier)) {
    return message.reply('❌ Usage: `!addstock <tier> [service]` (attach a .txt or .zip file)');
  }

  const attachment = message.attachments.first();
  if (!attachment) {
    return message.reply('❌ You must attach a .txt or .zip file to the message.');
  }

  const url = attachment.url;
  const filename = attachment.name.toLowerCase();

  const response = await fetch(url);
  const buffer = Buffer.from(await response.arrayBuffer());

  let lines = [];

  if (filename.endsWith('.zip')) {
    const zip = new AdmZip(buffer);
    const entries = zip.getEntries();
    for (const entry of entries) {
      if (entry.name.endsWith('.txt')) {
        const content = entry.getData().toString('utf-8');
        lines.push(...content.split('\n').map(l => l.trim()).filter(Boolean));
      }
    }
  } else if (filename.endsWith('.txt')) {
    lines = buffer.toString('utf-8').split('\n').map(l => l.trim()).filter(Boolean);
  } else {
    return message.reply('❌ Only .txt or .zip files are accepted.');
  }

  if (!lines.length) return message.reply('❌ No valid accounts found in the file.');

  // Add service to each account (format: email:pass:service)
  const linesWithService = lines.map(line => {
    if (line.split(':').length >= 3) return line; // already has service
    return `${line}:${service}`;
  });

  const total = await addStock(tier, linesWithService);

  await message.reply(`✅ Added **${lines.length}** accounts to **${tier}** tier (service: ${service}). Total: **${total}**`);

  await sendLog(message.client, {
    color: LogColors.info,
    title: '📦 Stock Added',
    description: `**${message.author.tag}** added **${lines.length}** accounts to **${tier}** (${service})`,
  });
}

export const stockName = 'stock';
export async function stockExec(message, args) {
  const counts = await getAllStockCounts();

  // Get services for each tier
  const tiers = ['free', 'premium', 'booster', 'extreme'];
  const fields = [];

  for (const tier of tiers) {
    const accounts = await getStock(tier);
    let serviceList = 'No accounts';
    if (accounts.length > 0) {
      const services = {};
      for (const acc of accounts) {
        const parts = acc.split(':');
        let service = 'Unknown';
        if (parts.length >= 3) service = parts[2];
        services[service] = (services[service] || 0) + 1;
      }
      serviceList = Object.entries(services).map(([s, c]) => `**${s}**: ${c}`).join('\n');
    }
    fields.push({
      name: `${tier.charAt(0).toUpperCase() + tier.slice(1)} (${counts[tier]})`,
      value: serviceList,
      inline: false
    });
  }

  const embed = new EmbedBuilder()
    .setColor(0x5865F2)
    .setTitle('📦 Raizen Gen Stock Inventory')
    .setDescription(`📊 **Total Accounts:** ${Object.values(counts).reduce((a, b) => a + b, 0)}\n\nHere are all available services by tier:`)
    .addFields(fields)
    .setThumbnail('https://i.imgur.com/8xZq3eE.png') // Raizen Gen logo
    .setFooter({ text: 'Raizen Gen • Stock System', iconURL: 'https://i.imgur.com/8xZq3eE.png' })
    .setTimestamp()
    .setImage('https://i.imgur.com/8xZq3eE.png'); // Optional banner

  await message.reply({ embeds: [embed] });
}

export const rallName = 'rall';
export async function rallExec(message, args) {
  if (!isMegaDroper(message.member)) return message.reply('❌ Mega Droper+ only.');
  const tier = args[0];
  if (!tier || !['free', 'premium', 'booster', 'extreme', 'all'].includes(tier)) {
    return message.reply('❌ Usage: `!rall <tier>` (tier: free, premium, booster, extreme, all)');
  }

  const tiersToWipe = tier === 'all' ? TIERS : [tier];
  for (const t of tiersToWipe) {
    await writeFileContent(`stock/${t}.txt`, '', `Clear ${t} stock`);
  }

  await message.reply(`✅ Cleared stock for: **${tiersToWipe.join(', ')}**`);
  await sendLog(message.client, {
    color: LogColors.warn,
    title: '🗑️ Stock Cleared',
    description: `**${message.author.tag}** cleared stock for: **${tiersToWipe.join(', ')}**`,
  });
}

export const backupName = 'backup';
export async function backupExec(message, args) {
  if (!isAdmin(message.member)) return message.reply('❌ Admin only.');

  const { createBackup } = await import('../../utils/github.js');
  const bk = await createBackup(message.guild);

  const json = JSON.stringify(bk, null, 2);
  const attachment = new AttachmentBuilder(Buffer.from(json), { name: `backup_${Date.now()}.json` });

  await message.reply({ content: '✅ Backup created and saved to GitHub.', files: [attachment] });
  await sendLog(message.client, {
    color: LogColors.info,
    title: '💾 Backup Created',
    description: `**${message.author.tag}** created a server backup.`,
  });
}
