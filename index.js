// index.js
// This is a base for a Whatsapp bot, feel free to use it, for help go to the Github Repositorie
// https://github.com/xKenyh/whatsapp-bot-base/

// Packages
require('dotenv').config()
const fs = require('fs');
const qrcode = require('qrcode-terminal');
const { Client } = require('whatsapp-web.js');

// Json
const config = require("./config.json")

// Initialize code
const SESSION_FILE_PATH = "./session.json";

// Number configuration
const country_code = config.country_code;
const number = config.number;

let sessionData;

if(fs.existsSync(SESSION_FILE_PATH)) {
    sessionData = require(SESSION_FILE_PATH);
}

const client = new Client({
    session: sessionData,
});

client.initialize();


// Generate QR Code
client.on('qr', qr => {
    qrcode.generate(qr, {small: true});
});

// Errors on auth
client.on('authenticated', session => {
    sessionData = session;

    fs.writeFile(SESSION_FILE_PATH, JSON.stringify(session), function (err) {
        if(err) {
            console.log(err);
        }
    })
})

client.on('auth_failure', msg => {
    console.error("[Whatsapp Bot] There is an error on the authentication", msg);
})

// Bot ready
client.on('ready', () => {
    console.log("[Whatsapp Bot] The client initialized successfully");
})


// Functions
// Your functions here, example:
// Generates a random number between 1 and 5
function generate_random(){
    var random_number = Math.floor(Math.random() * 12) + 1;
}

// Commands
// Help
client.on('message', async msg => {
    if(msg.body === "/help") {
        client.sendMessage(msg.from, `[Whatsapp Bot] 
        
        /help [Show all commands] 
        /chats [Show number of chats opened]`);
    } 
    
    // Chats
    else if(msg.body === "/chats") {
        const chats = await client.getChats();
        client.sendMessage(msg.from, `The bot has ${chats.length} chats open.`);
    } 
    
    // Group info
    else if (msg.body === '!groupinfo') {
        let chat = await msg.getChat();
        if (chat.isGroup) {
            msg.reply(`
                *Group Details*
                Name: ${chat.name}
                Description: ${chat.description}
                Created At: ${chat.createdAt.toString()}
                Created By: ${chat.owner.user}
                Participant count: ${chat.participants.length}
            `);
        }
    }

    // Your commands
})