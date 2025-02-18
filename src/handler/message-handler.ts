import { MessageUpsertType, WAMessage } from 'baileys';
import { MessageService } from '../service/message-service';

const service = new MessageService();

/**
 * Handles incoming messages from Baileys.
 * @param m Incoming message event.
 */
export const handleMessage = async (m: { messages: WAMessage[]; type: MessageUpsertType; requestId?: string }) => {
    const message = m.messages[0];
    const { key, messageTimestamp, pushName, message: content } = message;

    if (!key?.remoteJid) {
        console.warn('⚠️ Message received without a valid remote JID.');
        return;
    }

    if (content?.conversation) {
        await service.processTextMessage(
            key.remoteJid,
            key.id!,
            pushName!,
            messageTimestamp as number,
            content.conversation,
        );
    } else if (content?.imageMessage) {
        console.log('📷 Image message received, processing...');
        await service.processImageMessage();
    } else {
        console.log('⚠️ Unsupported message type received.');
    }
};
