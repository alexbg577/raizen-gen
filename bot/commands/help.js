import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';

export const name = 'help';

export async function execute(message, args) {
  const helpEmbed = new EmbedBuilder()
    .setColor(0x5865F2)
    .setTitle('📖 Raizen Gen Help')
    .setDescription('**Welcome to Raizen Gen!**\nHere are all available commands:')
    .addFields(
      { name: '🎮 Gen Commands', value: '`!gen <service>` - Generate an account\n`!profile [@user]` - Show profile & vouches', inline: false },
      { name: '⭐ Vouch System', value: '`!vouch @user [amount]` - Give vouch (staff)\n`!rvouch @user [amount]` - Remove vouch (admin)\n`!leaderboard` - Show vouch rankings', inline: false },
      { name: '🛡️ Moderation', value: '`!ban @user [reason]` - Ban user\n`!kick @user [reason]` - Kick user\n`!mute @user <min> [reason]` - Mute user\n`!unmute @user` - Unmute\n`!warn @user <reason>` - Warn user\n`!purge <amount>` - Delete messages\n`!close [reason]` - Close ticket', inline: false },
      { name: '📦 Stock Management', value: '`!addstock <tier> [service]` - Add stock (attach file)\n`!stock` - View full stock with services\n`!services <tier>` - List services in tier\n`!rall <tier>` - Clear stock (mega droper+)\n`!send <service> <amt> [@user] [comment]` - Send accounts (admin)', inline: false },
      { name: '🎉 Giveaways', value: '`!giveaway create/end/reroll` - Manage giveaways (staff)', inline: false },
      { name: '🔧 Admin', value: '`!verify @user` - Verify user (staff)\n`!announcement <msg>` - Send announcement\n`!backup` - Create server backup', inline: false },
      { name: '🌐 Web', value: '`!web` - Get website link', inline: false }
    )
    .setThumbnail('https://i.imgur.com/8xZq3eE.png') // Optional: add Raizen Gen logo
    .setFooter({ text: 'Raizen Gen • Prefix: ! • Use ?help <command> for details', iconURL: 'https://i.imgur.com/8xZq3eE.png' })
    .setTimestamp();

  const row = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
        .setLabel('🌐 Website')
        .setStyle(ButtonStyle.Link)
        .setURL('https://raizen-gen-web.onrender.com'),
      new ButtonBuilder()
        .setLabel('📖 Documentation')
        .setStyle(ButtonStyle.Link)
        .setURL('https://raizen-gen-web.onrender.com/docs')
    );

  await message.reply({ embeds: [helpEmbed], components: [row] });
}
