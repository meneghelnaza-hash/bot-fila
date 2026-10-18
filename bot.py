import discord
from discord.ext import commands
from discord import app_commands
import os

PRECOS = [1, 2, 3, 5, 10, 15, 20, 25, 50, 100, 150, 200]

intents = discord.Intents.default()
bot = commands.Bot(command_prefix="!", intents=intents)

class FilaView(discord.ui.View):
    def __init__(self):
        super().__init__(timeout=None)

    @discord.ui.button(label="Entrar", style=discord.ButtonStyle.green, custom_id="entrar")
    async def entrar(self, interaction: discord.Interaction, button: discord.ui.Button):
        await interaction.response.send_message("Entrou na 1V1 MOBILE 1", ephemeral=True)

    @discord.ui.button(label="Sair", style=discord.ButtonStyle.red, custom_id="sair")
    async def sair(self, interaction: discord.Interaction, button: discord.ui.Button):
        await interaction.response.send_message("Saiu da 1V1 MOBILE 1", ephemeral=True)

@bot.tree.command(name="criar-fila", description="Criar filas 1V1 MOBILE 1")
async def criar_fila(interaction: discord.Interaction):
    embed = discord.Embed(title="FILA 1V1 MOBILE 1", description="Escolha o valor", color=0x00ff00)
    await interaction.channel.send(embed=embed, view=FilaView())
    await interaction.response.send_message("Fila 1V1 MOBILE 1 criada!", ephemeral=True)

@bot.event
async def on_ready():
    await bot.tree.sync()
    print(f"Logado - 1V1 MOBILE 1")

bot.run(os.getenv("DISCORD_TOKEN"))
