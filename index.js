const Discord = require('discord.js');
const client = new Discord.Client()

client.login(process.env.TOKEN)
const prefix = process.env.PREFIX || "!"
const logsChannel = client.channels.cache.find(channel => channel.id === process.env.LOGS)
const ownerName = process.env.OWNER

client.on('ready', () => {
    console.log(`${client.user.tag} ready!`)
    client.user.setActivity(process.env.STATUS, {
        type: "LISTENING"
    })
})

client.on('message', async message => {
    if (!message.content.startsWith(prefix) || message.author.bot || !message.guild) return;
    const args = message.content.slice(prefix.length).trim().split(/ + /g)
    const cmd = args.shift();
    if (cmd === "help") {
        const embed = new Discord.MessageEmbed()
        .setColor('GREEN')
        .setTitle(`${client.user.username}'s Commands`)
        .addField('Ban Command', `${prefix}ban @user`)
        .addField('Kick Command', `${prefix}kick @user`)
        .addField('Purge Command', `${prefix}purge <ammount to delete>`)
        .addField('Unban Command', `${prefix}unban <id>`)
        .addField('Warn Command', `${prefix}warn @user <reason>`)
        .setFooter(`© Bot by ZEN`, message.guild.iconURL())
        message.channel.send(embed)
    }

    if (cmd === "ban") {
        if(!message.member.hasPermission('ADMINISTRATOR' || 'BAN_MEMBERS')) {
            message.channel.send({embed: {color: "RED", description: "🆘  **|**  Sorry, you don't have the permissions to use this command!"}})
            return;
          }
            const user = message.mentions.users.first();
            const reason = args.splice(1).join(' ');
      
            if(message.author.user) return message.channel.send({embed: {color: "RED", description: "🆘  **|**  You can't ban yourself!"}})
      
            if(!reason) return message.channel.send({embed: {color: "RED", description: "🆘  **|**  You need to give a reason!"}})
      
            if(!message.guild.me.hasPermission('BAN_MEMBERS')) {
              message.channel.send({embed: {color: "RED", description: "🆘  **|**  Sorry, I don't have the permissions to use this command!"}})
              return;
            }
      
            
        if (user) {
          
          const member = message.guild.member(user);
         
          if (member) {
            
            member
              .ban({
                reason: `${reason}, banned by ${message.author.tag}`,
              })
              .then(() => {
                
                message.channel.send({embed: {color: "GREEN", description: `✅   **|**  Succesfully banned ${user.tag}. Reason: ${reason}!`}});
                user.send({embed: {color: "GREEN", description: `You were BANNED from **${message.guild.name}** by ${message.author.tag}. Reason: **${reason}**!`}})
              })
              .catch(err => {
                
                message.channel.send({embed: {color: "RED", description: "🆘  **|**  I was unable to ban the member!"}});
          
                console.error(err);
              });
          } else {
       
            message.channel.send({embed: {color: "RED", description: "🆘  **|**  The user isn't in this guild/server!"}});
          }
        } else {
      
          message.channel.send({embed: {color: "RED", description: "🆘  **|**  You didn't mention anyone to ban!"}});
        }
    }
    if (cmd === "kick") {
        const user = message.mentions.users.first();
    if(!message.guild.me.hasPermission('KICK_MEMBERS')) {
      message.channel.send({embed: {color: "RED", description: "🆘  **|**  Sorry but I don't have the permissions to use this command!"}})
      return;
    }

    if(!message.member.hasPermission('ADMINISTRATOR' || 'KICK_MEMBERS')) {
      message.channel.send({embed: {color: "RED", description: "🆘  **|**  Sorry but you don't have the permissions to use this command!"}})
      return;
    }


     if (user) {
  
  const member = message.guild.member(user);

  if (member) {
    
    member
      .kick('Optional reason that will display in the audit logs')
      .then(() => {
       
        message.channel.send({embed: {color: "GREEN", description: `✅   **|**  Succesfully kicked ${user.tag}!`}});
      })
      .catch(err => {
        
        message.channel.send({embed: {color: "RED", description: "🆘  **|**  I was unable to kick the member!"}});
        
        console.error(err);
      });
  } else {
   
    message.channel.send({embed: {color: "RED", description: "🆘  **|**  The user isn't in this guild/server!"}});
  }
  
} else {
  message.channel.send({embed: {color: "RED", description: "🆘  **|**  You didn't mention anyone to kick!"}});
}
    }
    if (cmd === "purge") {
        if (!message.member.hasPermission('MANAGE_MESSAGES')) {
            message.channel.send({ embed: { color: "RED", description: "🆘  **|** Sorry, you dont have the permissions to use this command!" } })
        }else {
        if (!message.guild.me.hasPermission('MANAGE_MESSAGES')) {
            message.channel.send({ embed: { color: "RED", description: "🆘  **|** Sorry, I dont have the permissions to execute this command!" } })
        }else {
        if (!args[0]) {
            message.channel.send({ embed: { color: "RED", description: "🆘  **|** Please give the ammount of messages you want to delete!" } })
        }
        const ammountToDelete = Number(args[0], 10);
      
        if (isNaN(ammountToDelete)) {
            message.channel.send({ embed: { color: "RED", description: "🆘  **|** You have not given a valid number!" } })
        }
        if (!Number.isInteger(ammountToDelete)) {
            message.channel.send({ embed: { color: "RED", description: "🆘  **|** The number given is not a whole number!" } })
        }
        if (!ammountToDelete || ammountToDelete < 2 || ammountToDelete > 100) {
            message.channel.send({ embed: { color: "RED", description: "🆘  **|** The number given must be between 2 and 100!" } })
        }
        const fetched = await message.channel.messages.fetch({
            limit: ammountToDelete
        })
      
        try {
            await message.channel.bulkDelete(ammountToDelete)
                .then(message.channel.send({ embed: { color: "GREEN", description: `✅   **|**  Succesfully deleted **${ammountToDelete}** messages!` } }))
        } catch (err) {
            console.log(err)
            message.channel.send({ embed: { color: "RED", description: "🆘  **|** I was unable to execute te command!" } })
        }
      }
      }
    }
    if (cmd === "unban") {
        let user = client.users.cache.find(user => user.id === args[0])
        if(!message.member.hasPermission('BAN_MEMBERS')) return message.channel.send({embed: {color: "RED", description: "🆘  **|** Sorry, you do not have the permissions to use this command"}})
        if (!message.guild.me.hasPermission('BAN_MEMBERS')) return message.channel.send({embed: {color: "RED", description: "🆘  **|** Sorry, I dont have the permissions to execute this command"}})
        if (!args[0]) return message.channel.send({embed: {color: "RED", description: "🆘  **|** Please provide the id of the person that you want to unban!"}})

        if (!message.guild.fetchBan(user.id)) return message.channel.send({embed: {color: "RED", description: "🆘  **|** The mentioned id is not banned!"}})

        message.guild.members.unban(user.id)
        message.channel.send({embed: {color: "GREEN", description: `✅  **|** Successfully unbanned ${user.tag}`}})
    }
    if (cmd === "warn") {
        if (!message.member.hasPermission('MANAGE_MESSAGES')) return message.channel.send({ embed: { color: "RED", description: "🆘  **|**  Sorry but you don't have the permissions to use this command!" } });

        var user = message.mentions.users.first();
        if (!user) return message.channel.send({ embed: { color: "RED", description: "🆘  **|**  You didn't mention anyone to warn!" } });
        if (user.bot) return message.channel.send({ embed: { color: "RED", description: "🆘  **|**  Bots cannot be warned!" } })
    
    
        var member;
    
        try {
            member = await message.guild.members.fetch(user);
        } catch (err) {
            member = null;
        }
    
        if (!member) return message.channel.send({ embed: { color: "RED", description: "🆘  **|**  The user isn't in this guild/server!" } });
    
        var reason = args.splice(1).join(' ');
        if (!reason) return message.channel.send({ embed: { color: "RED", description: '🆘  **|** You need to give a reason!' } });
    
        var log = new Discord.MessageEmbed()
            .setTitle('User Warned')
            .addField('User:', user, true)
            .addField('By:', message.author, true)
            .addField('Reason:', reason)
        logsChannel.send(log);
    
        var embed = new Discord.MessageEmbed()
            .setTitle('You were warned!')
            .setDescription(reason);
    
        try {
            user.send(embed);
        } catch (err) {
            console.warn(err);
        }
    
        message.channel.send({ embed: { color: "GREEN", description: `**${user}** has been warned by **${message.author}**!` } });
    }
})
client.on('roleCreate', async (role, user) => {
    logsChannel.send(new Discord.MessageEmbed()
    .setColor("GREEN")
    .setTitle('Role Created')
    .setDescription(`${role} was created`)
    .setTimestamp()
    )
})
client.on('roleDelete', async (role, user) => {
    logsChannel.send(new Discord.MessageEmbed()
    .setColor("GREEN")
    .setTitle('Role Deleted')
    .setDescription(`${role} was deleted`)
    .setTimestamp()
    )
})
client.on('guildBanAdd', async (m) => {
    logsChannel.send(new Discord.MessageEmbed()
    .setColor("GREEN")
    .setTitle('Person Ban')
    .setDescription(`A person was banned in this server!`)
    .setTimestamp()
    )
})
client.on('guildBanRemove', () => {
    logsChannel.send(new Discord.MessageEmbed()
    .setColor("GREEN")
    .setTitle('Person Unban')
    .setDescription(`A person was unbanned in this server!`)
    .setTimestamp()
    )
})
client.on('channelCreate', async (channel) => {
    logsChannel.send(new Discord.MessageEmbed()
    .setColor("GREEN")
    .setTitle('Channel Created')
    .setDescription(`A channel was created in this server!, ${channel}`)
    .setTimestamp()
    )
})
client.on('channelDelete', async channel => {
    logsChannel.send(new Discord.MessageEmbed()
    .setColor("GREEN")
    .setTitle('Channel Created')
    .setDescription(`A channel was created in this server!, ${channel}`)
    .setTimestamp()
    )
})
client.on("messageDelete", async (m) => {
    logsChannel.send(new Discord.MessageEmbed()
    .setColor("GREEN")
    .setTitle('Message Deleted')
    .setDescription(`A message was deleted: ${m.content}, message was sent by ${m.author.tag}`)
    .setTimestamp()
    )
})
client.on('messageUpdate', async (m) => {
    logsChannel.send(new Discord.MessageEmbed()
    .setColor("GREEN")
    .setTitle('Message Edited')
    .setDescription(`A message was edited: ${m.content}, message was sent by ${m.author.tag}`)
    .setTimestamp()
    )
})
client.on('messageDeleteBulk', async (m) => {
    logsChannel.send(new Discord.MessageEmbed()
    .setColor("GREEN")
    .setTitle('Messages Bulk delete')
    .setDescription(`Messages were bulk deleted`)
    .setTimestamp()
    )
})