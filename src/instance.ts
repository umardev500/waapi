import { ClientDuplexStream } from '@grpc/grpc-js';
import { getGrpcClient } from './config/grpc';
import { StreamingRequest, StreamingResponse } from './generated/wa_pb';
import { StreamingHandler } from './handler/streaming-handler';

// export const provideStreamingHandler = new StreamingHandler(stream);

let provideStreamingHandler: StreamingHandler | null = null;
let provideStream: ClientDuplexStream<StreamingRequest, StreamingResponse> | null = null;

export const initializeInstance = () => {
    provideStream = getGrpcClient().streaming();
    provideStreamingHandler = new StreamingHandler(provideStream);
};

export const getStreamingHandler = (): StreamingHandler => {
    if (!provideStreamingHandler) throw new Error('Streaming handler not initialized');
    return provideStreamingHandler;
};

export const getStream = (): ClientDuplexStream<StreamingRequest, StreamingResponse> => {
    if (!provideStream) throw new Error('Stream not initialized');
    return provideStream;
};
