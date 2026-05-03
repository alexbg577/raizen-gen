import { EmbedBuilder } from 'discord.js';

export const name = 'help';

export async function execute(message, args) {
  const helpEmbed = new EmbedBuilder()
    .setColor(0x5865F2)
    .setTitle('📖 Raizen Gen Help')
    .setDescription('Here are all available commands:')
    .addFields(
      { name: '!gen <service>', value: 'Generate an account (use in gen channels)', inline: false },
      { name: '!profile [@user]', value: 'Show user profile and vouches', inline: false },
      { name: '!vouch @user [amount]', value: 'Give vouch to a user (staff)', inline: false },
      { name: '!rvouch @user [amount]', value: 'Remove vouch from a user (admin)', inline: false },
      { name: '!leaderboard', value: 'Show vouch leaderboard', inline: false },
      { name: '!verify @user', value: 'Verify a user (staff)', inline: false },
      { name: '!ban @user [reason]', value: 'Ban a user (mod)', inline: false },
      { name: '!kick @user [reason]', value: 'Kick a user (mod)', inline: false },
      { name: '!mute @user <duration> [reason]', value: 'Mute a user (mod)', inline: false },
      { name: '!unmute @user', value: 'Unmute a user (mod)', inline: false },
      { name: '!warn @user <reason>', value: 'Warn a user (mod)', inline: false },
      { name: '!purge <amount>', value: 'Delete messages (mod)', inline: false },
      { name: '!announcement <message>', value: 'Send announcement (admin)', inline: false },
      { name: '!close [reason]', value: 'Close ticket (mod)', inline: false },
      { name: '!addstock <tier> [service]', value: 'Add stock (attach file) (staff)', inline: false },
      { name: '!stock', value: 'Check full stock (services) (staff)', inline: false },
      { name: '!services <tier>', value: 'Show services in stock (staff)', inline: false },
      { name: '!rall <tier>', value: 'Clear stock (mega droper+)', inline: false },
      { name: '!backup', value: 'Create server backup (admin)', inline: false },
      { name: '!giveaway <create/end/reroll>', value: 'Manage giveaways (staff)', inline: false },
      { name: '!send <service> <amount> [@user] [comment]', value: 'Send accounts to user (admin)', inline: false },
    )
    .setFooter({ text: 'Raizen Gen • Prefix: !' })
    .setTimestamp();

  await message.reply({ embeds: [helpEmbed] });
}
