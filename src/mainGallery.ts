import { engine, Entity, InputAction, Material, MeshCollider, MeshRenderer, NftFrameType, NftShape, PointerEvents, pointerEventsSystem, PointerEventType, Transform, VideoPlayer, VisibilityComponent } from "@dcl/sdk/ecs"
import { Vector3, Quaternion, Color4 } from "@dcl/sdk/math"
import * as npc from 'dcl-npc-toolkit'
import { galleryLocations } from "./helpers/resources"
import { addBuilderHUDAsset } from "./dcl-builder-hud"
import { utils } from "./helpers/libraries"
import { LAYER_1, NO_LAYERS } from "@dcl-sdk/utils"
import { BLOCKCHAINS, NFT_FRAMES, NFT_TYPES, NOTIFICATION_TYPES } from "./helpers/types"
import { localUserId } from "./server"
import { showLogo } from "./ui/logo"
import { showReservationAdminPanel, updateLocations } from "./ui/reservationAdmin"
import { welcomeDialog, alreadyPanel } from "./dialogs"
import { showDialogPanel } from "./ui/DialogPanel"
import { showNotification } from "./ui/NotificationPanel"


export let reservations:any[] = []
export let galleryReservation:any
export let userReservation:any
export let entities:Map<number, any> = new Map()
export let editEntities:Map<number, any> = new Map()
export let videoEntity:Entity

export function addNewReservation(res:any){
    if(!res){
        return
    }

    reservations.push(res)

    if(res.ethAddress === localUserId){
        setUserReservation(res)
        showLogo(true)
        showNotification({type:NOTIFICATION_TYPES.MESSAGE, message: "Your reservation has been confirmed! Edit your images, video, and audio from the Angzaar icon in the top right.", animate:{enabled:true, return:true, time:10}})
        setUserImages({user:res})
    }
}

export function removeReservation(id:string){
    let resIndex = reservations.findIndex((res:any)=> res.id === id)
    if(resIndex < 0){
        return
    }

    reservations.splice(resIndex, 1)

    if((userReservation || userReservation !== undefined) && userReservation.id === id){
        console.log('has user reservation to cancel')
        userReservation = undefined
        showLogo(false)
        showNotification({type:NOTIFICATION_TYPES.MESSAGE, message: "Your reservation has been cancelled!", animate:{enabled:true, return:true, time:5}})
        editEntities.forEach((config:any, id:number)=>{
            VisibilityComponent.createOrReplace(config.ent, {visible:false})
            VisibilityComponent.createOrReplace(config.parent, {visible:false})
        })
    }

    if(galleryReservation && galleryReservation.id === id){
        console.log('has current reservation to cancel')
        galleryReservation = undefined
        clearMainGallery()
    }
}

export function setUserReservation(res:any){
    userReservation = res
}

export async function initArtGallery(info:any){
    reservations = info.reservations
    await createEntities()
    await createEditEntities()
    // await createVideo()
    await createNPCWelcome()

    refreshMainGallery(info)
}
function createNPCWelcome(){
    // let avatar = engine.addEntity()
	// Transform.create(avatar, {position: Vector3.create(4.9,.1, 66.88), rotation:Quaternion.fromEulerDegrees(0,210,0)})
	// AvatarShape.create(avatar, {
	// 	id:'SR',
	// 	name:"Conference",
	// 	wearables:["urn:decentraland:matic:collections-v2:0x327aeb54030201d79a2ea702332e2c57d76bb1d5:11"],
	// 	emotes:[]
	// })

    npc.create(
		{
			position: Vector3.create(43.16, 0,13.88),
			rotation: Quaternion.fromEulerDegrees(0,180,0),
			scale: Vector3.create(1, 1, 1),
		},
		//NPC Data Object
		{
			type: npc.NPCType.CUSTOM,
			model: 'assets/056d4d2f-d215-4368-9835-39de396690ef.glb',
			coolDownDuration:2,
            faceUser:true,
            onlyETrigger:true,
            idleAnim:'idle',
			onActivate: () => {
                showDialogPanel(true, {dialogs:!userReservation || userReservation !== undefined ? welcomeDialog : alreadyPanel})
			},
            onWalkAway: () => {
                showDialogPanel(false)
            },
		}
	)

}

