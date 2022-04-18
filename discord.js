const {Client, Intents,MessageEmbed} = require('discord.js');
const discordVoice  = require('@discordjs/voice');
const client = new Client({intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILD_MESSAGES]});
require('dotenv').config();
const ytdl = require("ytdl-core");



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
  if(msg.author.bot) //checks if the messages are bot's or not
    return;

  if(!msg.content.startsWith(prefix)) //checks if bot commands or not
    return;


  const connection = discordVoice.joinVoiceChannel({
    channelId: msg.member.voice.channel.id, //voice channel ID taken from memeber
    guildId: msg.guild.id,
    adapterCreator: msg.guild.voiceAdapterCreator,
  });  // to establish connection of bot and voice channel
  
  const serverQueue = queue.get(msg.guild.id);

  if(msg.content.startsWith(`${prefix}play`)){
    execute(msg, serverQueue);
    return;
  }

  else if(msg.content.startsWith(`${prefix}skip`)){
    skip(msg,serverQueue);
    return;
  }

  else if(msg.content.startsWith(`${prefix}stop`)){
    stop(msg, serverQueue);
    return;
  }

  else{
    msg.channel.send("You need to enter to enter a valid command!");
  }
  // if (msg.content === prefix + "voice") {
  //     player.play(resource);
  //     connection.subscribe(player);
  //     console.log("Bot sent to voice");
  // }
});

async function execute(message, serverQueue){
  const args = message.content.split(" ");

  const voiceChannel = message.member.voice.channel;
  if(!voiceChannel){
    return message.channel.send("You need to be in a voice channel!");
  }

  const permission = voiceChannel.permissionsFor(message.client.user);
  if(!permission.has("CONNECT") || !permission.has("SPEAK")){
    return message.channel.send("Need permissions!");
  }
}








client.login(process.env.CLIENT_TOKEN).then(() => {
client.user.setPresence({activities : [{name: 'The F* out of life', type: 'PLAYING'}], status: 'online'});
});