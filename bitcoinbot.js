//Dependencies
const { Client } = require('discord.js');
const dotenv = require('dotenv');
const axios = require('axios'); 

// Load config
dotenv.config();

const bot = new Client();
let token = String(process.env.BITCOIN_BOT_TOKEN);
let apikey = String(process.env.BITCOIN_BOT_APIKEY);
bot.login(token);

let botobj;
let guildmember;

//Fetch user and member object of bot

bot.on('ready', () => {


    bot.users.fetch('859455923089047562').then((user) => {
        botobj = user;
    
        const guild = bot.guilds.cache.get('859080868626300968');
        guildmember = guild.member(botobj);

    }).catch(console.error);

    let currentprice, change, jsondata, newcurrentprice, newchange, newchangestr, newchangeint;

    //Get pricing data
    setInterval(() => {

        try {
            
            require('axios')
            .get("https://api.nomics.com/v1/currencies/ticker?key="+ apikey +"&ids=BTC&interval=1d&convert=USD&per-page=100&page=1")
            .then(response => jsondata = response.data)

            currentprice = jsondata[0]['price'];
            change = jsondata[0]['1d']['price_change_pct'];

            //Trim price and change strings
            newcurrentprice = currentprice.substring(0,5);
            newchangeint = change * 100;
            newchange = String(newchangeint);
            newchangestr = newchange.substring(0,4);

            //Build up name change for bot
            
            let botname;
            let bear = guildmember.guild.roles.cache.find(r => r.name === "botbear");
            let bull = guildmember.guild.roles.cache.find(r => r.name === "botbull");

            //Positive
            if (newchangeint >= 0) {

                botname = "BTC " + newcurrentprice + " +" + newchangestr + "%";
                guildmember.setNickname(botname);
                try {
                    guildmember.roles.add(bull);
                    guildmember.roles.remove(bear);
                } catch {

                }

            
            //Negative    
            } else {

                botname = "BTC " + newcurrentprice + " " + newchangestr + "%";
                guildmember.setNickname(botname);

                try {
                    guildmember.roles.add(bear);
                    guildmember.roles.remove(bull);
                } catch {
                    
                }

            }

        } catch {}



    }, 3000);

    

});
