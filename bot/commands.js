const { EmbedBuilder } = require('discord.js');

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
  
  // echo 명령어
  echo: {
    name: 'echo',
    description: '입력한 메시지를 따라 말합니다',
    execute(message, args, client) {
      const content = args.join(' ');
      if (!content) return message.reply('메시지를 입력해주세요!');
      message.channel.send(content);
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
  
  // 여기에 더 많은 명령어를 추가할 수 있습니다
};

module.exports = { commands };