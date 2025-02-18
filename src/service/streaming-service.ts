import { getSocketOrFail } from '../config/socket';
import { StreamingResponse } from '../generated/wa_pb';

export class StreamingService {
    constructor() {}

    public async getPicture(res: StreamingResponse): Promise<string | undefined> {
        const picture = res.getStreamingpicture()?.toObject();
        const jid = picture?.jid;
        if (!jid) return;

        const socket = getSocketOrFail();
        const url = await socket.profilePictureUrl(jid);

        if (!url) throw new Error('Profile picture url not found');

        return url;
    }
}
