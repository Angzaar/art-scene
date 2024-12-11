import mitt from "mitt"
import { Room } from "colyseus.js"
import { connect } from "./helpers/connection"
import { addGalleryReservation, moveGalleryElevator, removeGalleryReservationObject } from "./galleries"
import { addNewReservation, clearMainGallery, handleUpdate, initArtGallery, refreshMainGallery, removeReservation } from "./mainGallery"
import { showNotification } from "./ui/NotificationPanel"
import { NOTIFICATION_TYPES } from "./helpers/types"

export let serverRoom:string = "angzaar_plaza"
export let localUserId: string
export let localUser:any
export let data:any
export let colyseusRoom:Room

export let connected:boolean = false
export let sessionId:any
export const iwbEvents = mitt()

export function setLocalUserId(userData:any){
    localUserId = userData.userId
    localUser = userData    
    return userData
}

export async function joinServer(world?: any) {
    if (connected) {
        colyseusRoom.removeAllListeners()
        colyseusRoom.leave(true)
        connected = false
    }
    // console.log('colyseusRoom is', colyseusRoom, world, island)
    try{
        await colyseusConnect(localUser)
    }
    catch(e:any){
        console.log('error connecting to colyseus', e)
    }
}

export async function colyseusConnect(data:any, token?:string, world?:any, island?:any) {
    connect(serverRoom, data, token, world, island).then((room: Room) => {
        console.log("Connected!");
        colyseusRoom = room
        sessionId = room.sessionId
        connected = true

        room.onLeave((code: number) => {
            console.log('left room with code', code)
            connected = false
            if(code === 4010){
                console.log('user was banned')
            }
        })
        createServerListeners(room)
        sendServerMessage('get-art-gallery', {})
    }).catch((err) => {
        console.error('colyseus connection error', err)
    });
}

export function sendServerMessage(type: string, data: any) {
    try{
        connected && colyseusRoom.send(type, data)
    }
    catch(e){
        console.log('error sending message to server', e)
    }
}

function createServerListeners(room:Room){
    room.onMessage("error", (info:any)=>{
        console.log("" + ' received', info)
        showNotification({type:NOTIFICATION_TYPES.MESSAGE, message:info.message, animate:{enabled:true, return:true, time:5}})
    })

    room.onMessage("get-art-gallery", (info:any)=>{
        console.log("get-art-gallery" + ' received', info)
        initArtGallery(info)
    })

    room.onMessage('art-gallery-image-update', async (info:any)=>{
        console.log('art-gallery-image-update' + ' received', info)

        // if(!info || !info.userId || info.images){
        //     return
        // }//
        // updateImage(conferenceCenterEntities, info.id, info)//
        handleUpdate(info)
    })

    room.onMessage('refresh-art-gallery', async (info:any)=>{
        console.log('refresh-art-gallery' + ' received', info)
        refreshMainGallery(info)
    })

    room.onMessage('clear-art-gallery', async (info:any)=>{
        console.log('clear-art-gallery' + ' received', info)
        clearMainGallery()
    })

    room.onMessage('cancel-art-gallery-reservation', async (info:any)=>{
        console.log('cancel-art-gallery-reservation' + ' received', info)
        removeReservation(info)
    })

    room.onMessage('new-art-gallery-reservation', async (info:any)=>{
        console.log('new-art-gallery-reservation' + ' received', info)
        addNewReservation(info)
    })
    
    


    // room.state.galleries.onAdd(async(gallery:any, key:string)=>{
    //     console.log('gallery added', gallery)

    //     if(gallery.elevator){
    //         gallery.elevator.listen("y", (current:any, previous:any)=>{
    //             // console.log('gallery elevator change', gallery.id, current)
    //             moveGalleryElevator(gallery.id, current)
    //         })
    //     }

    //     if(!gallery.reservation){
    //         console.log('no reservation, add option to gallery')
    //         addGalleryReservation(gallery.id)
    //     }

    //     gallery.listen("reservation",(current:any, previous:any)=>{
    //         console.log('reservation changed', previous, current)
    //         if(current !== undefined){
    //             removeGalleryReservationObject(gallery.id)
    //         }else{
    //             if(previous !== undefined){
    //                 if(previous.userId === localUserId){
    //                     console.log('user reservation expired')
    //                 }
    //             }
    //             addGalleryReservation(gallery.id)
    //         }
    //     })
    // })
}