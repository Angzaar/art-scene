import { Client, Room } from "colyseus.js"
import resources from "./resources"
import { getPlayer } from "@dcl/sdk/players"
import { createDominosListeners } from "./listeners"

export let serverRoom:string = "dominos_room"
export let dominosConnection:boolean = false
export let dominosRoom:Room
export let client:Client

export async function connectDominos(){
    if (dominosConnection) {
        dominosRoom.removeAllListeners()
        dominosRoom.leave(true)
        dominosConnection = false//
    }

    try{
        let player = getPlayer()
        if(!player){
            console.log('error getting player data in dominos')
            return
        }

        let options: any = {}
        options.userId = player.userId
        options.name = player.name

        client = new Client(resources.DEBUG ? resources.endpoints.wsTest : resources.endpoints.wsProd)

        dominosRoom = await client.joinOrCreate(serverRoom, options);

        createDominosListeners(dominosRoom)
    }
    catch(e:any){
        console.log('error connecting to colyseus', e)
    }
}

