const Discord = require("discord.js");
const client = new Discord.Client();
const express = require("express");
var app = express();
var errorlog = require("./errors.json")
const yt = require('ytdl-core');
var RedisSessions = require("redis-sessions");
var rs = new RedisSessions();
var ffmpeg = require("ffmpeg-binaries");
var search = require('youtube-search');
const ddiff = require('return-deep-diff');
var con = console.log;
var moment = require("moment");
var config = {   
            "youtube_api_key" : "AIzaSyAdORXg7UZUo7sePv97JyoDqtQVi3Ll0b8",
        } 
queues = {},
fs = require('fs'),
ytdl = require('ytdl-core'),
opts = {
    part: 'snippet',
    maxResults: 10,
    key: config.youtube_api_key
}
var intent;
function getQueue(guild) {
    if (!guild) return
    if (typeof guild == 'object') guild = guild.id
    if (queues[guild]) return queues[guild]
    else queues[guild] = []
    return queues[guild]
}

function getRandomInt(max) {
    return Math.floor(Math.random() * (max + 1));
}

fighting = new Set();

app.get("/queue/:guildid",function(req,res){
  let queue = getQueue(req.params.guildid);
    if(queue.length == 0) return res.send(":x: pas de musique").then(response => { response.delete(5000) });
    let text = '';
    for(let i = 0; i < queue.length; i++){
      text += `${(i + 1)}. ${queue[i].title} | par ${queue[i].requested}\n`    };
  res.send(text)
})
        
var paused = {};
function play(message, queue, song) {
    try {
        if (!message || !queue) return;
        if (song) {
            search(song, opts, function(err, results) {
               
                if (err) return message.channel.send(":x: video non trouvable, utilisez un lien youtube ou un titre fonctionnel").then(response => { response.delete(5000) });
                
                song = (song.includes("https://" || "http://")) ? song : results[0].link
                let stream = ytdl(song, {
                    audioonly: true
                })
                let test
                if (queue.length === 0) test = true
                queue.push({
                    "title": results[0].title,
                    "requested": message.author.username,
                    "toplay": stream,
        "link": results[0].link,
                })
      
               
            
const embed = new Discord.RichEmbed()
  .setTitle("**:mag_right: Recherche**")
  /*
   * Alternatively, use "#00AE86", [0, 174, 134] or an integer number.
   */
  .setColor(3447003)
  .setDescription("`" + message.content.substr(6) + "`")
  .setThumbnail("http://www.icone-gif.com/gif/ecole/loupe/loupes005.gif")
  /*
   * Takes a Date object, defaults to current date.
   */
  .setTimestamp()


  message.channel.send({embed}).then(response => { response.delete(5000) });

                message.channel.send("**:ballot_box_with_check: Ajout à la playlist - ** `" + queue[queue.length - 1].title + "`").then(response => { response.delete(5000) });
                if (test) {
                    setTimeout(function() {
                        play(message, queue)
                    }, 1000)
                }
            })
        } else if (queue.length != 0) {
            
const embed = new Discord.RichEmbed()
  .setTitle("**:notes: lecture en cours**")
  /*
   * Alternatively, use "#00AE86", [0, 174, 134] or an integer number.
   */
  .setColor(3447003)
  .setDescription("**Titre :** `" + queue[0].title +"`\n\n**Demandé par :** `" + queue[0].requested + "`")
  .setThumbnail("https://media.giphy.com/media/k4DMkVjd8kwkE/giphy.gif")
  /*
   * Takes a Date object, defaults to current date.
   */
  .setTimestamp()
  .setURL(queue[0].link)


  message.channel.send({embed}).then(response => { response.delete(10000) });
            let connection = message.guild.voiceConnection
            if (!connection) return con(":x: pas de connection").then(response => { response.delete(5000) });
            intent = connection.playStream(queue[0].toplay)

            intent.on('error', () => {
                queue.shift()
                play(message, queue)
            })

            intent.on('end', () => {    
       setTimeout(() => {
          if (queue.length > 0) { 
              queue.shift()
       play(message, queue) 
              } 
       }, 1000)

            })
            
        } else {
            message.channel.send(":x: pas de musique dans la playlist").then(response => { response.delete(5000) });
            
        }
    } catch (err) {
        console.log("Error\n\n" + err.stack)
        errorlog[String(Object.keys(errorlog).length)] = {
            "code": err.code,
            "error": err,
            "stack": err.stack
        }
        fs.writeFile("./errors.json", JSON.stringify(errorlog), function(err) {
            if (err) return con("Error");
        });
        

    }
}

