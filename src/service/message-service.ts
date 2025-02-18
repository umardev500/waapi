import { getGrpcClient } from '../config/grpc';
import { MessageType } from '../domain/message';
import { Metadata, SendMessageRequest, TextMessage } from '../generated/wa_pb';

export class MessageService {
    constructor() {}

    /**
     * Processes a text message and sends it via gRPC.
     * @param remoteJid The recipient JID.
     * @param messageId The unique message ID.
     * @param pushName Sender's push name.
     * @param timestamp Message timestamp.
     * @param conversation The actual text message content.
     */
    public async processTextMessage(
        remoteJid: string,
        messageId: string,
        pushName: string,
        timestamp: number,
        conversation: string,
    ): Promise<void> {
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

        try {
            // Await the sending process to make sure errors can be caught
            await this.sendMessageToGrpc(req);
        } catch (err) {
            console.error('❌ Failed to send message:', err);
        }
    }

    /**
     * Placeholder function for processing image messages.
     */
    public async processImageMessage() {
        // Future implementation for image message handling
        console.log('📷 Image message processing is not implemented yet.');
    }

    /**
     * Sends a gRPC request to the backend service.
     * @param req The SendMessageRequest object.
     */
    public sendMessageToGrpc(req: SendMessageRequest): Promise<void> {
        return new Promise((resolve, reject) => {
            getGrpcClient().sendMessage(req, (err, res) => {
                if (err) {
                    console.error('❌ gRPC Error:', err.message);
                    reject(err);
                } else {
                    console.log('✅ gRPC Response:', res.toObject());
                    resolve();
                }
            });
        });
    }
}
