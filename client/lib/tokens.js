import { lib } from '@airport/direction-indicator';
import { Client } from './Client';
// import {
//     decryptString,
//     encryptString,
// } from "string-cipher";
const client = lib('client');
export const CLIENT = client.token({
    class: Client,
    interface: 'IClient',
    token: 'IClient'
});
//# sourceMappingURL=tokens.js.map