var util = require('util');
var youtube_node = require('youtube-node');
var prefix = "&"


var request = require('request')
var AwaitingPlayer = [];

//=====Modules-Complémentaires=====//
const help = require('./modules/help/help.js');
//=====Constances=====//


//=====FS=====//

///=====Modules-Infos=====//
const userinfo = require('./modules/infos/userinfo.js');
const serverinfo = require('./modules/infos/serverinfo.js');
const channel = require('./modules/infos/channel.js');
const stats = require('./modules/infos/stats.js');
const avatar = require('./modules/infos/avatar.js');
//=====Modules-Modération=====//
const dm = require('./modules/moderation/dm.js');
const addrole = require('./modules/moderation/addrole.js');
const rmrole = require('./modules/moderation/rmrole.js');
const mute = require('./modules/moderation/mute.js');
const unmute = require('./modules/moderation/unmute.js');
const purge = require('./modules/moderation/purge.js');
const warn = require('./modules/moderation/warn.js');
const kick = require('./modules/moderation/kick.js');

//=====Modules-Fun=====//
const ascii = require('./modules/fun/ascii.js');
const afk = require('./modules/fun/afk.js');
const blagues = require('./modules/fun/blagues.js');



//=====Modules-Musique=====//



//=====Modules-Utility=====//

const selfrole = require('./modules/utilité/selfrole.js');

client.on("ready", () => {


client.user.setGame("contactez moi pour parler au staff");
  client.user.setStatus("dnd");
const listserver =  client.guilds.map(g => g.name).join('\n')
console.log('[!]Le préfix actuelle:  ' + prefix + "\n[!]Nombre de membres: " + client.users.size + "\n[!]Nombre de serveurs: " + client.guilds.size);
});

