import { WASocket } from 'baileys';

let sock: WASocket | null = null;

export const setSocket = (socket: WASocket) => {
    sock = socket;
};

export const getSocket = (): WASocket | null => sock;

export const getSocketOrFail = (): WASocket => {
    if (!sock) throw new Error('Socket not initialized');
    return sock;
};
