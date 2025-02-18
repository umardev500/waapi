import { Boom } from '@hapi/boom';
import makeWASocket, { DisconnectReason, useMultiFileAuthState } from 'baileys';
import { setSocket } from './config/socket';
import { handleMessage } from './handler/message-handler';
import { getStreamingHandler } from './instance';

export const startBot = async (reconnect: boolean = false) => {
    if (reconnect) console.log('🔁 Reconnecting...');

    const { state, saveCreds } = await useMultiFileAuthState('./session');
    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: true,
    });

    setSocket(sock);

    sock.ev.on('creds.update', saveCreds);
    sock.ev.on('messages.upsert', handleMessage);
    sock.ev.on('connection.update', update => {
        const { connection, lastDisconnect } = update;
        if (connection === 'close') {
            const shouldReconnect = (lastDisconnect?.error as Boom)?.output?.statusCode === DisconnectReason.loggedOut;

            if (shouldReconnect) startBot(true);
        } else if (connection === 'open') {
            console.log('✅ Connected to WhatsApp');
        }
    });
    sock.ev.on('presence.update', update => getStreamingHandler().handlePresense(update));
};