client.on('message', message => {
    if (message.channel.type != "dm") {
     
       

     serverinfo(message, prefix, client)
     userinfo(message, prefix, client)
     channel(message, prefix, client)
     stats(message, prefix, client)
     avatar(message, prefix, client)
     afk(message, prefix, client)
     ascii(message, prefix, client)
     help(message, prefix, client)
     dm(message, prefix, client)
     blagues(message, prefix, client)
     addrole(message, prefix, client)
     rmrole(message, prefix, client)
     kick(message, prefix, client)
     mute(message, prefix, client)
     unmute(message, prefix, client)
     warn(message, prefix, client)
     selfrole(message, prefix, client)
  

    }
});

  
        
    client.on("message", function(message) {
    const messagea = message.content
    try {
        if (message.channel.type === "dm") return;
        if (message.author === client.user)
        
            if (message.guild === undefined) {
                message.channel.send("Le bot ne fonctionne que sur des serveurs !")

                return;
            }


  
        if (message.content.startsWith(prefix +'play')) {
            if(message.channel.name != 'musique'){
            return message.reply("Veuillez faire ces commandes dans <#396358820017733642>");
}

            if (!message.guild.voiceConnection) {
                
                if (!message.member.voiceChannel) return message.channel.send(':x: Vous devez être connecté à un channel vocal')
                
                message.member.voiceChannel.join()
            }
            let suffix = messagea.split(" ").slice(1).join(" ")
            
            if (!suffix) return message.channel.send(':x: Vous devez spécifier un titre ou un lien youtube')
            

            play(message, getQueue(message.guild.id), suffix)
        }
        if (message.content.startsWith(prefix +'stop')) {
            if(message.channel.name != 'musique'){
            return message.reply("Veuillez faire ces commandes dans <#396358820017733642>");
}

            console.log('leave');
            if (!message.guild.voiceConnection) {
               
                if (!message.member.voiceChannel) return message.channel.send(':x: Vous devez être connecté à un channel vocal')
                
}
                var chan = message.member.voiceChannel;
               message.member.voiceChannel.leave();
                let queue = getQueue(message.guild.id);
                
                if (queue.length == 0) return message.channel.send(`Plus de musique dans la playlist`).then(response => { response.delete(5000) });
                for (var i = queue.length - 1; i >= 0; i--) {
                    queue.splice(i, 1);
                }
                message.channel.send(`playlist vide\n\nDeconnexion ...`).then(response => { response.delete(5000) });

                
            
        }
        
        if (message.content.startsWith(prefix +"clearQ")) {
            if(message.channel.name != 'musique'){
            return message.reply("Veuillez faire ces commandes dans <#396358820017733642>");
}
         
                let queue = getQueue(message.guild.id);
                
                if (queue.length == 0) return message.channel.send(`Plus de musique dans la playlist`).then(response => { response.delete(5000) });
                
                for (var i = queue.length - 1; i >= 0; i--) {
                    queue.splice(i, 1);
                }
                
                message.channel.send(":wastebasket: playlist vidée !").then(response => { response.delete(5000) })
                
            }
        if (message.content.startsWith(prefix +'skip')) {
            if(message.channel.name != 'musique'){
            return message.reply("Veuillez faire ces commandes dans <#396358820017733642>");
}
          
        if (!message.member.voiceChannel) return message.channel.send(':x: Vous devez être connecté à un channel vocal')
                let player = message.guild.voiceConnection.player.dispatcher
                if (!player || player.paused) return message.channel.send(":x: Le bot ne joue pas").then(response => { response.delete(5000) });
                message.channel.send(':fast_forward: Skip').then(response => { response.delete(5000) });
                player.end()
            

        }

        if (message.content.startsWith(prefix +'pause')) {
            if(message.channel.name != 'musique'){
            return message.reply("Veuillez faire ces commandes dans <#396358820017733642>");
}
          
                
                    if (!message.member.voiceChannel) return message.channel.send(':x: Vous devez être connecté à un channel vocal').then(response => { response.delete(5000) });
                    let player = message.guild.voiceConnection.player.dispatcher
                    if (!player || player.paused) return message.channel.send(":x: Le bot ne joue pas").then(response => { response.delete(5000) });
                    player.pause();
                    const embed = new Discord.RichEmbed()
  .setTitle("**Pause** ")
  /*
   * Alternatively, use "#00AE86", [0, 174, 134] or an integer number.
   */
  .setColor(3447003)
  .setDescription(":pause_button:")
  .setThumbnail("https://media.giphy.com/media/ihAzpzQNrjKZa/giphy.gif")
  /*
   * Takes a Date object, defaults to current date.
   */
  .setTimestamp()



  message.channel.send({embed}).then(response => { response.delete(5000) });
                
               
            } 
        if (message.content.startsWith(prefix +'volume')) {
            if(message.channel.name != 'musique'){
            return message.reply("Veuillez faire ces commandes dans <#396358820017733642>");
}
         let suffix = message.content.split(" ")[1];
                        
            var player = message.guild.voiceConnection.player.dispatcher
            if (!player || player.paused) return message.channel.send(':x: Le bot ne joue pas');
            
            if (!suffix) {
var player = message.guild.voiceConnection.player.dispatcher
                
                message.channel.send(`Le volume actuel est ${(player.volume * 100)}`).then(response => { response.delete(5000) });
                
            } var player = message.guild.voiceConnection.player.dispatcher
                let volumeBefore = player.volume
                let volume = parseInt(suffix);
                
                if (volume > 100) return message.channel.send("Le volume ne peux pas atteindre plus de **100**").then(response => { response.delete(5000) });
                player.setVolume((volume / 100));
                 const embed = new Discord.RichEmbed()
  .setTitle("**Changement de volume ** ")
  /*
   * Alternatively, use "#00AE86", [0, 174, 134] or an integer number.
   */
  .setColor(3447003)
  .setDescription(":speaker: `"+ volume + "`")
  .setThumbnail("https://www.emojimantra.com/wp-content/uploads/2015/12/Speaker-with-One-Sound-Wave1.jpg")
  /*
   * Takes a Date object, defaults to current date.
   */
  .setTimestamp()



  message.channel.send({embed}).then(response => { response.delete(5000) });
                
            }
        

        if (message.content.startsWith(prefix +'resume')) {
            if(message.channel.name != 'musique'){
            return message.reply("Veuillez faire ces commandes dans <#396358820017733642>");
}
          
                
                if (!message.member.voiceChannel) return message.channel.send(':x: Vous devez être connecté à un channel vocal').then(response => { response.delete(5000) });
                let players = message.guild.voiceConnection.player.dispatcher
                if (!players) return message.channel.send(':x: Le bot ne joue pas').then(response => { response.delete(5000) });
                if (players.playing) return message.channel.send(':x: La musique est déjà en lecture').then(response => { response.delete(5000) });
                
                var queue = getQueue(message.guild.id);
           
                players.resume();
                
                const embed = new Discord.RichEmbed()
  .setTitle("**Lecture** ")
  /*
   * Alternatively, use "#00AE86", [0, 174, 134] or an integer number.
   */
  .setColor(3447003)
  .setDescription(":arrow_forward:")
  .setThumbnail("https://media.giphy.com/media/ihAzpzQNrjKZa/giphy.gif")
  /*
   * Takes a Date object, defaults to current date.
   */
  .setTimestamp()



  message.channel.send({embed}).then(response => { response.delete(5000) });
                
            } 
      

        if (message.content.startsWith(prefix +'queue')) {
            if(message.channel.name != 'musique'){
            return message.reply("Veuillez faire ces commandes dans <#396358820017733642>");
}
          let queue = getQueue(message.guild.id);
            
            if (queue.length == 0) return message.channel.send("Pas de musique dans la playlist");
            let text = '';
            for (let i = 0; i < queue.length; i++) {
                text += `${(i + 1)}. ${queue[i].title} | demandé par ${queue[i].requested}\n`
            };
            const embed = new Discord.RichEmbed()
  .setTitle("**:globe_with_meridians: playlist :** ")
  /*
   * Alternatively, use "#00AE86", [0, 174, 134] or an integer number.
   */
  .setColor(3447003)
  .setDescription("`" + text +"`")
  .setThumbnail("http://www.playzer.fr/images/loading_27.gif")
  /*
   * Takes a Date object, defaults to current date.
   */
  .setTimestamp()



  message.channel.send({embed}).then(response => { response.delete(50000) });
            
        }
    } catch (err) {
        
        console.log("Error\n\n\n" + err.stack)
        errorlog[String(Object.keys(errorlog).length)] = {
            "code": err.code,
            "error": err,
            "stack": err.stack
        }
        fs.writeFile("./errors.json", JSON.stringify(errorlog), function(err) {
            if (err) return console.log("Error");
        })
        
if(message.author.bot)return;

}

});

    client.on("message", function(message) {

  if(message.content.startsWith(prefix +'botname')){
    let suffix = message.content.split(" ")[1];
    if(message.author.id !== "231044533750726666")
    return message.reply(":x: Vous n'avez pas les permissions requise, seul le propriétaire du bot le peux");
    client.user.setUsername(message.content.substr(9));
if (!suffix) {
    message.reply(`:x: Veuillez ecrire un nom`)
if (suffix) {
    message.channel.send(`Changements effectués, le nouveau nom est **${client.user.username}**`);

}
} } 


 if (message.content.startsWith(prefix + "logout")) {

     if(message.author.id == "231044533750726666"){

      message.reply("Arrêt en cour");

        console.log('/ Je suis désormais offline / ');

        client.destroy();

        process.exit()

    } else {

      message.channel.send("**Erreur** ! Tu n'es pas l'owner")

    }
  }

if (message.content.startsWith(prefix + 'join')) {
    if(message.channel.name != 'musique'){
            return message.reply("Veuillez faire ces commandes dans <#396358820017733642>");
}
    let voiceChan = message.member.voiceChannel;
    if (!voiceChan || voiceChan.type !== 'voice') {
      message.channel.send('Tu n\'es pas en vocal !').catch(error => message.channel.send(error));
    } else if (message.guild.voiceConnection) {
      message.channel.send('Je suis déja dans un salon vocal !');
    } else {
      message.channel.send('Joining...').then(() => {
        voiceChan.join().then(() => {
          message.channel.send('Joined successfully.').catch(error => message.channel.send(error));
        }).catch(error => message.channel.send(error));
      }).catch(error => message.channel.send(error));
    }
  } else

  if (message.content.startsWith(prefix + 'stop')) {
      if(message.channel.name != 'musique'){
            return message.reply("Veuillez faire ces commandes dans <#396358820017733642>");
}
    let voiceChan = message.member.voiceChannel;
    if (!voiceChan) {
      message.channel.send('I am not in a voice channel');
    } else {
      message.channel.send('Leaving...').then(() => {
        voiceChan.leave();
      }).catch(error => message.channel.send(error));
    }
  }
//autorole serveur//

let autorole = JSON.parse(fs.readFileSync("./autoRole.json", "utf8"));
var defaultmodrole = 'membres';
var autoRole;
if(autorole[message.guild.id]){
var autoRole = autorole[message.guild.id].autoRole;
}else{
var autoRole = 'membres';
}
if(message.content.startsWith(prefix + "setautorole")){
if(!message.guild.member(message.author).hasPermission("ADMINISTRATOR")){return message.reply("**:x: Vous n'avez pas les permissions dans ce serveur**").catch(console.error);
}else{
let args = message.content.split(' ').slice(1);
if(!args) return message.channel.send('**:x: Merci de specifier un rôle**')
autorole[message.guild.id] = {"autoRole": args.join(" ")};
message.channel.send("Mon autoRole est `"+ args.join(" ") + "`");
fs.writeFile("./autoRole.json", JSON.stringify(autorole), (err) => {if (err) console.error(err);});
}
}

//logs serveur//

let log = JSON.parse(fs.readFileSync("./logs.json", "utf8"));
var defaultlogchannel = 'logs';
var logs;
if(log[message.guild.id]){
var logs = log[message.guild.id].logs;
}else{
var logs = 'logs';
}
if(message.content.startsWith(prefix + "setlog")){
if(!message.guild.member(message.author).hasPermission("ADMINISTRATOR")){return message.reply("**:x: Vous n'avez pas les permissions dans ce serveur**").catch(console.error);
}else{
let args = message.content.split(' ').slice(1);
if(!args) return message.channel.send('**:x: Merci de specifier un channel**')
log[message.guild.id] = {"logs": args.join(" ")};
message.channel.send("Mon channel des logs d'annonce est `"+ args.join(" ") + "`");
fs.writeFile("./logs.json", JSON.stringify(log), (err) => {if (err) console.error(err);});
}
}


if(message.content.startsWith(prefix + "config")){
  if(message.channel.name != 'bot-commandes'){
            return message.reply("Veuillez faire ces commandes dans <#395714064090791938>");
}
let response = `**Prefix serveur**\n > \`${prefix}\`\n\n` // This is the first line, make sure to use \n for new lines
    response += `**AutoRole serveur**\n > \`${autoRole}\`\n\n` // Now, lets send the embed using the new function we made earlier.//
    response += `**Channel logs**\n > \`${logs}\`\n\n` 
    message.channel.send({embed: {
  color: 3447003,
  description: response
}});
}

var mention = "<@401535970945662986>";     
if (message.content.startsWith("<@401535970945662986>")) {
message.reply("Oui? pour voir la liste de mes commandes utilise `&help` :D");
}

  if (message.content.startsWith("test")) {
  message.react("✅"); 

}

           if (message.content.startsWith(prefix + "ping")) {
if(message.channel.name != 'bot-commandes'){
            return message.reply("Veuillez faire ces commandes dans <#395714064090791938>");
}
message.channel.send("pong = wait...").then(msg => msg.edit(`**pong :ping_pong: = ${Math.round(client.ping).toFixed(0)}ms**`));
} 
          

     
});


    client.on("message", message => {
    const dmchannel = client.channels.find("name", "robots-staff");
    if (message.channel.type === "dm") {
        if (message.author.id === client.user.id) return;
        dmchannel.send(`**${message.author.tag} (${message.author.id})** : \n\n\`\`\`${message.content}\`\`\``);
        message.reply(`Merci pour votre message! Notre équipe du staff vous répondra dans les plus brefs délais.`);
    }
    if (message.channel.bot) return;



});

