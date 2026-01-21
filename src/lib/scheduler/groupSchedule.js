/**
 * Scheduler untuk auto open / close grup dengan debug via WA
 */
const schedules = new Map();
const OWNER = '6285860583601@s.whatsapp.net'; // ganti ke nomor owner lo

/**
 * Memulai scheduler grup
 * @param {import('@whiskeysockets/baileys').AnyWASocket} sock
 * @param {boolean} debugWA aktifkan log via WA
 */
function startGroupScheduler(sock, debugWA = false) {
    console.log('[Scheduler] Group scheduler started');

    setInterval(async () => {
        const now = new Date();
        const hhmm = now.toTimeString().slice(0,5); // HH:MM

        // log tick
        if (debugWA && sock) {
            try {
                await sock.sendMessage(OWNER, { text: `[Scheduler] tick ${hhmm}, mapsize ${schedules.size}` });
            } catch {}
        }

        for (let [chatId, data] of schedules) {
            if (debugWA && sock) {
                try {
                    await sock.sendMessage(OWNER, { text: `[Scheduler][${chatId}] data: ${JSON.stringify(data)}` });
                } catch {}
            }

            try {
                // ---------------- AUTO CLOSE ----------------
                if (data.close && data.close === hhmm && data.last !== `close_${hhmm}`) {
                    if (!sock) continue;

                    try {
                        const groupMeta = await sock.groupMetadata(chatId);

                        if (!groupMeta.announce) {
                            await sock.groupSettingUpdate(chatId, 'announcement');
                            await sock.sendMessage(chatId, { text: `🔒 Grup otomatis ditutup jam *${hhmm}*` });

                            data.last = `close_${hhmm}`;
                            schedules.set(chatId, data);

                            if (debugWA) {
                                await sock.sendMessage(OWNER, { text: `[Scheduler][${chatId}] ✅ Auto CLOSE berhasil jam ${hhmm}` });
                            }
                        } else {
                            // udah tertutup
                            if (debugWA) {
                                await sock.sendMessage(OWNER, { text: `[Scheduler][${chatId}] ⚠️ Auto CLOSE dijalankan tapi grup sudah tertutup` });
                            }
                        }
                    } catch(err) {
                        if (debugWA) {
                            await sock.sendMessage(OWNER, { text: `[Scheduler][${chatId}] ❌ Auto CLOSE gagal: ${err.message}` });
                        }
                    }
                }

                // ---------------- AUTO OPEN ----------------
                if (data.open && data.open === hhmm && data.last !== `open_${hhmm}`) {
                    if (!sock) continue;

                    try {
                        const groupMeta = await sock.groupMetadata(chatId);

                        if (groupMeta.announce) {
                            await sock.groupSettingUpdate(chatId, 'not_announcement');
                            await sock.sendMessage(chatId, { text: `🔓 Grup otomatis dibuka jam *${hhmm}*` });

                            data.last = `open_${hhmm}`;
                            schedules.set(chatId, data);

                            if (debugWA) {
                                await sock.sendMessage(OWNER, { text: `[Scheduler][${chatId}] ✅ Auto OPEN berhasil jam ${hhmm}` });
                            }
                        } else {
                            if (debugWA) {
                                await sock.sendMessage(OWNER, { text: `[Scheduler][${chatId}] ⚠️ Auto OPEN dijalankan tapi grup sudah terbuka` });
                            }
                        }
                    } catch(err) {
                        if (debugWA) {
                            await sock.sendMessage(OWNER, { text: `[Scheduler][${chatId}] ❌ Auto OPEN gagal: ${err.message}` });
                        }
                    }
                }

            } catch (err) {
                if (debugWA) {
                    await sock.sendMessage(OWNER, { text: `[Scheduler][${chatId}] ❌ Unexpected error: ${err.message}` });
                }
            }
        }
    }, 60 * 1000);
}

module.exports = {
    schedules,
    startGroupScheduler
};