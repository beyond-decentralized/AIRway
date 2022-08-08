import { lib } from '@airport/direction-indicator'
import { IClient, Client } from './Client'
// import {
//     decryptString,
//     encryptString,
// } from "string-cipher";

const client = lib('client')

export const CLIENT = client.token<IClient>({
    class: Client,
    interface: 'IClient',
    token: 'IClient'
})
