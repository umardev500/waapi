import { ClientDuplexStream } from '@grpc/grpc-js';
import { getSocketOrFail } from '../config/socket';
import { StreamingPictureRequest, StreamingRequest, StreamingResponse } from '../generated/wa_pb';

export class StreamingService {
    private stream: ClientDuplexStream<StreamingRequest, StreamingResponse> | null = null;

    constructor(stream: ClientDuplexStream<StreamingRequest, StreamingResponse>) {
        this.stream = stream;
    }

    public async getPicture(res: StreamingResponse) {
        const picture = res.getStreamingpicture()?.toObject();
        const jid = picture?.jid;
        if (!jid) return;

        const streamingReq = new StreamingRequest();
        const streamingPicture = new StreamingPictureRequest();
        let picUrl = '';
        try {
            const socket = getSocketOrFail();
            const url = await socket.profilePictureUrl(jid);
            if (!url) throw new Error('Profile picture url not found');
            picUrl = url;
        } catch (err) {
            console.log('failed to get profile picture url: ', err);
        } finally {
            streamingPicture.setUrl(picUrl);
            streamingReq.setStreamingpicture(streamingPicture);
            this.stream?.write(streamingReq);
        }
    }
}
