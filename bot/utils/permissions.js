import { config, ADMIN_ROLES, MOD_ROLES, STAFF_ROLES } from '../../shared/config.js';

export function hasRole(member, roleIds) {
  if (!Array.isArray(roleIds)) roleIds = [roleIds];
  return roleIds.some(id => member.roles.cache.has(id));
}

export function isFounder(member) {
  return member.roles.cache.has(config.roles.founder) || member.roles.cache.has(config.roles.superAdmin);
}

export function isAdmin(member) {
  return ADMIN_ROLES.some(id => member.roles.cache.has(id));
}

export function isMod(member) {
  return MOD_ROLES.some(id => member.roles.cache.has(id));
}

export function isStaff(member) {
  return STAFF_ROLES.some(id => member.roles.cache.has(id));
}

export function isMegaDroper(member) {
  return member.roles.cache.has(config.roles.megaDroper) || isAdmin(member);
}

export function getTier(member) {
  if (member.roles.cache.has(config.roles.extremeGen)) return 'extreme';
  if (member.roles.cache.has(config.roles.boosterGen)) return 'booster';
  if (member.roles.cache.has(config.roles.premiumGen)) return 'premium';
  if (member.roles.cache.has(config.roles.basicGen)) return 'free';
  return null;
}

export function canGenInChannel(member, channelId) {
  const { channels } = config;
  if (channelId === channels.extremeGen) return member.roles.cache.has(config.roles.extremeGen);
  if (channelId === channels.boosterGen) {
    return member.roles.cache.has(config.roles.boosterGen) ||
      member.roles.cache.has(config.roles.extremeGen);
  }
  if (channelId === channels.premiumGen) {
    return member.roles.cache.has(config.roles.premiumGen) ||
      member.roles.cache.has(config.roles.boosterGen) ||
      member.roles.cache.has(config.roles.extremeGen);
  }
  if (channelId === channels.freeGen) {
    return member.roles.cache.has(config.roles.basicGen) ||
      member.roles.cache.has(config.roles.premiumGen) ||
      member.roles.cache.has(config.roles.boosterGen) ||
      member.roles.cache.has(config.roles.extremeGen);
  }
  return false;
}

export function getTierFromChannel(channelId) {
  const { channels } = config;
  if (channelId === channels.extremeGen) return 'extreme';
  if (channelId === channels.boosterGen) return 'booster';
  if (channelId === channels.premiumGen) return 'premium';
  if (channelId === channels.freeGen) return 'free';
  return null;
}
