import { ClientDuplexStream } from '@grpc/grpc-js';
import { PresenceData } from 'baileys';
import { StreamingPictureRequest, StreamingRequest, StreamingResponse, StreamTypingRequest } from '../generated/wa_pb';
import { StreamingService } from '../service/streaming-service';

export class StreamingHandler {
    private stream: ClientDuplexStream<StreamingRequest, StreamingResponse> | null = null;
    private service: StreamingService | null = null;

    constructor(stream: ClientDuplexStream<StreamingRequest, StreamingResponse>) {
        this.stream = stream;
        this.service = new StreamingService();
    }

    public handleData(data: StreamingResponse) {
        switch (data.getMessageCase()) {
            case StreamingResponse.MessageCase.STREAMINGPICTURE:
                this.getPicture(data);
                break;
            default:
                console.log('Unknown message type');
        }
    }

    private async getPicture(data: StreamingResponse) {
        const req = new StreamingRequest();
        const picReq = new StreamingPictureRequest();
        let picUrl = '';

        try {
            const url = await this.service?.getPicture(data);
            if (!url) throw new Error('Profile picture url not found');
            picUrl = url;
        } catch (err) {
            console.log('failed to get picture: ', err);
        } finally {
            picReq.setUrl(picUrl);
            req.setStreamingpicture(picReq);
            this.stream?.write(req);
            console.log('✅ sent picture: ', picUrl);
        }
    }

    /**
     * Handles presence updates from Baileys.
     * @param update The presence update event.
     */
    public async handlePresense(update: {
        id: string;
        presences: {
            [participant: string]: PresenceData;
        };
    }) {
        const { id, presences } = update;
        const presenceData = presences[id];

        if ('lastSeen' in presenceData) {
            console.log('online status', presences);
            return;
        }

        // Typing status
        this.handleTypingStatus(id, presenceData);
    }

    private async handleTypingStatus(jid: string, presence: PresenceData) {
        try {
            const req = new StreamingRequest();
            const typingReq = new StreamTypingRequest();

            typingReq.setJid(jid);
            typingReq.setTyping(presence.lastKnownPresence == 'composing');

            req.setStreamtyping(typingReq);
            this.stream?.write(req);
        } catch (err) {
            console.log('failed to send typing status: ', err);
        }
    }
}
