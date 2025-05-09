
const { Client, Events, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const dotenv = require('dotenv').config({ path: __dirname + '/../.env' });
const { commands } = require('./commands.js');
const roles = require('../constants/roles');
const { addCharacter } = require('../game/characterManager.js')
const Character = require('../model/Character');

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

client.on('interactionCreate', async interaction => {

  if (!interaction.isButton()) return;

  let selectedRole = '';

  if (interaction.customId.startsWith('role_')) {
    try {
      selectedRole = interaction.customId.replace('role_', '');
      const role = roles.find(r => r.name === selectedRole);

      const filter = response => response.author.id === interaction.user.id;
      const collector = interaction.channel.createMessageCollector({ filter });
      const embed = new EmbedBuilder()
        .setColor(0x3498DB)
        .setTitle(`${interaction.user.username}님의 직업 선택`)
        .setDescription(`${role.emoji} **${role.name}**을(를) 선택하셨습니다!\n이름을 설정해주세요 '이름)홍길동' 형식으로 입력해주세요`)
        .addFields({ name: '직업 설명', value: role.description })
        .setTimestamp();

        await interaction.reply({ embeds: [embed], ephemeral: true });

      collector.on('collect', async (msg) => {

        const content = msg.content.trim();
        const nameRegex = /^이름\)(.+)$/;

        if (nameRegex.test(content)) {
          const name = content.match(nameRegex)[1]; // "아이유" 부분 추출
          const embed = new EmbedBuilder()
            .setTitle('캐릭터 생성이 완료 되었습니다!')
            .addFields(
              { name: '선택한 직업', value: selectedRole, inline: true },
              { name: '캐릭터 이름', value: name, inline: true }
            )
            .setColor('Random')
            .setTimestamp();
          await msg.reply({ embeds: [embed], ephemeral: true });
          collector.stop();

          const character = new Character(interaction.user.id, name, selectedRole, 1);
          addCharacter(character);
        }
      });

      collector.on('end', (collected) => {
        // 시간 제한 없이 종료되면 실행되는 부분은 생략
      });

    } catch (error) {
      console.error(error);
      await interaction.reply({
        content: '상호작용 처리 중 오류가 발생했습니다.',
        ephemeral: true
      });
    }
  }
});

client.login(process.env.DISCORD_TOKEN);