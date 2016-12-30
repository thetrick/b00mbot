'use strict';

const Discord = require('discord.js');
const fs = require('fs');
const b00mbot = new Discord.Client();
const config = require('./config.json');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('raidsignups.db');

b00mbot.on('message', (msg) => {

    if (!msg.content.startsWith(config.commandPrefix))
        return;

    if (msg.author.bot)
        return;

    let args = msg.content.split(" ");
    let command = args[0];
    let subcommand = args[1];

    if (command != '!raid')
        return;

    switch (subcommand) {
        case 'add':
            msg.channel.sendMessage("Raid Add Command!")
            break;
        case 'upd':
            msg.channel.sendMessage("Raid Update Command!")
            break;
        case 'rm':
            msg.channel.sendMessage("Raid Delete Command!")
            break;
        case 'su':
            msg.channel.sendMessage("Raid Sign-up Command!")
            break;
        case 'highscores':
            //var output = '';
            db.each("SELECT * FROM raid_types", function(err, row){
                var output = row.description + " (" + row.code_name + "): " + row.high_score + "\r";
                msg.channel.sendMessage(output);
                console.log(output);
            });
            //msg.channel.sendMessage(output);
            // db.transaction(function(tx){
            //     tx.executeSql('SELECT * FROM raid_types', [], function(tx, results) {
            //         for (var i = 0; i < results.rows.length; i++) 
            //         {
            //             var obj = results.rows.item(i);
            //             msg.channel.sendMessage(obj);
            //         }
            //     });
            // });
            break;
        case 'help':
            msg.channel.sendMessage("Raid Help Command!")
            break;
        default:
            msg.channel.sendMessage("Since you did not enter another command, we will show help information.")
            break;
    }

});

b00mbot.on('ready', () => {
    var today = new Date();
    var current = (today.getMonth() + 1) + "/"
        + today.getDate() + "/"
        + today.getFullYear() + " @ "
        + today.getHours() + ":"
        + today.getMinutes() + ":"
        + today.getSeconds();

    // Database Initialize - raid_types
    db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='raid_types'", function (err, rows) {
        if (err !== null) {
            console.log(err);
        }
        else if (rows === undefined) {
            db.run('CREATE TABLE "raid_types" ( ' +
                '`id` INTEGER PRIMARY KEY AUTOINCREMENT, ' +
                '`code_name` VARCHAR(50) NOT NULL, ' +
                '`description` INTEGER NOT NULL,' +
                '`is_hard_mode` INTEGER NOT NULL DEFAULT 0, ' +
                '`num_tanks` INTEGER NOT NULL DEFAULT 2, ' +
                '`num_healers` INTEGER NOT NULL DEFAULT 2, ' +
                '`num_dps` INTEGER NOT NULL DEFAULT 8, ' +
                '`high_score` INTEGER NOT NULL DEFAULT 0 )', function (err) {
                    if (err !== null) {
                        console.log(err);
                    }
                    else {
                        console.log("SQL Table 'raid_types' initialized.");
                    }
                });
            db.run('INSERT INTO raid_types (code_name, description, num_tanks, num_dps) VALUES (`vAA`, `Aetherian Archive`, 1, 9); ' +
                'INSERT INTO raid_types (code_name, description, is_hard_mode, num_tanks, num_dps) VALUES (`vAA_HM`, `Aetherian Archive HARD MODE`, 1, 1, 9); ' +
                'INSERT INTO raid_types (code_name, description) VALUES (`vSO`, `Sanctum Ophidia`); ' +
                'INSERT INTO raid_types (code_name, description, is_hard_mode) VALUES (`vSO_HM`, `Sanctum Ophidia HARD MODE`, 1); ' +
                'INSERT INTO raid_types (code_name, description, num_tanks, num_dps) VALUES (`vHRC`, `Hel Ra Citadel`, 1, 9); ' +
                'INSERT INTO raid_types (code_name, description, is_hard_mode, num_tanks, num_dps) VALUES (`vHRC_HM`, `Hel Ra Citadel HARD MODE`, 1, 1, 9); ' +
                'INSERT INTO raid_types (code_name, description) VALUES (`vMoL`, `Maw Of Lorkhaj`);' +
                'INSERT INTO raid_types (code_name, description, is_hard_mode) VALUES (`vMoL_HM`, `Maw Of Lorkhaj HARD_MODE`, 1); ', function (err) {
                    if (err !== null) {
                        console.log(err);
                    }
                    else {
                        console.log("SQL Table 'raid_types' reference data has been inserted.");
                    }
                });
        }
        else {
            console.log("SQL Table 'raid_types' already initialized.");
        }
    });

    // Database Initialize - raids
    db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='raids'", function (err, rows) {
        if (err !== null) {
            console.log(err);
        }
        else if (rows === undefined) {
            db.run('CREATE TABLE "raids" ( ' +
                '`id` INTEGER PRIMARY KEY AUTOINCREMENT, ' +
                '`raidtype_id` INTEGER NOT NULL, ' +
                '`name` VARCHAR(255) NOT NULL, ' +
                '`final_score` INTEGER DEFAULT 0,' +
                '`is_active` INTEGER DEFAULT 1, ' +
                '`date_created` TEXT DEFAULT CURRENT_TIMESTAMP, ' +
                '`date_modified` TEXT DEFAULT CURRENT_TIMESTAMP )', function (err) {
                    if (err !== null) {
                        console.log(err);
                    }
                    else {
                        console.log("SQL Table 'raids' initialized.");
                    }
                });
        }
        else {
            console.log("SQL Table 'raids' already initialized.");
        }
    });

    // Database Initialize - raid_users
    db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='raid_users'", function (err, rows) {
        if (err !== null) {
            console.log(err);
        }
        else if (rows === undefined) {
            db.run('CREATE TABLE "raid_users" ( ' +
                '`id` INTEGER PRIMARY KEY AUTOINCREMENT, ' +
                '`raid_id` INTEGER NOT NULL, ' +
                '`user_name` VARCHAR(255) NOT NULL, ' +
                '`raid_role` VARCHAR(50) NOT NULL, ' +
                '`date_created` TEXT DEFAULT CURRENT_TIMESTAMP, ' +
                '`date_modified` TEXT DEFAULT CURRENT_TIMESTAMP )', function (err) {
                    if (err !== null) {
                        console.log(err);
                    }
                    else {
                        console.log("SQL Table 'raid_users' initialized.");
                    }
                });
        }
        else {
            console.log("SQL Table 'raid_users' already initialized.");
        }
    });

    console.log(`b00mbot ${b00mbot.user.id} is reporting for duty... ` + current);
});

b00mbot.on("guildMemberAdd", (member) => {
    console.log(`New User "${member.user.username}" has joined "${member.guild.name}"`);
    member.guild.defaultChannel.sendMessage(`"${member.user.username}" has joined this server.`);
});

b00mbot.login(config.botToken);


