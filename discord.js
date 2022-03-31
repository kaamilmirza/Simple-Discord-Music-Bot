require('dotenv').config(); //initialize dotenv
const { Client, Intents, Message, Emoji, GuildEmoji } = require('discord.js'); 

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS] });
const axios = require('axios');
const ytdl = require('ytdl-core');

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.once('reconnecting', ()=>{
  console.log('Reconnecting!');
})

client.once('disconnect', () =>{
  console.log('Disconnect!');
})

const prefix = '!';
client.on('message', async message =>{
  if(message.author.bot) return;
  if(!message.content.startsWith(prefix)) return;
  
  const serverQueue = queue.get(message.guild.id);
  if(message.content.startsWith(`${prefix}play`)){
    execute(message,serverQueue);
    return;
  }

  if(message.content.startsWith(`${prefix}skip`)){
    skip(message,serverQueue);
    return;
  }

  if(message.content.startsWith(`${prefix}stop`)){
    stop(message,serverQueue);
    return;
  }
  else{
    message.channel.send("Not a valied command!");
  }
});

async function execute(message,serverQueue){
  const args = message.content.split(" ");
  const voiceChannel = message.member.voice.channel;
  if(!voiceChannel){
    return message.channel.send("Get in a voice channel to play music!");
  }
  const permissions = voiceChannel.permissionsFor(message.client.user);
  if (!permissions.has("CONNECT") || !permissions.has("SPEAK")){
      return message.channel.send("Don't have permissions in VC");
  }
  
  const songInfo = await ytdl.getInfo(args[1]);
  const song = {
    title : songInfo.videoDetails.title,
    url   : songInfo.videoDetails.video_url,
  };

  if(!serverQueue){

  }
  else{
    serverQueue.songs.push(song);
    console.log(serverQueue.songs);
    return message.channel.send(`${song.title} was added to the queue`);
  }

}






//make sure this line is the last line
client.login(process.env.CLIENT_TOKEN); //login bot using token

