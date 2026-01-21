// plugins/group/closeset.js
const { schedules } = require('../../src/lib/scheduler/groupSchedule');

const pluginConfig = {
    name: 'closeset',
    alias: ['setclose'],
    category: 'group',
    description: 'Set jadwal auto close grup',
    usage: '.closeset 22:00',
    isGroup: true,
    isAdmin: true,
    isBotAdmin: true
};

async function handler(m, { args }) {
    if (!args[0]) return m.reply('Contoh: .closeset 22:00');
    if (!/^\d{2}:\d{2}$/.test(args[0])) return m.reply('Format salah (HH:mm)');

    const data = schedules.get(m.chat) || {};
    data.close = args[0];
    data.last = null;
    schedules.set(m.chat, data);

    m.reply(` Auto CLOSE diset jam *${args[0]}*`);
}

module.exports = { config: pluginConfig, handler };