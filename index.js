require('./keep_alive.js');// ANTI-QUEDA NATALINO - FICA PRA SEMPRE
client.on('shardDisconnect', () => {
  console.log('NATALINO desconectou, reconectando...');
  client.login(process.env.TOKEN);
});

client.on('shardError', error => {
  console.log('Erro, mas NATALINO continua:', error);
});

client.on('ready', () => {
  console.log(`NATALINO TA ON PRA SEMPRE COMO ${client.user.tag}`);
});

// Impede o bot de fechar sozinho
process.on('unhandledRejection', err => console.log('Erro ignorado:', err));
process.on('uncaughtException', err => console.log('Erro ignorado:', err));
