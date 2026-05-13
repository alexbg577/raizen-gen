
// Emoji list
export const name = 'rate';
export async function execute(message, args) {
  const target = args.join(' ') || 'this';
  const rating = Math.floor(Math.random() * 5) + 1;
  const stars = '⭐'.repeat(rating) + '☆'.repeat(5 - rating);
  await message.reply(`⭐ I rate **${target}**: ${stars} (${rating}/5)`);
}