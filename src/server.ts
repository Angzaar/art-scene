import mitt from "mitt"
import { Room } from "colyseus.js"
import { connect } from "./helpers/connection"
import { addGalleryReservation, moveGalleryElevator, removeGalleryReservationObject } from "./galleries"
import { addNewReservation, clearMainGallery, handleUpdate, initArtGallery, refreshMainGallery, removeReservation } from "./mainGallery"
import { showNotification } from "./ui/NotificationPanel"
import { NOTIFICATION_TYPES } from "./helpers/types"
import { addShopReservation, initShops, moveShopElevator, removeShopReservation, updateShop, updateShops } from "./shops"
import { createLotteryListeners } from "./lottery"
import { createNPC, moveNPC, removeNPC, startWalkingNPC, stopWalkingNPC, updateBones, updateNPC, updateNPCName } from "./npc"
import { addCustomItems, deleteCustomItem, updateCustomItem } from "./custom"
import { handleNPCTabSelection, toggleGridItem } from "./admin"
import { connectToAgentNetwork } from "./eliza"
import resources from "./helpers/resources"
import { createShopAudioEntity } from "./audios"
import { initializeMarketplaceSystem } from "./wearableStore"

export let serverRoom:string = "angzaar_plaza_gallery"
export let lotteryRoom:string = 'angzaar_plaza_lottery'
export let localUserId: string
export let localUser:any
export let data:any
export let colyseusRoom:Room
export let colyseusLottery:Room | undefined

export let connected:boolean = false
export let sessionId:any
export const iwbEvents = mitt()

export function setLocalUserId(userData:any){
    localUserId = userData.userId
    localUser = userData
    console.log('local user is', JSON.stringify(localUser, null, 2))
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
    connect(serverRoom, data, token, world, island).then(async (room: Room) => {
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

            if(code === 4999){

            }
        })
        await createServerListeners(room)

        
        // sendServerMessage('get-art-gallery', {})
        // sendServerMessage('get-custom-items', {})
        // sendServerMessage('get-shops', {})
        initializeMarketplaceSystem(room)

        //lottery connect
        // connect(lotteryRoom, data, token, world, island).then((room: Room) => {
        //     console.log("Connected to lottery room");
        //     colyseusLottery = room
    
        //     room.onLeave((code: number) => {
        //         console.log('left lottery room with code', code)
        //         connected = false
        //         removeLottery()

        //         if(code === 4010){
        //             console.log('user was banned')
        //         }
    
        //         if(code === 4999){
    
        //         }
        //     })
        //     createLotteryListeners(room)
        //     resources.DEBUG ? null : connectToAgentNetwork(data)
        // }).catch((err) => {
        //     console.error('colyseus connection error', err)
        // });
        
        
        // connectToAgentNetwork(data)
    }).catch((err) => {
        console.error('colyseus connection error', err)
    });
}

export function sendServerMessage(type: string, data: any, room?:Room) {
    try{
        let sendRoom:Room
        if(connected){
            sendRoom = room ? room : colyseusRoom
            sendRoom.send(type, data)
        }
    }
    catch(e){
        console.log('error sending message to server', e)
    }
}

function createServerListeners(room:Room){
    mainGalleryListeners(room)
    shopListeners(room)
    customItemListeners(room)
    npcListeners(room)

    room.onMessage("error", (info:any)=>{
        console.log("" + ' received', info)
        showNotification({type:NOTIFICATION_TYPES.MESSAGE, message:info.message, animate:{enabled:true, return:true, time:5}})
    })
}

function mainGalleryListeners(room:Room){
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
}

