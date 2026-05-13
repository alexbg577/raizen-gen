
// Emoji list
export const name = 'hack';
export async function execute(message, args) {
  const target = message.mentions.members.first() || message.member;
  const progress = ['██░░░░░░░░', '████░░░░░░', '██████░░░░', '████████░░', '██████████'];
  await message.reply(`💻 Hacking ${target.user.username}...\n${progress[Math.floor(Math.random() * progress.length)]} 50%`);
  setTimeout(async () => {
    await message.channel.send(`💻 Hacking ${target.user.username}...\n██████████ 100%\n✅ Successfully hacked! (Just kidding 😂)`);
  }, 2000);
}