client.on('guildMemberAdd', member => {
  let log = JSON.parse(fs.readFileSync("./logs.json", "utf8"));
var defaultlogchannel = 'logs';
var logs;
if(log[member.guild.id]){
var logs = log[member.guild.id].logs;
}else{
var logs = 'logs';
}
     member.guild.channels.find("name", "join-left").send(`${member} Bienvenue sur **PHP System** ! Contact un membre du staff pour avoir un rôle ! :wink:`);
 const embed = new Discord.RichEmbed()
  .setColor(0x00AE86)
  .setDescription("Joined")
  .setTimestamp()
  .setURL("https://discord.js.org/#/docs/main/indev/class/RichEmbed")
  .addField("Membre",
    ""+  member +"")
  member.guild.channels.find(`name`, `${logs}`).send({embed});
});

client.on('guildMemberRemove', member => {
  let log = JSON.parse(fs.readFileSync("./logs.json", "utf8"));
var defaultlogchannel = 'logs';
var logs;
if(log[member.guild.id]){
var logs = log[member.guild.id].logs;
}else{
var logs = 'logs';
}
         member.guild.channels.find("name", "join-left").send(`${member} viens de partir ! Au revoir :wave: ... Maintenant les choses sérieuse peuvent commencer ! :smirk:`);
 const embed = new Discord.RichEmbed()
  .setColor(0x00AE86)
  .setDescription("Left")
  .setTimestamp()
  .setURL("https://discord.js.org/#/docs/main/indev/class/RichEmbed")
  .addField("Membre",
    ""+  member +"")
  member.guild.channels.find(`name`, `${logs}`).send({embed});
});

