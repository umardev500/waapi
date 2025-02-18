import * as dotenvx from '@dotenvx/dotenvx';
import { initGrpcClient } from './config/grpc';
import { startBot } from './startbot';
import { streaming } from './streaming';

dotenvx.config();

initGrpcClient()
    .then(() => {
        startBot();
        streaming();
    })
    .catch(console.error);
