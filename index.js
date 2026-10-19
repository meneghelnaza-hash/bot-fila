require('./keep_alive.js');

const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

client.on('shardDisconnect', () => {
  console.log('NATALINO desconectou, reconectando...');
  client.login(process.env.TOKEN);
});

client.on('shardError', error => {
  console.log('Erro, mas NATALINO continua:', error);
});

client.on('ready', () => {
  console.log('NATALINO TA ON PRA SEMPRE COM ANTI-QUEDA');
});

client.on('messageCreate', msg => {
  if (msg.content === '!fila') {
    msg.reply('Fila aqui!');
  }
});

client.login(process.env.TOKEN);

process.on('unhandledRejection', err => console.log(err));
process.on('uncaughtException', err => console.log(err));
