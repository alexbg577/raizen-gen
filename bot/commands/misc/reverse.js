
// Emoji list
export const name = 'reverse';
export async function execute(message, args) {
  const text = args.join(' ');
  if (!text) return message.reply('❌ Usage: `!reverse <text>`');
  const reversed = text.split('').reverse().join('');
  await message.reply(`🔄 Reversed: ${reversed}`);
}