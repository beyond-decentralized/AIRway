import { lib } from '@airport/direction-indicator'
import { Client } from './Client'
// import {
//     decryptString,
//     encryptString,
// } from "string-cipher";

const client = lib('client')

client.register(Client)
