const { schedules } = require('../../src/lib/scheduler/groupSchedule')

const pluginConfig = {

    name: 'openset',

    alias: ['setopen'],

    category: 'group',

    description: 'Set jadwal auto open grup',

    usage: '.openset 08:00',

    isGroup: true,

    isAdmin: true,

    isBotAdmin: true

}

async function handler(m, { args = [] }) {

    if (!args[0]) return m.reply('Contoh: .openset 08:00')

    if (!/^\d{2}:\d{2}$/.test(args[0]))

        return m.reply('Format salah (HH:mm)')

    const data = schedules.get(m.chat) || {}

    data.open = args[0]

    data.last = null

    schedules.set(m.chat, data)

    m.reply(`🔓 Auto OPEN diset jam *${args[0]}*`)

}

module.exports = {

    config: pluginConfig,

    handler

}