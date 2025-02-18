import * as dotenvx from '@dotenvx/dotenvx';
import { initGrpcClient } from './config/grpc';
import { initializeInstance } from './instance';
import { startBot } from './startbot';
import { streaming } from './streaming';

dotenvx.config();

initGrpcClient()
    .then(() => {
        initializeInstance();
        startBot();
        streaming();
    })
    .catch(console.error);
