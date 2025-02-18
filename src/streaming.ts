import { getGrpcClient } from './config/grpc';
import { StreamingResponse } from './generated/wa_pb';
import { StreamingHandler } from './handler/streaming-handler';

export const streaming = () => {
    const stream = getGrpcClient().streaming();
    const handler = new StreamingHandler(stream);

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
