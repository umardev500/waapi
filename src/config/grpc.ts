import { WaServiceClient } from '../generated/wa_grpc_pb';
import * as grpc from '@grpc/grpc-js';

let grpcClient: WaServiceClient | null = null;

export const initGrpcClient = async (): Promise<void> => {
    return new Promise((resolve, reject) => {
        const port = process.env.PORT || '50051';
        const address = `0.0.0.0:${port}`;

        console.log(`🔌 Connecting to gRPC Server at ${address}`);
        grpcClient = new WaServiceClient(address, grpc.credentials.createInsecure());
        grpcClient.waitForReady(Date.now() + 5000, err => {
            if (err) {
                reject(err);
            } else {
                console.log(`✅ gRPC Client connected to ${address}`);
                resolve();
            }
        });
    });
};

export const getGrpcClient = (): WaServiceClient => {
    if (!grpcClient) {
        throw new Error('❌ gRPC Client is not initialized. Call initGrpcClient() first.');
    }
    return grpcClient;
};
