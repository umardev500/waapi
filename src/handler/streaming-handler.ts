import { getGrpcClient } from '../config/grpc';
import { StreamingResponse } from '../generated/wa_pb';
import { StreamingService } from '../service/streaming-service';

export const streaming = () => {
    const stream = getGrpcClient().streaming();
    const streamingService = new StreamingService(stream);

    stream.on('data', (res: StreamingResponse) => {
        switch (res.getMessageCase()) {
            case StreamingResponse.MessageCase.STREAMINGPICTURE:
                streamingService.getPicture(res);
                break;
            default:
                console.log('Unknown message type');
        }
    });

    stream.on('error', err => {
        console.log('streaming failed', err);
    });

    stream.on('end', () => {
        console.log('streaming ended');
    });
};
