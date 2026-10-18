const { Client, GatewayIntentBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder, REST, Routes } = require('discord.js');
const express = require('express');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] });
const filas = new Map();
const VALORES = [1, 2, 3, 5, 10, 15, 20, 50, 100, 150, 200];
const app = express(); app.get('/', (r,s)=>s.send('ON')); app.listen(3000);

const commands = [
  new SlashCommandBuilder()
  .setName('criar-fila')
  .setDescription('Cria filas')
  .addStringOption(o=>o.setName('tipo').setDescription('mobile, emu, misto').setRequired(true).addChoices({name:'Mobile',value:'MOBILE'},{name:'Emu',value:'EMU'},{name:'Misto',value:'MISTO'}))
  .addStringOption(o=>o.setName('modo').setDescription('2v2, 3v3, 4v4').setRequired(true).addChoices({name:'2v2',value:'2v2'},{name:'3v3',value:'3v3'},{name:'4v4',value:'4v4'}))
  .toJSON()
];

client.on('ready', async () => { 
  const rest = new REST({ version: '10' }).setToken(process.env.TOKEN); 
  await rest.put(Routes.applicationCommands(client.user.id), { body: commands }); 
  console.log('BOT ON');
});

function getEmbed(tipo, modo, valor, jogadores){
  const vagas = modo==='2v2'?4:modo==='3v3'?6:8;
  return new EmbedBuilder()
  .setTitle(`🎮 FILA ${tipo} ${modo.toUpperCase()} - R$ ${valor.toFixed(2).replace('.',',')}`)
  .setDescription(jogadores.length===0?'Ninguem na fila':jogadores.map((id,i)=>`${i+1}. <@${id}>`).join('\n')+`\n\n${jogadores.length}/${vagas}`)
  .setColor(tipo==='MOBILE'?0x00FF00:tipo==='EMU'?0xFF0000:0xFFFF00);
}

client.on('interactionCreate', async i => {
  if(i.isChatInputCommand()){
    const tipo = i.options.getString('tipo');
    const modo = i.options.getString('modo');
    const vagas = modo==='2v2'?4:modo==='3v3'?6:8;
    await i.reply({ content: `Criando 11 filas ${tipo} ${modo}...`, ephemeral: true });
    for(const v of VALORES){
      const msg = await i.channel.send({ embeds: [getEmbed(tipo, modo, v, [])], components: [new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId('entrar').setLabel('Entrar').setStyle(ButtonStyle.Success), new ButtonBuilder().setCustomId('sair').setLabel('Sair').setStyle(ButtonStyle.Danger))] });
      filas.set(msg.id, { tipo, modo, valor: v, vagas, jogadores: [] });
    }
  }
  if(i.isButton()){
    const f = filas.get(i.message.id); if(!f) return;
    if(i.customId==='entrar'){ if(!f.jogadores.includes(i.user.id)) f.jogadores.push(i.user.id); } else f.jogadores=f.jogadores.filter(id=>id!==i.user.id);
    if(f.jogadores.length>=f.vagas){ await i.channel.send(`🔥 **FECHOU FILA ${f.tipo} ${f.modo} R$ ${f.valor}** - ${f.jogadores.map(id=>`<@${id}>`).join(' ')}`); f.jogadores=[]; }
    await i.update({ embeds: [getEmbed(f.tipo, f.modo, f.valor, f.jogadores)], components: i.message.components });
  }
});
client.login(process.env.TOKEN);
