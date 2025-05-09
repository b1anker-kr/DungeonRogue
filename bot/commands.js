const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const characterManager = require('../game/characterManager');
const Character = require('../model/Character');
const roles = require = require('../constants/roles');

// 명령어들을 객체로 내보냄
const commands = {
  // ping 명령어
  ping: {
    name: 'ping',
    description: '봇의 응답 속도를 확인합니다',
    execute(message, args, client) {
      message.reply(`🏓 Pong! 지연 시간: ${client.ws.ping}ms`);
    }
  },

  // hello 명령어
  hello: {
    name: 'hello',
    description: '인사합니다',
    execute(message, args, client) {
      message.reply(`안녕하세요, ${message.author.username}님!`);
    }
  },

  // 시작 명령어
  시작: {
    name: '시작',
    description: '게임을 시작합니다.',
    async execute(message, args, client) {
      //message.reply(`안녕하세요, ${message.author.username}님!`);
      console.log(message.author.id);
      if (await characterManager.checkExistCharacter(message.author.id)) {

        const myCharacter = await characterManager.loadMyCharactor(message.author.id);
        console.log('myCharacter', myCharacter);

        const embed = new EmbedBuilder()
          .setColor('#0099ff')
          .setTitle('캐릭터가 이미 생성되었습니다')
          .setDescription(message.author.username +'님의 캐릭터 정보입니다.')
          .addFields(
              { name: '선택한 직업', value: myCharacter.role, inline: true },
              { name: '캐릭터 이름', value: myCharacter.name, inline: true }
            );
        message.reply({embeds: [embed]});
      } else {
        const embed = new EmbedBuilder()
          .setColor('#0099ff')
          .setTitle('캐릭터를 생성하세요!')
          .setDescription('이름과 직업을 선택해 주세요');

        roles.forEach(role => {
          embed.addFields({
            name: `${role.emoji} ${role.name}`,
            value: role.description,
            inline: true,
          });
        });

        const row1 = new ActionRowBuilder().addComponents(
          new ButtonBuilder().setCustomId('role_전사').setLabel('전사').setStyle(ButtonStyle.Primary),
          new ButtonBuilder().setCustomId('role_마법사').setLabel('마법사').setStyle(ButtonStyle.Primary),
          new ButtonBuilder().setCustomId('role_궁수').setLabel('궁수').setStyle(ButtonStyle.Primary),
          new ButtonBuilder().setCustomId('role_도적').setLabel('도적').setStyle(ButtonStyle.Primary),
          new ButtonBuilder().setCustomId('role_성기사').setLabel('성기사').setStyle(ButtonStyle.Primary),
        );
        const row2 = new ActionRowBuilder().addComponents(
          new ButtonBuilder().setCustomId('role_흑마법사').setLabel('흑마법사').setStyle(ButtonStyle.Primary),
          new ButtonBuilder().setCustomId('role_드루이드').setLabel('드루이드').setStyle(ButtonStyle.Primary),
          new ButtonBuilder().setCustomId('role_사제').setLabel('사제').setStyle(ButtonStyle.Primary),
          new ButtonBuilder().setCustomId('role_monk').setLabel('수도사').setStyle(ButtonStyle.Primary),
        );
        message.reply({ embeds: [embed], components: [row1, row2] });
      }
    }
  },

  // help 명령어
  help: {
    name: 'help',
    description: '사용 가능한 명령어 목록을 보여줍니다',
    execute(message, args, client) {
      const embed = new EmbedBuilder()
        .setColor('#0099ff')
        .setTitle('명령어 도움말')
        .setDescription('사용 가능한 명령어 목록입니다.')
        .addFields(
          Object.values(commands).map(cmd => {
            return { name: `!${cmd.name}`, value: cmd.description };
          })
        )
        .setTimestamp()
        .setFooter({ text: `${message.author.username}님이 요청함`, iconURL: message.author.displayAvatarURL() });

      message.reply({ embeds: [embed] });
    }
  },

};

module.exports = { commands };