function createEntities(){
    // utils.triggers.enableDebugDraw(true)
    for(let i = 0; i < galleryLocations.length; i++){
        let ent = engine.addEntity()
        let parent = engine.addEntity()
        let location = {...galleryLocations[i]}
        location.ent = ent
        location.parent = parent
        location.v = false
        entities.set(location.id, location)

        VisibilityComponent.create(parent, {visible:false})
        VisibilityComponent.create(ent, {visible:false})
        // MeshRenderer.setPlane(parent)

        Transform.create(parent, {position: location.position, rotation:location.rotation, scale:location.scale})
        Transform.create(ent, {parent:parent})
        // addBuilderHUDAsset(parent, location.label)
        


        // if(location.trigger){
        //     utils.triggers.addTrigger(ent, NO_LAYERS, LAYER_1, [{type:'box', position: Vector3.create(0,0,-1), scale: location.trigger}],
        //         ()=>{},
        //         ()=>{}
        //     )
        // }
    }
}

function createEditEntities(){
    for(let i = 0; i < galleryLocations.length; i++){
        let ent = engine.addEntity()
        let parent = engine.addEntity()
        let location = {...galleryLocations[i]}
        location.ent = ent
        location.parent = parent
        location.v = false
        editEntities.set(location.id, location)

        VisibilityComponent.create(parent, {visible:false})
        VisibilityComponent.create(ent, {visible:false})

        Transform.create(parent, {position: location.position, rotation:location.rotation, scale:location.scale})
        Transform.create(ent, {parent:parent})
    }
}

export function clearMainGallery(){
    entities.forEach((config:any, id:number)=>{
        if(VideoPlayer.has(config.ent)){
            VideoPlayer.getMutable(config.ent).playing = false
        }

        if(VideoPlayer.has(config.parent)){
            VideoPlayer.getMutable(config.parent).playing = false
        }

        VisibilityComponent.createOrReplace(config.parent, {visible:false})
        VisibilityComponent.createOrReplace(config.ent, {visible:false})
        removeVisibleComponents(config)
    })
}

export function refreshMainGallery(info:any){
    if(info.current){
        galleryReservation = info.current
        info.current.images.forEach((config:any)=>{
            let location:any = entities.get(config.id)//
            if(!location){
                console.log('couldnt update location', config.id)
                return
            }

            location = {
                ...location,
                ...config
            }

            entities.set(location.id, location)

            // if(config.v){
                updateLocationMaterial(location)
                VisibilityComponent.createOrReplace(location.parent, {visible:config.v})
                VisibilityComponent.createOrReplace(location.ent, {visible:config.v})    
            // }
        })
    }

    if(info.user && info.user.ethAddress === localUserId){
        setUserReservation(info.user)
        showLogo(true)
        setUserImages(info)
    }else{
        showLogo(false)
    }
}

function setUserImages(info:any){
    info.user.images.forEach((config:any)=>{
        let location:any = editEntities.get(config.id)
        if(!location){
            console.log('couldnt update location', config.id)
            return
        }

        location = {
            ...location,
            ...config
        }

        editEntities.set(location.id, location)

        VisibilityComponent.createOrReplace(location.parent, {visible:false})
        VisibilityComponent.createOrReplace(location.ent, {visible:false})
    })
}

export function handleUpdate(info:any){
    if((galleryReservation || galleryReservation !== undefined) && galleryReservation.id === info.reservationId){
        console.log('update curren reservation')
        let image = info.reservationImage

        let location:any = entities.get(image.id)
        if(!location){
            console.log('couldnt update location', image.id)
            return
        }

        for(let key in image){
            if(location.hasOwnProperty(key)){
                location[key] = image[key]
            }
        }

        // if(image.v){
            updateLocationMaterial(location)
            VisibilityComponent.createOrReplace(location.parent, {visible:image.v})
            VisibilityComponent.createOrReplace(location.ent, {visible:image.v})    
        // }

    }

    if((userReservation || userReservation !== undefined) && userReservation.id === info.reservationId){
        console.log('update user reservation')
        let image = info.reservationImage

        let location:any = editEntities.get(image.id)
        if(!location){
            console.log('couldnt update location', image.id)
            return
        }
    
        for(let key in image){
            if(location.hasOwnProperty(key)){
                location[key] = image[key]
            }
        }

        // if(image.v){
            updateLocationMaterial(location)
            VisibilityComponent.createOrReplace(location.parent, {visible:image.v})
            VisibilityComponent.createOrReplace(location.ent, {visible:image.v})    
        // }
        updateLocations(true)
    }
}

function removeVisibleComponents(info:any){
        // Transform.create(ent, {parent:parent})
        VideoPlayer.deleteFrom(info.parent)

        MeshRenderer.deleteFrom(info.parent)
        MeshRenderer.deleteFrom(info.ent)
    
        MeshCollider.deleteFrom(info.parent)
        MeshCollider.deleteFrom(info.ent)
    
        NftShape.deleteFrom(info.parent)
        NftShape.deleteFrom(info.ent)
    
        // PointerEvents.deleteFrom(info.parent)
        // PointerEvents.deleteFrom(info.ent)
    
        pointerEventsSystem.removeOnPointerDown(info.parent)
        pointerEventsSystem.removeOnPointerDown(info.ent)
}

