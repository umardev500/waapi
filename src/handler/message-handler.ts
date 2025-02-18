import { MessageUpsertType, WAMessage } from 'baileys';
import { getSocket } from '../config/socket';
import { MessageService } from '../service/message-service';

const service = new MessageService();

/**
 * Handles incoming messages from Baileys.
 * @param m Incoming message event.
 */
export const handleMessage = async (m: { messages: WAMessage[]; type: MessageUpsertType; requestId?: string }) => {
    const { messages } = m;

    for (const msg of messages) {
        const { key, messageTimestamp, pushName, message: content } = msg;
        const { remoteJid: jid, fromMe, id } = key;
        if (fromMe || !pushName || !id || !jid) {
            // Logging
            console.log('❌ fromme ', fromMe, ' pushName ', !pushName, ' id ', !id, ' jid ', !jid);

            continue;
        }

        await getSocket()?.presenceSubscribe(jid);
        console.log(`✅ Subscribed to presence updates for ${jid}`);

        if (content?.conversation) {
            await service.processTextMessage(jid, id, pushName, messageTimestamp as number, content.conversation);
        } else if (content?.imageMessage) {
            console.log('📷 Image message received, processing...');
            await service.processImageMessage();
        } else {
            console.log('⚠️ Unsupported message type received.');
        }
    }
};
