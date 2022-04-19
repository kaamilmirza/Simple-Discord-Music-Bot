const {Client, Intents,MessageEmbed} = require('discord.js');
const discordVoice  = require('@discordjs/voice');
const client = new Client({intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILD_MESSAGES]});
require('dotenv').config();
const ytdl = require("ytdl-core");

client.on('ready',()=>{
  console.log(`Logged in as ${client.user.tag}!` );
});

const queue = new Map();
      
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

  const songInfo = await ytdl.getInfo(args[1]);
  const song = {
    title : songInfo.videoDetails.title,
    url   : songInfo.videoDetails.video_url,
  };

  if(!serverQueue){

    const queueContruct = {
      textChannel : message.channel,
      voiceChannel: voiceChannel,
      connection  : null,
      songs       : [],
      volume      : 5,
      playing     : true
    };

  queue.set(message.guild.id, queueContruct);
  queueContruct.songs.push(song);

  try{
    const connection = discordVoice.joinVoiceChannel({
      channelId: message.member.voice.channel.id, //voice channel ID taken from memeber
      guildId: message.guild.id,
      adapterCreator: message.guild.voiceAdapterCreator,
      
    });
    const player = discordVoice.createAudioPlayer();
    connection.subscribe(player)

    play(message.guild, queueContruct.songs[0]);
   
    // to establish connection of bot and voice channel
    
    }
    catch(err){
      console.log(err);
      queue.delete(message.guild.id);
      return message.channel.send(err);
      }
   }
    else{
      serverQueue.songs.push(song);
      return message.channel.send(`${song.title} has been added to the queue`);
    }
}


function skip(message, serverQueue){
  if(!message.member.voice.channel)
    return message.channel.send(
      "Be in voice channel to stop!"
    );
  if(!serverQueue)  
      return message.channel.send("No song to skip!");
  serverQueue.connection.dispatcher.end();
}

function stop(message, serverQueue){
  if(!message.member.voice.channel)
    return message.channel.send("Have to be in VC to stop!");

  if(!serverQueue)
    return message
  serverQueue.songs = [];
  serverQueue.connection.dispatcher.end();
}

function play(guild,song){
  const serverQueue = queue.get(guild.id);
  if(!song){
    serverQueue.voiceChannel.leave();
    queue.delete(guild.id);
    return;
  }
  const dispatcher = serverQueue.connection
  .play(ytdl(song.url))
  .on("finish", () => {
    serverQueue.songs.shift();
    play(guild, serverQueue.songs[0]);
  })
  .on("error", error => console.error(error));
dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
serverQueue.textChannel.send(`Start playing: **${song.title}**`);
}









client.login(process.env.CLIENT_TOKEN).then(() => {
client.user.setPresence({activities : [{name: 'The F* out of life', type: 'PLAYING'}], status: 'online'});});
