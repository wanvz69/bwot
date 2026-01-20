const schedules = new Map()
// groupId => { open, close, last }

function startGroupScheduler(sock) {
    setInterval(async () => {
        const now = new Date()
        const timeNow = now.toTimeString().slice(0, 5)

        for (const [groupId, s] of schedules.entries()) {
            try {
                if (s.last === timeNow) continue

                if (s.open === timeNow) {
                    await sock.groupSettingUpdate(groupId, 'not_announcement')
                    await sock.sendMessage(groupId, {
                        text: '🔓 *AUTO OPEN*\nGrup dibuka sesuai jadwal ⏰'
                    })
                    s.last = timeNow
                }

                if (s.close === timeNow) {
                    await sock.groupSettingUpdate(groupId, 'announcement')
                    await sock.sendMessage(groupId, {
                        text: '🔒 *AUTO CLOSE*\nGrup ditutup sesuai jadwal 🌙'
                    })
                    s.last = timeNow
                }
            } catch (e) {
                console.log('Scheduler error:', e.message)
            }
        }
    }, 30_000)
}

module.exports = { schedules, startGroupScheduler }