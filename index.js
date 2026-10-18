const { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const TOKEN = process.env.TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;

const filas = new Map(); // guarda as filas

const commands = [
  new SlashCommandBuilder()
    .setName('criar-fila')
    .setDescription('Criar fila mista')
    .addStringOption(option =>
      option.setName('tipo')
        .setDescription('Escolha o tipo')
        .setRequired(true)
        .addChoices(
          { name: 'MISTO 1v1', value: '1v1' },
          { name: 'MISTO 2v2', value: '2v2' },
          { name: 'MISTO 3v3', value: '3v3' },
          { name: 'MISTO 4v4', value: '4v4' },
        ))
    .addStringOption(option =>
      option.setName('modo')
        .setDescription('Modo')
        .setRequired(true)
        .addChoices(
          { name: '📱 Mobile', value: 'mobile' },
          { name: '💻 Emulador', value: 'emulador' },
          { name: '🎮 Misto', value: 'misto' },
        )),
].map(c => c.toJSON());

client.once('ready', async () => {
  console.log(`Logado como ${client.user.tag}`);
  const rest = new REST({ version: '10' }).setToken(TOKEN);
  try {
    await rest.put(Routes.applicationCommands(CLIENT_ID), { body: commands });
    console.log('Comandos atualizados!');
  } catch (e) { console.error(e); }
});

client.on('interactionCreate', async interaction => {
  if (interaction.isChatInputCommand()) {
    if (interaction.commandName === 'criar-fila') {
      const tipo = interaction.options.getString('tipo');
      const modo = interaction.options.getString('modo');
      
      let vagas = 2;
      if (tipo === '1v1') vagas = 2;
      if (tipo === '2v2') vagas = 4;
      if (tipo === '3v3') vagas = 6;
      if (tipo === '4v4') vagas = 8;

      const id = interaction.id;
      filas.set(id, { tipo, modo, vagas, jogadores: [] });

      const embed = new EmbedBuilder()
        .setTitle(`🎮 FILA MISTO ${tipo.toUpperCase()} - ${modo.toUpperCase()}`)
        .setDescription(`**Ninguém na fila**\n\n0/${vagas} vagas`)
        .setColor(0x00FF00);

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId(`entrar_${id}`).setLabel('Entrar').setStyle(ButtonStyle.Success),
        new ButtonBuilder().setCustomId(`sair_${id}`).setLabel('Sair').setStyle(ButtonStyle.Danger),
      );

      await interaction.reply({ embeds: [embed], components: [row] });
    }
  }

  if (interaction.isButton()) {
    const [acao, id] = interaction.customId.split('_');
    const fila = filas.get(id);
    if (!fila) return interaction.reply({ content: 'Fila não existe mais!', ephemeral: true });

    if (acao === 'entrar') {
      if (fila.jogadores.includes(interaction.user.id)) return interaction.reply({ content: 'Você já tá na fila!', ephemeral: true });
      if (fila.jogadores.length >= fila.vagas) return interaction.reply({ content: 'Fila cheia!', ephemeral: true });
      fila.jogadores.push(interaction.user.id);
    } else {
      fila.jogadores = fila.jogadores.filter(j => j !== interaction.user.id);
    }

    const lista = fila.jogadores.length > 0 ? fila.jogadores.map(j => `<@${j}>`).join('\n') : '**Ninguém na fila**';
    const embed = new EmbedBuilder()
      .setTitle(`🎮 FILA MISTO ${fila.tipo.toUpperCase()} - ${fila.modo.toUpperCase()}`)
      .setDescription(`${lista}\n\n${fila.jogadores.length}/${fila.vagas} vagas`)
      .setColor(0x00FF00);

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId(`entrar_${id}`).setLabel('Entrar').setStyle(ButtonStyle.Success),
      new ButtonBuilder().setCustomId(`sair_${id}`).setLabel('Sair').setStyle(ButtonStyle.Danger),
    );

    await interaction.update({ embeds: [embed], components: [row] });
  }
});

client.login(TOKEN);
