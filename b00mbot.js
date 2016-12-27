'use strict';
const Discord = require('discord.js');
const fs = require('fs');
const b00mbot = new Discord.Client();
const config = require('./config.json');

b00mbot.on('message', (msg) => {

    if(!msg.content.startsWith(config.commandPrefix)) 
        return;
    
    if(msg.author.bot)
        return;

    let args = msg.content.split(" ");

    let command = args[0];

    switch(command) {
        case '!raid':
            msg.channel.sendMessage("Raid Command!")
            break;
        case '!dps':
            msg.channel.sendMessage("DPS Command!")
            break;
        case '!tank':
            msg.channel.sendMessage("Tank Command!")
            break;
        case '!heal':
            msg.channel.sendMessage("Heal Command!")
            break;                                                
    }

});

b00mbot.on('ready', () => {
    var today = new Date();
    var current = (today.getMonth()+1) + "/"
                + today.getDate() + "/" 
                + today.getFullYear() + " @ "  
                + today.getHours() + ":"  
                + today.getMinutes() + ":" 
                + today.getSeconds();
    console.log(`b00mbot ${b00mbot.user.id} is reporting for duty... ` + current);
});

b00mbot.on("guildMemberAdd", (member) => {
    console.log(`New User "${member.user.username}" has joined "${member.guild.name}"` );
    member.guild.defaultChannel.sendMessage(`"${member.user.username}" has joined this server.`);
});

b00mbot.login(config.botToken);


