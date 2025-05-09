
const { Client, Events, GatewayIntentBits } = require('discord.js');
const dotenv = require('dotenv').config({ path: __dirname + '/../.env' });
const { commands } = require('./commands.js');

const PREFIX = '!';

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,  // 서버 관련
    GatewayIntentBits.GuildMessages,  // 메시지 관련
    GatewayIntentBits.MessageContent,  // 메시지 내용 읽기
    GatewayIntentBits.GuildMembers  // 서버 멤버 관련
  ]
});

client.once(Events.ClientReady, () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', async message => {
    if (message.author.bot || !message.content.startsWith(PREFIX)) return;
    
    const args = message.content.slice(PREFIX.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    if (!commands[commandName]) return;
    
    try {
      commands[commandName].execute(message, args, client);
    } catch (error) {
      console.error(error);
      message.reply('명령어 실행 중 오류가 발생했습니다.');
    }
  });

client.login(process.env.DISCORD_TOKEN);