client.on('channelCreate', channel => {
    if (channel.type === 'text') return channel.send(`Ce channel viens juste d'être créé`);
});

client.on('channelDelete', channel => {
  let log = JSON.parse(fs.readFileSync("./logs.json", "utf8"));
var defaultlogchannel = 'logs';
var logs;
if(log[channel.guild.id]){
var logs = log[channel.guild.id].logs;
}else{
var logs = 'logs';
}
    const embed = new Discord.RichEmbed()
  .setColor(0x00AE86)
  .setDescription("Suppression d'un channel")
  .setTimestamp()
  .setURL("https://discord.js.org/#/docs/main/indev/class/RichEmbed")
  .addField("Nom du channel",
    "```"+  channel.name +"```")
  /*
   * Inline fields may not display as inline if the thumbnail and/or image is too big.
   */
  .addField("Type de channel", "```"+ channel.type +"```", true)

  channel.guild.channels.find(`name`, `${logs}`).send({embed});
});

client.on("messageDelete",  function(message) {
  let log = JSON.parse(fs.readFileSync("./logs.json", "utf8"));
var defaultlogchannel = 'logs';
var logs;
if(log[message.guild.id]){
var logs = log[message.guild.id].logs;
}else{
var logs = 'logs';
}

if(!message.author.bot){
if(message.guild){
const channel = message.guild.channels.find('name', `${logs}`);
if(!channel) {
return;
}
const embed = new Discord.RichEmbed()
  .setColor(0x00AE86)
  .setDescription("Suppression d'un texte de "+ message.member.user.username)
  .setTimestamp()
  .setURL("https://discord.js.org/#/docs/main/indev/class/RichEmbed")
  .addField("Nom du channel",
    "```"+  message.channel.name +"```")
  /*
   * Inline fields may not display as inline if the thumbnail and/or image is too big.
   */
  .addField("Contenue", "```"+ message.content +"```", true)

  channel.send({embed});
}}
});



