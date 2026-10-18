const express = require('express');
const app = express();
app.get('/', (req,res)=>res.send('Bot online'));
app.listen(process.env.PORT || 3000);
const { Client, GatewayIntentBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
let fila = [];
client.on('ready', ()=>console.log('Bot ON'));
client.on('interactionCreate', async i=>{
 if(i.isChatInputCommand() && i.commandName==='criar-fila'){
  fila=[];
  const e=new EmbedBuilder().setTitle('🎮 FILA').setDescription('Ninguem na fila').setColor('Green');
  const r=new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId('entrar').setLabel('Entrar').setStyle(ButtonStyle.Success), new ButtonBuilder().setCustomId('sair').setLabel('Sair').setStyle(ButtonStyle.Danger));
  await i.reply({embeds:[e],components:[r]});
 }
 if(i.isButton()){
  const u=`<@${i.user.id}>`;
  if(i.customId==='entrar' && !fila.includes(u)) fila.push(u);
  if(i.customId==='sair') fila=fila.filter(x=>x!==u);
  const d=fila.length?fila.join('\n'):'Ninguem na fila';
  const e=new EmbedBuilder().setTitle(`FILA (${fila.length})`).setDescription(d).setColor('Green');
  await i.update({embeds:[e]});
 }
});
client.login(process.env.TOKEN);
