const {Client, Intents} = require('discord.js');
const { joinVoiceChannel } = require('@discordjs/voice');
const client = new Client({intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILD_MESSAGES]});
require('dotenv').config();
client.on('ready',()=>{
  console.log(`Logged in as ${client.user.tag}!` );
});

const queue = new Map();

const prefix = '!';
client.on('message', async msg => {

  if (msg.content === "ping") {
    await msg.channel.send('Pong!');
  }
    const connection = joinVoiceChannel({
      channelId: msg.channel.id,
      guildId: msg.channel.guild.id,
      adapterCreator: msg.channel.guild.voiceAdapterCreator,
    });
    joinVoiceChannel(msg);
});




client.login(process.env.CLIENT_TOKEN);