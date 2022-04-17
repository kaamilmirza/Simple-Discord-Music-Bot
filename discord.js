const {Client, Intents,MessageEmbed} = require('discord.js');
const discordVoice  = require('@discordjs/voice');
const client = new Client({intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILD_MESSAGES]});
require('dotenv').config();
client.on('ready',()=>{
  console.log(`Logged in as ${client.user.tag}!` );
});

const queue = new Map();


const player = discordVoice.createAudioPlayer();
const resource = discordVoice.createAudioResource('./droptest.mp3');
           

const prefix = '!';
client.on('message', async msg => {
  if(msg.author.bot)
    return;
  if (msg.content === prefix + "ping") {
    await msg.channel.send('Pong!');
  }
});


client.on('message', async msg => {
  const connection = joinVoiceChannel.joinVoiceChannel({
    channelId: msg.channel.id,
    guildId: msg.guild.id,
    adapterCreator: msg.guild.voiceAdapterCreator,
  });
      

  if(msg.author.bot)
  return;
  if (msg.content === prefix + "voice") {
      player.play(resource);
      connection.subscribe(player);
      console.log("Bot sent to voice");
  };
});



client.login(process.env.CLIENT_TOKEN).then(() => {
client.user.setPresence({activities : [{name: 'The F* out of life', type: 'PLAYING'}], status: 'online'});
});