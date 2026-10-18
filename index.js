const { Client, GatewayIntentBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder, REST, Routes } = require('discord.js');
const express = require('express');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] });
const filas = new Map();
const VALORES = [1, 2, 3, 5, 10, 15, 20, 50, 100, 150, 200];
const app = express(); app.get('/', (r,s)=>s.send('ON')); app.listen(3000);

const commands = [
  new SlashCommandBuilder().setName('criar-fila').setDescription('Cria 11 filas')
  .addStringOption(o => o.setName('nome').setDescription('Nome da fila').setRequired(true))
  .addStringOption(o => o.setName('tipo').setRequired(true).addChoices({ name: 'MOBILE', value: 'Mobile' }, { name: 'EMULADOR', value: 'Emulador' }, { name: 'MISTO', value: 'Misto' }))
  .addStringOption(o => o.setName('modo').setRequired(true).addChoices({ name: '1v1', value: '1v1' }, { name: '2v2', value: '2v2' }, { name: '3v3', value: '3v3' }, { name: '4v4', value
