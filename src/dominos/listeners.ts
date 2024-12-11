import { Room } from "colyseus.js";

export function createDominosListeners(room:Room){
    room.onMessage("user-orders", (info:any)=>{
        console.log('user-orders received', info)
    })
}
//