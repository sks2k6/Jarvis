/*------------------------------------------------------------------------------------------------------------------------------------------------------


Copyright (C) 2023 Loki - Xer.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
Jarvis - Loki-Xer 


------------------------------------------------------------------------------------------------------------------------------------------------------*/

const plugins = require("../lib/system");
const { System, isPrivate, config } = require("../lib");
const { BOT_INFO, MEDIA_DATA, MENU_FONT } = require("../config");
const { uptime } = require("os");
const { version } = require('../package.json');
const fancy = require('./client/fancy');
const { isUrl } = require('./client/');

async function readMore() {
  const readmore = String.fromCharCode(8206).repeat(4001);
  return readmore;
};

const clockString = (duration) => {
    let seconds = Math.floor((duration / 1000) % 60),
        minutes = Math.floor((duration / (1000 * 60)) % 60),
        hours = Math.floor((duration / (1000 * 60 * 60)) % 24);
    
    hours = hours < 10 ? "0" + hours : hours;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;
    
    return hours + ":" + minutes + ":" + seconds;
};

System({
    pattern: 'menu',
    fromMe: isPrivate,
    dontAddCommandList: true
}, async (message, match) => {
    let [date, time] = new Date().toLocaleString("en-IN", { timeZone: config.TIMEZONE }).split(",");
    let menu = `╭━━━〔 ${BOT_INFO.split(';')[0]} ⁩〕━━━···▸\n┃╭──────────────···▸\n✧│ *ᴏᴡɴᴇʀ :*  ${BOT_INFO.split(';')[1]}\n✧│ *ᴜsᴇʀ :* ${message.pushName.replace(/[\r\n]+/gm, "")}\n✧│ *ᴘʟᴜɢɪɴs :* ${plugins.commands.length}\n✧│ *ᴅᴀᴛᴇ :* ${date}\n✧│ *ᴛɪᴍᴇ :* ${time}\n✧│ *ᴜᴘᴛɪᴍᴇ :* ${clockString(uptime())}\n✧│ *ᴠᴇʀsɪᴏɴ :* ᴠ${version}\n┃╰──────────────···▸\n╰━━━━━━━━━━━━━━━···▸\n\n\n${await readMore()}\n╭━━━━━━━━━━━━━━━···▸\n╽`;
    let cmnd = [], category = [];
    for (const command of plugins.commands) {
        const cmd = command.pattern?.toString().match(/(\W*)([A-Za-züşiğ öç1234567890]*)/)?.[2];
        if (!command.dontAddCommandList && cmd) {
            const type = (command.type || "misc").toUpperCase();
            cmnd.push({ cmd, type });
            if (!category.includes(type)) category.push(type);
        }
    }

    const [typFont, ptrnFont] = MENU_FONT.split(';').map(font => isNaN(font) || parseInt(font) > 35 ? null : font);
    cmnd.sort();
    for (const cmmd of category.sort()) {
        let typ;
        if (typFont && typFont !== '0') {
            typ = await fancy.apply(fancy[parseInt(typFont)-1], cmmd);
        } else {
            typ = cmmd.toUpperCase();
        }
        
        menu += `\n┃  ╭─────────────┅┄▻\n┃  │  *➻ ${typ}*\n┃  ╰┬────────────┅┄▻\n┃  ┌┤`;
        for (const { cmd, type } of cmnd.filter(({ type }) => type === cmmd)) {
            let ptrn;
            if (ptrnFont && ptrnFont !== '0') {
                ptrn = await fancy.apply(fancy[parseInt(ptrnFont)-1], cmd.trim().toUpperCase());
            } else {
                ptrn = cmd.charAt(0).toUpperCase() + cmd.slice(1).toLowerCase();
            }
            menu += `\n┃  │ ‣ ${ptrn}`;
        }
        menu += `\n┃  ╰─────────────···▸`;
    }
    menu += ` ╰━━━━━━━━━━━┈⊷\nmade with ˢᵏˢ`;
    let url = BOT_INFO.split(';')[2];
    let options = BOT_INFO.includes('&gif') ? { gifPlayback: true, caption: menu } : { caption: menu };  
    url = url.replace(/&gif/g, '');
    if (isUrl(url)) await message.sendFromUrl(url, options);
    else await message.send(menu);
});

System({
    pattern: "list",
    fromMe: isPrivate,
    dontAddCommandList: true
}, async (message, match) => {
    if (match === "cmd") return;
    let menu = "\nsks\n\n";
    let cmnd = plugins.commands.filter(command => !command.dontAddCommandList && command.pattern);
    cmnd = cmnd.map(command => ({
        cmd: command.pattern.toString().match(/(\W*)([A-Za-züşiğ öç1234567890]*)/)[2],
        desc: command.desc || false
    }));
    cmnd.sort((a, b) => a.cmd.localeCompare(b.cmd));
    cmnd.forEach(({ cmd, desc }, num) => {
        menu += `*${(num + 1)}. ${cmd.trim()}*\n${desc ? `*use: ${desc}*\n\n\n` : '\n\n'}`;
    });
    if (MEDIA_DATA) {
        const [title, body, thumbnail] = MEDIA_DATA.split(";");
        await message.send(menu, { contextInfo: { externalAdReply: { title, body, thumbnailUrl: thumbnail, renderLargerThumbnail: true, mediaType: 1, mediaUrl: '', sourceUrl: "https://github.com/Loki-Xer/Jarvis-md", showAdAttribution: true } } });
    } else {
        await message.send(menu);
    }
});
