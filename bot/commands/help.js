import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';

export const name = 'help';

export async function execute(message, args) {
  const { client } = message;
  const commands = client.commands;

  // If a specific command is requested
  if (args.length > 0) {
    const cmdName = args[0].toLowerCase();
    const cmd = commands.get(cmdName);
    if (!cmd) return message.reply('❌ Command not found.');
    
    const embed = new EmbedBuilder()
      .setColor(0x5865F2)
      .setTitle(`📖 Help: !${cmdName}`)
      .setDescription('Command details and usage.')
      .setFooter({ text: 'Raizen Gen • Use !help for all commands' });
    
    await message.reply({ embeds: [embed] });
    return;
  }

  // Group commands by category
  const categories = {
    '🎮 Gen': ['gen', 'profile'],
    '⭐ Vouch': ['vouch', 'rvouch', 'leaderboard'],
    '🛡️ Moderation': ['ban', 'kick', 'mute', 'unmute', 'warn', 'purge', 'close', 'clearreactions', 'lock', 'unlock', 'slowmode', 'addrole', 'removerole', 'createtext', 'createvoice', 'deletechannel', 'createrole', 'deleterole', 'nick', 'purgebot', 'purgeuser', 'movemsg', 'stealmsg', 'pin', 'unpin', 'pins'],
    '📦 Stock': ['addstock', 'stock', 'services', 'rall', 'send'],
    '🎉 Giveaway': ['giveaway'],
    '🔧 Admin': ['verify', 'announce', 'backup', 'announcement', 'notifiy', 'servers'],
    '🌐 Web': ['web'],
    '📊 Info': ['serverinfo', 'userinfo', 'botinfo', 'avatar', 'channelinfo', 'roleinfo', 'firstmessage', 'servericon', 'serverbanner', 'invite', 'perms', 'rolemembers', 'boostinfo', 'poll', 'pollquick', 'snipe'],
    '🎲 Fun': ['8ball', 'roll', 'flip', 'rps', 'rpsls', 'hug', 'kiss', 'slap', 'pat', 'cry', 'laugh', 'dance', 'pizza', 'coin', 'rate', 'compliment', 'roast', 'truth', 'dare', 'meme', 'joke', 'fact', 'quote', 'fortune'],
    '🔧 Tools': ['calc', 'random', 'ping', 'uptime', 'remind', 'password', 'token', 'encode', 'decode', 'binary', 'hex', 'reverse', 'leet', 'clap', 'mock', 'shuffle', 'vaporwave', 'translate', 'weather', 'qrcode', 'shorturl', 'color'],
    '🎮 Games': ['play', 'watch', 'listen', 'stream', 'resetpresence', 'mine', 'fish', 'hunt', 'gamble', 'daily', 'weekly', 'monthly', 'inventory', 'shop', 'leaderboard', 'blackjack', 'poker', 'roulette', 'slot', 'lottery', 'wheel', 'scratch', 'hack', 'ship', 'ticactoe', 'trivia', 'challenge'],
    '💬 Misc': ['say', 'esay', 'dm', 'afk', 'cowsay', 'rhyme', 'define', 'scramble', 'credit'],
  };

  const embed = new EmbedBuilder()
    .setColor(0x5865F2)
    .setTitle('📖 Raizen Gen Help')
    .setDescription(`**${commands.size} commands available**\nUse \`!help <command>\` for details`)
    .setThumbnail('https://raizen-gen-web.onrender.com/images/logo.svg')
    .setImage('https://raizen-gen-web.onrender.com/images/help-banner.svg')
    .setFooter({ text: 'Raizen Gen • Prefix: !', iconURL: 'https://raizen-gen-web.onrender.com/images/logo.svg' })
    .setTimestamp();

  for (const [catName, cmdNames] of Object.entries(categories)) {
    const available = cmdNames.filter(c => commands.has(c));
    if (available.length > 0) {
      embed.addFields({
        name: catName,
        value: available.map(c => `\`!${c}\``).join(', '),
        inline: false
      });
    }
  }

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

  await message.reply({ embeds: [embed], components: [row] });
}