export function updateLocationMaterial(info:any){
    removeVisibleComponents(info)

    if(!info.v){
        return
    }

    switch(info.t){
        case 0:
        if(info.b !== 22){
            NftShape.createOrReplace(info.parent, {
                urn: 'urn:decentraland:ethereum:erc721:0x06012c8cf97bead5deae237070f9587f8e7a266d:558536',
                style: info.b
            })
            Transform.createOrReplace(info.ent, {parent:info.parent, scale:Vector3.create(0.5,0.5,0.5), position:Vector3.create(0,0,-.02)})    
            
            MeshRenderer.setPlane(info.ent)
            MeshCollider.setPlane(info.ent)

            Material.setPbrMaterial(info.ent, {
                texture: Material.Texture.Common({
                    src: '' + info.src,
                }),
                emissiveColor:Color4.White(),
                emissiveIntensity:1,
                emissiveTexture:Material.Texture.Common({
                    src: '' + info.src,
                }),
            })

            if(info.c){
                pointerEventsSystem.onPointerDown({entity:info.ent, opts:{
                    button:InputAction.IA_POINTER, hoverText:info.ti + " info", showFeedback:true, showHighlight:true, maxDistance:10
                }},
                    ()=>{
                        console.log('clicked on location', info)
                    }
                ) 
            }

        }else{
            MeshRenderer.setPlane(info.parent)
            MeshCollider.setPlane(info.parent)

            Material.setPbrMaterial(info.parent, {
                texture: Material.Texture.Common({
                    src: '' + info.src,
                }),
                emissiveColor:Color4.White(),
                emissiveIntensity:1,
                emissiveTexture:Material.Texture.Common({
                    src: '' + info.src,
                }),
            })

            if(info.c){
                pointerEventsSystem.onPointerDown({entity:info.parent, opts:{
                    button:InputAction.IA_POINTER, hoverText:info.ti + " info", showFeedback:true, showHighlight:true, maxDistance:10
                }},
                    ()=>{
                        console.log('clicked on location', info)
                    }
                )   
            }
        }
            break;

        case 1://video
        if(info.b && info.b !== 22){
            console.log(Object.values(NFT_FRAMES)[info.b])
            console.log('no border on image')
            NftShape.createOrReplace(info.parent, {
                urn: 'urn:decentraland:ethereum:erc721:0x06012c8cf97bead5deae237070f9587f8e7a266d:558536',
                style: info.b
            })
            Transform.createOrReplace(info.ent, {parent:info.parent, scale:Vector3.create(0.5,0.5,0.5), position:Vector3.create(0,0,-.02)})    
        }
        MeshRenderer.setPlane(info.ent)
        Material.setPbrMaterial(info.ent, {
            texture: Material.Texture.Common({
                src: '' + info.src,
            }),
            emissiveColor:Color4.White(),
            emissiveIntensity:1,
            emissiveTexture:Material.Texture.Common({
                src: '' + info.src,
            }),
        })
            break;

        case 2://nft
            console.log('creating nft')
            NftShape.createOrReplace(info.parent, {
                urn: generateNFTURN(info.nft),
                color:Color4.White(),
                style: info.b
            })

            MeshCollider.setPlane(info.parent)

            if(info.c){
                pointerEventsSystem.onPointerDown({entity:info.parent, opts:{
                    button:InputAction.IA_POINTER, hoverText:info.ti + " info", showFeedback:true, showHighlight:true, maxDistance:10
                }},
                    ()=>{
                        console.log('clicked on location', info)
                    }
                ) 
            }

            break;
    }
}

function generateNFTURN(nft:any){
    let urn = "urn:decentraland"

    urn += ":" + Object.values(BLOCKCHAINS)[nft.b]
    urn += ":" + Object.values(NFT_TYPES)[nft.p]

    // switch(nft.b){
    //     case 0:
    //         urn += ":ethereum"
    //         break;

    //     case 1:
    //         urn += ":matic"
    //         break;
    // }

    // switch(nft.p){
    //     case 0:
    //         urn += ":erc721"
    //         break;

    //     case 1:
    //         urn += ":erc1155"
    //         break;
    // }

    urn += ":" + nft.c + ":" + nft.tid
    console.log('nft urn is', urn)
    return urn
}