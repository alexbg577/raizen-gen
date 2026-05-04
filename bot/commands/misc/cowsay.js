import { EmbedBuilder, PermissionFlagsBits, ChannelType } from 'discord.js';
import { isAdmin, isMod, isStaff } from '../../utils/permissions.js';
import { config } from '../../../shared/config.js';

// Emoji list
export const name = 'cowsay';
export async function execute(message, args) {
  const text = args.join(' ') || 'Hello!';
  const bubble = ` ${'_'.repeat(text.length + 2)}\n< ${text} >\n ${'-'.repeat(text.length + 2)}\n        \\   ^__^\n         \\  (oo)\\_______\n            (__)\       )\\/\\\n                ||----w |\n                ||     || `;
  await message.reply(`\`\`\`\n${bubble}\n\`\`\``);
}