import { Octokit } from '@octokit/rest';
import { config } from '../../shared/config.js';

const octokit = new Octokit({ auth: config.github.token });
const { owner, repo } = config.github;

// Cache buster
const bust = () => `?t=${Date.now()}`;

export async function getFileContent(path) {
  try {
    const res = await octokit.repos.getContent({ owner, repo, path, headers: { 'If-None-Match': '' } });
    const content = Buffer.from(res.data.content, 'base64').toString('utf-8');
    return { content, sha: res.data.sha };
  } catch (e) {
    if (e.status === 404) return null;
    throw e;
  }
}

export async function writeFileContent(path, content, message = 'Update') {
  const existing = await getFileContent(path);
  const encoded = Buffer.from(content).toString('base64');
  await octokit.repos.createOrUpdateFileContents({
    owner, repo, path,
    message,
    content: encoded,
    sha: existing?.sha,
  });
}

// Stock paths
const stockPath = (tier) => `stock/${tier}.txt`;
const dataPath = (file) => `data/${file}.json`;

export async function getStock(tier) {
  const res = await getFileContent(stockPath(tier));
  if (!res) return [];
  return res.content.split('\n').map(l => l.trim()).filter(Boolean);
}

export async function addStock(tier, lines) {
  const existing = await getStock(tier);
  const newLines = lines.map(l => l.trim()).filter(Boolean);
  const merged = [...existing, ...newLines];
  await writeFileContent(stockPath(tier), merged.join('\n'), `Add ${newLines.length} accounts to ${tier}`);
  return merged.length;
}

export async function popAccount(tier) {
  const accounts = await getStock(tier);
  if (!accounts.length) return null;
  const account = accounts.shift();
  await writeFileContent(stockPath(tier), accounts.join('\n'), `Pop account from ${tier}`);
  return account;
}

export async function getStockCount(tier) {
  const accounts = await getStock(tier);
  return accounts.length;
}

export async function getAllStockCounts() {
  const tiers = ['free', 'premium', 'booster', 'extreme'];
  const counts = {};
  for (const tier of tiers) {
    counts[tier] = await getStockCount(tier);
  }
  return counts;
}

// Data (vouches, giveaways, config, etc.)
export async function getData(file) {
  const res = await getFileContent(dataPath(file));
  if (!res) return {};
  try { return JSON.parse(res.content); } catch { return {}; }
}

export async function setData(file, data) {
  await writeFileContent(dataPath(file), JSON.stringify(data, null, 2), `Update ${file}`);
}

export async function updateData(file, updater) {
  const current = await getData(file);
  const updated = updater(current);
  await setData(file, updated);
  return updated;
}

// Vouches
export async function getVouches() {
  return await getData('vouches');
}

export async function getUserVouches(userId) {
  const vouches = await getVouches();
  return vouches[userId] || { count: 0, givenTo: {} };
}

export async function addVouch(targetId, giverId, isAdmin = false) {
  return await updateData('vouches', (data) => {
    if (!data[targetId]) data[targetId] = { count: 0, givenTo: {} };
    if (!data[giverId]) data[giverId] = { count: 0, givenTo: {} };

    data[targetId].count = (data[targetId].count || 0) + 1;

    if (!isAdmin) {
      data[giverId].givenTo = data[giverId].givenTo || {};
      data[giverId].givenTo[targetId] = Date.now();
    }
    return data;
  });
}

export async function removeVouch(targetId, amount = 1) {
  return await updateData('vouches', (data) => {
    if (!data[targetId]) data[targetId] = { count: 0, givenTo: {} };
    data[targetId].count = Math.max(0, (data[targetId].count || 0) - amount);
    return data;
  });
}

export async function canVouch(giverId, targetId) {
  const vouches = await getVouches();
  const giver = vouches[giverId] || { givenTo: {} };
  const lastVouch = giver.givenTo?.[targetId] || 0;
  const oneHour = 60 * 60 * 1000;
  return Date.now() - lastVouch >= oneHour;
}

// Tickets
export async function getTickets() {
  return await getData('tickets');
}

export async function createTicket(ticketData) {
  return await updateData('tickets', (data) => {
    data[ticketData.channelId] = ticketData;
    return data;
  });
}

export async function closeTicket(channelId) {
  return await updateData('tickets', (data) => {
    delete data[channelId];
    return data;
  });
}

export async function getTicket(channelId) {
  const tickets = await getTickets();
  return tickets[channelId] || null;
}

// Giveaways
export async function getGiveaways() {
  return await getData('giveaways');
}

export async function saveGiveaway(giveaway) {
  return await updateData('giveaways', (data) => {
    data[giveaway.messageId] = giveaway;
    return data;
  });
}

export async function deleteGiveaway(messageId) {
  return await updateData('giveaways', (data) => {
    delete data[messageId];
    return data;
  });
}

// Backup
export async function createBackup(guild) {
  const backup = {
    id: guild.id,
    name: guild.name,
    createdAt: new Date().toISOString(),
    memberCount: guild.memberCount,
    roles: guild.roles.cache.map(r => ({ id: r.id, name: r.name, color: r.hexColor, position: r.position })),
    channels: guild.channels.cache.map(c => ({ id: c.id, name: c.name, type: c.type, parentId: c.parentId })),
  };
  const filename = `backup_${Date.now()}`;
  await writeFileContent(`backups/${filename}.json`, JSON.stringify(backup, null, 2), `Backup ${new Date().toISOString()}`);
  return backup;
}