function shopListeners(room:Room){
    createShopAudioEntity()

    room.onMessage('update-shop', async (info:any)=>{
        console.log('update-shop' + ' received', info)
        updateShop(info)
    })

    room.onMessage('shop-image-update', async (info:any)=>{
        console.log('shop-image-update' + ' received', info)

        // if(!info || !info.userId || info.images){
        //     return
        // }//
        // updateImage(conferenceCenterEntities, info.id, info)//
        updateShop(info)
    })

    room.onMessage('get-shops', async (info:any)=>{
        console.log('get-shops' + ' received', info)
        updateShops(info)
    })

    room.onMessage('new-shop-reservation', async (info:any)=>{
        console.log('new-shop-reservation' + ' received', info)
        addShopReservation(info)
    })

    room.onMessage('cancel-shop-reservation', async (info:any)=>{
        console.log('cancel-shop-reservation' + ' received', info)
        removeShopReservation(info)
    })

    room.onMessage('move-shop-elevator', async (info:any)=>{
        console.log('move-shop-elevator' + ' received', info)
        moveShopElevator(info)
    })
}

function customItemListeners(room:Room){
    room.onMessage('custom-item-update', async (info:any)=>{
        console.log('custom-item-update' + ' received', info)
        updateCustomItem(info)
    })

    room.onMessage('custom-item-add', async (info:any)=>{
        console.log('custom-item-add' + ' received', info)
        addCustomItems([info])
    })

    room.onMessage('custom-item-delete', async (info:any)=>{
        console.log('custom-item-delete' + ' received', info)
        deleteCustomItem(info)
    })  
}

function npcListeners(room:Room){
    room.onMessage('move-npc', async (info:any)=>{
        // console.log('move-npc' + ' received', info)
        // moveNPC(info)//
    })

    room.onMessage('get-custom-items', async (info:any)=>{
        console.log('get-custom-items' + ' received', info)
        addCustomItems(info)
    })

    room.onMessage('npc-toggle-selection', async (info:any)=>{
        console.log('npc-toggle-selection' + ' received', info)
        handleNPCTabSelection(info)
    })

    room.onMessage('toggle-npc-grid', async (info:any)=>{
        console.log('toggle-npc-grid' + ' received', info)
        toggleGridItem(info)
    })
    room.onMessage('npc-stop-walking', async (info:any)=>{
        console.log('npc-stop-walking' + ' received', info)
        stopWalkingNPC(info)
    })

    room.onMessage('npc-update', async (info:any)=>{
        console.log('npc-update' + ' received', info)
        updateNPC(info)
    })

    room.state.npcs.onAdd((npc:any, id:string)=>{
        console.log('new npc added', id, npc)
        createNPC(npc)

        npc.listen("n", (current:any, previous:any)=>{
            if(previous !== undefined){
                updateNPCName(npc)
            }
        })

        npc.listen("hs", (current:any, previous:any)=>{
            if(previous !== undefined){
                updateBones(npc)
            }
        })

        npc.listen("b", (current:any, previous:any)=>{
            if(previous !== undefined){
                updateBones(npc)
            }
        })

        npc.listen('canWalk', (current:any, previous:any)=>{
            console.log('can walk changed', previous, current)
            if(previous !== undefined){
                if(previous){
                    console.log('was walking, need to stop')
                    // stopWalkingNPC(npc)
                }else{
                    console.log('was idle, need to walk')
                    startWalkingNPC(npc)
                }
            }
        })

        npc.listen("sc", (current:any, previous:any)=>{
            console.log(previous, current)
            if(previous !== undefined){
                updateBones(npc)
            }
        })

        npc.listen("hc", (current:any, previous:any)=>{
            console.log(previous, current)
            if(previous !== undefined){
                updateBones(npc)
            }
        })

        npc.listen("ec", (current:any, previous:any)=>{
            console.log(previous, current)
            if(previous !== undefined){
                updateBones(npc)
            }
        })

        npc.wearables.onAdd((wearable:any)=>{
            console.log('wearable added', wearable)
            updateBones(npc)
        })

        npc.wearables.onRemove((wearable:any)=>{
            console.log('wearable removed', wearable)
            updateBones(npc)
        })
    })    

    room.state.npcs.onRemove((npc:any, id:string)=>{
        console.log('npc removed', id, npc)
        removeNPC(npc)//
    })  
}

function removeLottery(){
    colyseusLottery = undefined
}