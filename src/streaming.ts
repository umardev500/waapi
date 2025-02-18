import { StreamingResponse } from './generated/wa_pb';
import { getStream, getStreamingHandler } from './instance';

export const streaming = () => {
    const stream = getStream();
    const handler = getStreamingHandler();

    stream.on('data', (res: StreamingResponse) => {
        handler.handleData(res);
    });

    stream.on('error', err => {
        console.log('streaming failed', err);
    });

    stream.on('end', () => {
        console.log('streaming ended');
    });
};
