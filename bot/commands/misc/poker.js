
// Emoji list
export const name = 'poker';
export async function execute(message, args) {
  const hand = ['A♠️', 'K♠️', 'Q♠️', 'J♠️', '10♠️'];
  await message.reply(`🃏 Your poker hand:\n${hand.join(' ')}\n*Royal Flush! (Mock)*`);
}