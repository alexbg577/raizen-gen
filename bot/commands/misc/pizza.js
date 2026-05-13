
// Emoji list
export const name = 'pizza';
export async function execute(message, args) {
  const target = message.mentions.members.first();
  if (target) {
    await message.reply(`🍕 ${message.author} gives pizza to ${target}!`);
  } else {
    await message.reply(`🍕 ${message.author} eats pizza!`);
  }
}