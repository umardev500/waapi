import { MessageUpsertType, WAMessage } from 'baileys';
import { Metadata, SendMessageRequest, TextMessage } from '../generated/wa_pb';
import { getGrpcClient } from '../config/grpc';
import { MessageType } from '../domain/message';

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
        await processTextMessage(key.remoteJid, key.id!, pushName!, messageTimestamp as number, content.conversation);
    } else if (content?.imageMessage) {
        console.log('📷 Image message received, processing...');
        await processImageMessage();
    } else {
        console.log('⚠️ Unsupported message type received.');
    }
};

/**
 * Processes a text message and sends it via gRPC.
 * @param remoteJid The recipient JID.
 * @param messageId The unique message ID.
 * @param pushName Sender's push name.
 * @param timestamp Message timestamp.
 * @param conversation The actual text message content.
 */
const processTextMessage = async (
    remoteJid: string,
    messageId: string,
    pushName: string,
    timestamp: number,
    conversation: string,
) => {
    console.log('📝 Processing text message...');

    const metadata = new Metadata();
    metadata.setType(MessageType.Text);
    metadata.setJid(remoteJid);
    metadata.setId(messageId);
    metadata.setPushname(pushName);
    metadata.setTimestamp(timestamp);

    const textMessage = new TextMessage();
    textMessage.setConversation(conversation);

    const req = new SendMessageRequest();
    req.setMetadata(metadata);
    req.setTextmessage(textMessage);

    sendMessageToGrpc(req);
};

/**
 * Placeholder function for processing image messages.
 */
const processImageMessage = async () => {
    // Future implementation for image message handling
    console.log('📷 Image message processing is not implemented yet.');
};

/**
 * Sends a gRPC request to the backend service.
 * @param req The SendMessageRequest object.
 */
const sendMessageToGrpc = (req: SendMessageRequest) => {
    getGrpcClient().sendMessage(req, (err, res) => {
        if (err) {
            console.error('❌ gRPC Error:', err.message);
            return;
        }
        console.log('✅ gRPC Response:', res.toObject());
    });
};
