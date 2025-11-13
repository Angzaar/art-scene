import {Client} from "colyseus.js";
import resources from '../helpers/resources'
import {log} from "./functions";
import { getRealm } from "~system/Runtime";

export let client:Client

export async function connect(roomName: string, userData: any, token?: string, world?:any, island?:any, localConfig?:any, endpoint?:any) {
    let realm = await getRealm({})
    let options: any = {}
    options.userId = userData.userId
    options.name = userData.name
    options.world = world ? world : "iwb"
    options.island = island ? island : "world"
    options.localConfig = localConfig
    options.realm = realm.realmInfo?.baseUrl
    
    client = new Client(endpoint? endpoint : resources.DEBUG ? resources.endpoints.wsTest : resources.endpoints.wsProd)
    try {
        return await client.joinOrCreate(roomName, options);
    } catch (e:any) {
        log('error connecting colyseus', e)
        if(e.code === 400){
            console.log('you are banned!')
        }
        throw e;
    }
}
