import discord
from discord.ext import commands
from discord import app_commands

PRECOS = [1, 2, 3, 5, 10, 15, 20, 25, 50, 100, 150, 200]

class FilaView(discord.ui.View):
    def __init__(self):
        super().__init__(timeout=None)
        
    @discord.ui.button(label="Entrar", style=discord.ButtonStyle.green, custom_id="entrar")
    async def entrar(self, interaction: discord.Interaction, button: discord.ui.Button):
        # sua lógica de entrar aqui
        await interaction.response.send_message("Você entrou!", ephemeral=True)
    
    @discord.ui.button(label="Sair", style=discord.ButtonStyle.red, custom_id="sair")
    async def sair(self, interaction: discord.Interaction, button: discord.ui.Button):
        # sua lógica de sair aqui
        await interaction.response.send_message("Você saiu!", ephemeral=True)

@bot.tree.command(name="criar-fila", description="Criar filas")
@app_commands.describe(tipo="Mobile, Em