client.on("messageUpdate",  (message, oldMessage, newMessage) =>  {
let log = JSON.parse(fs.readFileSync("./logs.json", "utf8"));
var defaultlogchannel = 'logs';
var logs;
if(log[message.guild.id]){
var logs = log[message.guild.id].logs;
}else{
var logs = 'logs';
}

if(!message.author.bot){
if(message.guild){
const channel = message.guild.channels.find('name', `${logs}`);
if(!channel) {
return;
}
const embed = new Discord.RichEmbed()
  .setColor(0x00AE86)
  .setDescription("Edition d'un texte de "+ message.author.username)
  .setTimestamp()
  .setURL("https://discord.js.org/#/docs/main/indev/class/RichEmbed")
  .addField("Avant",
    "```"+  message.content +"```")
  /*
   * Inline fields may not display as inline if the thumbnail and/or image is too big.
   */
  .addField("Après", "```"+ oldMessage +"```", true)

  channel.send({embed});
}}
});



client.on('guildBanAdd',(guild, user) => {
  let log = JSON.parse(fs.readFileSync("./logs.json", "utf8"));
var defaultlogchannel = 'logs';
var logs;
if(log[guild.id]){
var logs = log[guild.id].logs;
}else{
var logs = 'logs';
}
    guild.channels.find(`name`, `${logs}`).send(`${user.username} was just banned!`);
});

client.on('guildBanRemove',(guild, user) => {
  let log = JSON.parse(fs.readFileSync("./logs.json", "utf8"));
var defaultlogchannel = 'logs';
var logs;
if(log[guild.id]){
var logs = log[guild.id].logs;
}else{
var logs = 'logs';
}
    guild.channels.find(`name`, `${logs}`).send(`${user.username} was just unbanned!`);
});
client.login(process.env.BOT_TOKEN);
