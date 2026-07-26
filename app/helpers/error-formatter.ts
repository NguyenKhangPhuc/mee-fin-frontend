export const formatErrorString = (msg: any, fallback: string): string => {
    if (typeof msg === 'string') return msg;
    if (Array.isArray(msg)) {
        return msg.map((m: any) => (typeof m === 'object' && m ? m.message || JSON.stringify(m) : String(m))).join('; ');
    }
    if (typeof msg === 'object' && msg !== null) {
        return msg.message || JSON.stringify(msg);
    }
    return fallback;
};
