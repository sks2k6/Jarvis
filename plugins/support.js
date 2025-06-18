/*------------------------------------------------------------------------------------------------------------------------------------------------------


Copyright (C) 2023 Loki - Xer.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
Jarvis - Loki-Xer 


------------------------------------------------------------------------------------------------------------------------------------------------------*/

const { System, isPrivate } = require("../lib/");
const { getJson, getBuffer, sleep } = require('./client/');
    
System({
    pattern: "help",
    fromMe: isPrivate,
    desc: "sks support",
    type: "support"
}, async (message) => {
    const name = 'SY4M', title = "ꪶ٭𝑺𝜥𝑺 𝐵𝜣𝑇٭ꫂ", number = '919888280858', body = "syam.fun";
    const image = "https://cdn.ironman.my.id/q/NDdju.jpg", sourceUrl = 'https://sy4m.vercel.app';
    const logo = await getBuffer(image);
    const vcard = `BEGIN:VCARD\nVERSION:3.0\nFN:${name}\nORG: powered by Jarvis-md;\nTEL;type=CELL;type=VOICE;waid=${number}:${number}\nEND:VCARD`;
    const adon = { title, body, thumbnail: logo, mediaType: 1, mediaUrl: sourceUrl, sourceUrl, showAdAttribution: true, renderLargerThumbnail: false };
    await message.send({ displayName: name, contacts: [{ vcard }] }, { contextInfo: { externalAdReply: adon }, quoted: message }, "contacts");
});

System({
    pattern: "allplugin",
    fromMe: isPrivate,
    desc: "To get all plugin of jarvis-md",
    type: "support"
}, async (message) => {
    const { result: allPluginsData } = await getJson(api + 'bot/plugin?query=allplugin');
    const { result: externalPluginsData } = await getJson(api + 'bot/plugin?query=pluginlist');
    const formatPluginData = (pluginData) => {
        return Object.entries(pluginData).map(([key, value]) => `*${key}:* ${value.url}`).join('\n\n');
    };
    await message.send(formatPluginData(externalPluginsData), { quoted: message, contextInfo: { externalAdReply: { title: "External plugins no need to edit", body: "Ready to use", thumbnail: { url: "https://graph.org/file/30ab5e1e228a9636ce7f5.jpg" }, mediaType: 1, mediaUrl: 'https://github.com/IRON-M4N/Jarvis-MD-Plugins/tree/main', sourceUrl: "https://github.com/IRON-M4N/Jarvis-MD-Plugins/tree/main", showAdAttribution: true } } });
    await sleep(500);
    await message.send(formatPluginData(allPluginsData), { quoted: message, contextInfo: { externalAdReply: { title: "External plugins need to edit", body: "Ready to use", thumbnail: { url: "https://graph.org/file/30ab5e1e228a9636ce7f5.jpg" }, mediaType: 1, mediaUrl: 'https://github.com/IRON-M4N/Jarvis-MD-Plugins/tree/main', sourceUrl: "https://github.com/IRON-M4N/Jarvis-MD-Plugins/tree/main", showAdAttribution: true } } });
});
