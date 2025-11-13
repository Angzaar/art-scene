import { AudioStream, AvatarAnchorPointType, AvatarAttach, AvatarShape, Billboard, BillboardMode, ColliderLayer, EasingFunction, engine, Entity, GltfContainer, InputAction, MeshCollider, MeshRenderer, pointerEventsSystem, TextShape, Transform, Tween, VisibilityComponent } from "@dcl/sdk/ecs"
import resources, { AspectRatioSizes, MainBannerSizes, models, storeConfigs, storeImageLocations, storeMannequins } from "./helpers/resources"
import { Color4, Quaternion, Vector3 } from "@dcl/sdk/math"
import { LAYER_1, NO_LAYERS } from "@dcl-sdk/utils"
import { utils } from "./helpers/libraries"
import { localUserId, sendServerMessage } from "./server"
import { showLogo } from "./ui/logo"
import { NOTIFICATION_TYPES } from "./helpers/types"
import { showNotification } from "./ui/NotificationPanel"
import { updateLocationMaterial } from "./mainGallery"
import { selectedMannequin, updateEditMannequin, updateLocations } from "./ui/shopReservationAdmin"
import * as npc from 'dcl-npc-toolkit'
import { showDialogPanel } from "./ui/DialogPanel"
import { alreadyPanel, shopWelcomeDialog, welcomeDialog } from "./dialogs"
import { displayMannequinPanel } from "./ui/mannequinInfoPanel"
import { startAudio, stopAudio, updateAudio } from "./audios"

export let shops:Map<number,any> = new Map()
// export let editShops:Map<number, any> = new Map()
export let userShopReservation:any
export let moving = 1

let elevator:any
let storeCount = 1

// utils.triggers.enableDebugDraw(true)

export function setUserShopReservation(res:any){
    userShopReservation = res
}

export function addShop(item:any, name:string, transform:any, parent:Entity){
    if(storeCount === 18 || storeCount === 19){
        engine.removeEntity(parent)
        storeCount++
        return
    }

    if(name.toLowerCase().includes("storefront")){
        let id = storeCount

        let address = engine.addEntity()
        Transform.create(address, {parent:parent, position:Vector3.create(5.9,5.8,7.15), rotation:Quaternion.fromEulerDegrees(0,180,0)})
        TextShape.create(address, {text:"" + storeCount, fontSize:10, textColor:Color4.create(1,0,1,1)})

        let mannequins:any[] = []
        storeMannequins.forEach((manConfig:any, i:number)=>{
            let mannequin = engine.addEntity()
            let click = engine.addEntity()
            let manInfo:any =  {click:click, entity:mannequin, b:"F",v:true, id:(i), name:"Mannequin " + (i+1), wearables:[], emotes:[],skinColor:{r:0.6, g:0.3, b:0.2}, eyeColor:{r:0.6, g:0.3, b:0.2}, hairColor:{r:0.6, g:0.3, b:0.2}}

            let parentTransform = Transform.get(parent)
            let parentRotationEuler = Quaternion.toEulerAngles(parentTransform.rotation)
            parentRotationEuler.y = Math.round(parentRotationEuler.y)

            let position = {...manConfig.position}
            let rotation = {...manConfig.rotation}
            switch(i){
                case 0:
                    rotation.y = parentRotationEuler.y
                    switch(parentRotationEuler.y){
                        case 0:
                        case 360:
                            position.x -= 1.5
                            position.z += 1.5
                        break;

                        case 90:
                        break;

                        case 180:
                            position.x -= 1.5
                            position.z -= 1.5
                        break;

                        case 270:
                            position.x -= 3
                        break;
                    }
                break;

                case 1:
                    switch(parentRotationEuler.y){
                        case 0:
                        case 360:
                            position.x += 6
                            position.z += 6
                            rotation.y = 270
                        break;

                        case 90:
                            // position.z -= 12
                            // position.x += 12
                            rotation.y = 0
                        break;

                        case 180:
                            position.z += 6
                            position.x -= 6
                            rotation.y = 90
                        break;

                        case 270:
                            position.z += 12
                            rotation.y = 180
                        break;
                    }
                break;

                case 2:
                    switch(parentRotationEuler.y){
                        case 0:
                        case 360:
                            position.x += -6
                            position.z -= 6
                            rotation.y = 90
                        break;

                        case 90:
                            // position.z += 6
                            // position.x += 
                            rotation.y = 180
                        break;

                        case 180:
                            position.z -= 6
                            position.x += 6
                            rotation.y = 270
                        break;

                        case 270:
                            position.z -= 12
                            rotation.y = 0
                        break;
                    }
                break;

                case 3:
                    switch(parentRotationEuler.y){
                        case 0:
                        case 360:
                            position.x -= 1
                            position.z += 1
                            rotation.y = 90
                        break;

                        case 90:
                            rotation.y = 90
                        break;

                        case 180:
                            position.x -= 1
                            rotation.y = 90
                        break;

                        case 270:
                            position.x -= 2
                            rotation.y = 90
                        break;
                    }
                break;

                case 4:
                    switch(parentRotationEuler.y){
                        case 0:
                        case 360:
                            position.x -= 1
                            position.z += 1
                            rotation.y = 270
                        break;

                        case 90:
                            rotation.y = 270
                        break;

                        case 180:
                            position.x -= 1
                            rotation.y = 270
                        break;

                        case 270:
                            position.x -= 2
                            rotation.y = 270
                        break;
                    }
                break;

                case 5:
                    switch(parentRotationEuler.y){
                        case 0:
                        case 360:
                            position.x -= 1
                            position.z += 1
                            rotation.y = 180
                        break;

                        case 90:
                            rotation.y = 180
                        break;

                        case 180:
                            position.x -= 1
                            rotation.y = 180
                        break;

                        case 270:
                            position.x -= 2
                            rotation.y = 180
                        break;
                    }
                break;

                case 6:
                    switch(parentRotationEuler.y){
                        case 0:
                        case 360:
                            position.x -= 1
                            position.z += 1
                        break;

                        case 90:
                        break;

                        case 180:
                            position.x -= 1
                        break;

                        case 270:
                            position.x -= 2
                        break;
                    }
                break;
                    switch(parentRotationEuler.y){
                        case 0:
                        case 360:
                        break;

                        case 90:
                        break;

                        case 180:
                        break;

                        case 270:
                        break;
                    }
                break;
            }


            Transform.create(mannequin, {position:Vector3.add(parentTransform.position, position), rotation: Quaternion.fromEulerDegrees(rotation.x, rotation.y, rotation.z)})
            Transform.create(click, {position:Vector3.add(parentTransform.position, Vector3.add(position, Vector3.create(0,1,0))), scale:Vector3.create(1,2,1)})    
            // MeshRenderer.setBox(click)

            mannequins.push(manInfo)
            // updateMannequin(manInfo)
        })

        let trigger = engine.addEntity()
        Transform.create(trigger, {parent:parent, position:Vector3.create(0,0.3,-4.8)})
        utils.triggers.addTrigger(trigger, NO_LAYERS, LAYER_1, [{type:'box', scale: Vector3.create(1,3,1)}],
            ()=>{
                console.log('entered elevator')
                if(moving === 1){
                    sendServerMessage("gallery-elevator", {id:id, direction:1})
                }
            },
            ()=>{
                moving = 1
            }
        )

        trigger = engine.addEntity()
        Transform.create(trigger, {parent:parent, position:Vector3.create(0,8,-4.8)})
        utils.triggers.addTrigger(trigger, NO_LAYERS, LAYER_1, [{type:'box', scale: Vector3.create(1,3,1)}],
            ()=>{
                console.log('entered top elevator', moving)
                if(moving === 0){
                    sendServerMessage("gallery-elevator", {id:id, direction:0})
                }
            },
            ()=>{
                moving = 0
                engine.removeEntity(elevator)
            }
        )

        trigger = engine.addEntity()
        let scale =  Vector3.create(14,14,14)
        Transform.create(trigger, {parent:parent, position:Vector3.create(0,7,0)})
        utils.triggers.addTrigger(trigger, NO_LAYERS, LAYER_1, [{type:'box', scale: scale}],
            ()=>{
                console.log('entered top elevator', moving)
                startAudio(id)
            },
            ()=>{
                stopAudio(id)
            }
        )

        let images:Map<number, any> = new Map()
        for(let i = 0; i < storeImageLocations.length; i++){
            let config = storeImageLocations[i]
            let ent = engine.addEntity()
            let imageParent = engine.addEntity()
            let location = {...config}
            location.a = "1:1"
            location.ent = ent
            location.parent = imageParent
            location.v = false
            location.id = i
            images.set(i, location)
            
            VisibilityComponent.create(imageParent, {visible:false})
            VisibilityComponent.create(ent, {visible:false})

            Transform.create(imageParent, {parent:parent, position:config.position, rotation:config.rotation, scale:config.scale})
            Transform.create(ent, {parent:imageParent})
        }

        let editImages:Map<number, any> = new Map()
        for(let i = 0; i < storeImageLocations.length; i++){
            let config = storeImageLocations[i]
            let ent = engine.addEntity()
            let imageParent = engine.addEntity()
            let location = {...config}
            location.ent = ent
            location.a = "1:1"
            location.parent = imageParent
            location.v = false
            location.id = i
            editImages.set(i, location)

            VisibilityComponent.create(imageParent, {visible:false})
            VisibilityComponent.create(ent, {visible:false})

            Transform.create(imageParent, {parent:parent, position: config.position, rotation:config.rotation, scale:config.scale})
            Transform.create(ent, {parent:imageParent})
        }

        let audio:any = {
            e:false,
            playlist:"",
            volume:0.5
        }

        shops.set(storeCount, {id, audio, parent,images, mannequins, editImages, elevator:true})
        storeCount++
    }
}

export function initShops(){
    createInfoBooth()

    // storeConfigs.forEach((config:any) => {
    //     let parent = engine.addEntity()
    //     Transform.create(parent, {position:config.position, rotation:config.rotation})

        

    //     // shops.set(config.id, {parent,images, mannequins, editImages, elevator:true})

    //     // editShops.set(config.id, {parent, gallery,images:editImages})
    // })
}

function createInfoBooth(){
    let infoBooth = engine.addEntity()
    Transform.create(infoBooth, {position: Vector3.create(62.65, 0, 2.47)})
    GltfContainer.create(infoBooth, {src:'assets/infobooth.glb', visibleMeshesCollisionMask:ColliderLayer.CL_PHYSICS})

    let text = engine.addEntity()
    Transform.create(text, {parent:infoBooth, position:Vector3.create(0,5,0)})
    Billboard.create(text, {billboardMode:BillboardMode.BM_Y})
    TextShape.create(text, {text:"SHOP INFO", fontSize:10, textColor:Color4.create(1,0,1,1), outlineColor:Color4.create(107/255,185/255,243/255,1), outlineWidth:0.2})

    let shopManager = engine.addEntity()
    Transform.create(shopManager, {position: Vector3.create(62.65, .1,2.47), rotation:Quaternion.fromEulerDegrees(0,-45,0)})
    AvatarShape.createOrReplace(shopManager, {
        id:"MJD",
        name:"Manager Jacob",
        wearables:[
            "urn:decentraland:matic:collections-v2:0x0c7b975177e02c18cff0a355643cef8fe2c27ee0:0",
            "urn:decentraland:matic:collections-v2:0xded1e53d7a43ac1844b66c0ca0f02627eb42e16d:3"
        ],
        emotes:[],
        bodyShape:"urn:decentraland:off-chain:base-avatars:BaseMale"

        // skinColor:Color4.create(skinColor.r / 255, skinColor.g / 255, skinColor.b / 255),
        // hairColor: Color4.create(hairColor.r / 255, hairColor.g / 255, hairColor.b / 255),
        // eyeColor: Color4.create(eyeColor.r / 255, eyeColor.g / 255, eyeColor.b / 255)
    })

     npc.create(
        {
            position: Vector3.create(62.65, 0.5, 2.47),
            rotation: Quaternion.fromEulerDegrees(0,0,0),
            scale: Vector3.create(1, 1, 1),
        },
        //NPC Data Object
        {
            type: npc.NPCType.CUSTOM,
            model: '',
            coolDownDuration:2,
            faceUser:true,
            reactDistance:2,
            // onlyETrigger:true,
            onActivate: () => {
                console.log('user reservation', userShopReservation)
                showDialogPanel(true, {dialogs:!userShopReservation || userShopReservation !== undefined ? shopWelcomeDialog : alreadyPanel})
            },
            onWalkAway: () => {
                showDialogPanel(false)
            },
        }
    )
}

export function addShopReservation(info:any){
    if(!info){
        return
    }

    let shop = shops.get(info.shopId)
    if(!shop){
        return
    }

    if(info.newReservation.ethAddress === localUserId){
        console.log('local user now has a reservation')
        showLogo(true)
        setUserShopReservation({...info.newReservation, shopId:info.shopId})
        showNotification({type:NOTIFICATION_TYPES.MESSAGE, message: "Your reservation has been confirmed! Edit your images, video, and audio from the Angzaar icon in the top right.", animate:{enabled:true, return:true, time:10}})
        updateLocations()
    }
}

export function removeShopReservation(info:any){
    let shop = shops.get(info.shopId)
    if(!shop){
        return
    }

    let resIndex = shop.reservations.findIndex((res:any)=> res.id === info.reservationId)
    if(resIndex < 0){
        return
    }

    shop.reservations.splice(resIndex, 1)

    if((userShopReservation || userShopReservation !== undefined) && userShopReservation.id === info.reservationId){
        console.log('has user reservation to cancel')
        userShopReservation = undefined
        showLogo(false)
        showNotification({type:NOTIFICATION_TYPES.MESSAGE, message: "Your reservation has been cancelled!", animate:{enabled:true, return:true, time:5}})
        // editEntities.forEach((config:any, id:number)=>{
        //     VisibilityComponent.createOrReplace(config.ent, {visible:false})
        //     VisibilityComponent.createOrReplace(config.parent, {visible:false})
        // })
        resetEditImages(shop)
    }

    if(shop.currentReservation && shop.currentReservation.id === info.reservationId){
        console.log('has current reservation to cancel')
        shop.currentReservation = undefined
        clearShop(info.shopId)
    }
}

export function updateShops(info:any){
    info.forEach.forEach((shop:any) => {
        updateShop(shop)
    });
}

export async function updateShop(info:any){
    let shop = shops.get(info.shopId)
    if(!shop){
        console.log('no shop to refresh')
        return
    }

    switch(info.action){
        case 'elevator':
            shop.elevator = info.elevator
            if(shop.currentReservation){
                shop.currentReservation.elevator = info.elevator
            }//

            if(userShopReservation && userShopReservation.id === info.reservationId){
                userShopReservation.elevator = info.elevator
            }
            break;

        case 'clear':
            console.log('clear shop', info.shopId)
            clearShop(shop)
            break;

        case 'audio':
            shop.audio = info.audio
            updateAudio(shop)
            break;

        case 'image':
            console.log(shop.currentReservation)
            if(shop.currentReservation && shop.currentReservation.id === info.reservationId){
                let image = info.reservationImage

                let location:any = shop.images.get(image.id)
                if(!location){
                    console.log('couldnt update location', image.id)
                    return
                }

                console.log('image update location', location)
        
                for(let key in image){
                    if(location.hasOwnProperty(key)){
                        location[key] = image[key]
                    }
                }

                // if(image.v){//
                    updateImageAspect(location)
                    updateLocationMaterial(location)
                    VisibilityComponent.createOrReplace(location.parent, {visible:image.v})
                    VisibilityComponent.createOrReplace(location.ent, {visible:image.v})    
                // }
            }

            if(userShopReservation && userShopReservation.shopId === info.shopId && userShopReservation.id === info.reservationId){
                console.log('updating edit materials for user resravation')

                let image = info.reservationImage

                let location:any = shop.editImages.get(image.id)
                if(!location){
                    console.log('couldnt update location', image.id)
                    return
                }

                console.log('location is ', location)
        
                for(let key in image){
                    if(location.hasOwnProperty(key)){
                        location[key] = image[key]
                    }
                }

                // if(image.v){
                    // updateLocationMaterial(location)
                    // VisibilityComponent.createOrReplace(location.parent, {visible:image.v})
                    // VisibilityComponent.createOrReplace(location.ent, {visible:image.v})    
                // }
                updateImageAspect(location)
                updateLocations(true)
            }

            break;

        case 'mannequin':
            console.log('updating mannequin')
            let mannequin = shop.mannequins[info.manId]
            let entity = mannequin.entity
            let click = mannequin.click
            shop.mannequins[info.manId] = {entity,click, ...info.man}

            updateMannequin({entity,click, ...info.man})

            if((userShopReservation || userShopReservation !== undefined) && userShopReservation.id === info.reservationId){
                console.log('update metadta for local user')
                await updateMannequinWearablesMetaData(shop)
                if(selectedMannequin || selectedMannequin !== undefined){
                    updateEditMannequin(shop.mannequins[info.manId])
                }
            }
            break;

        case 'refresh':
            shop.reservations = info.reservations
            let shopImages = shop.images

            if(info.currentReservation){
                shop.currentReservation = info.currentReservation
                shop.currentReservation.images.forEach((imageConfig:any)=>{
                    let shopImage = shopImages.get(imageConfig.id)
                    if(shopImage){
                        imageConfig.label = shopImage.label
                        updateImage(shopImage.parent, shopImage.ent, {...imageConfig})
                    }
                })                
                shop.mannequins.forEach((mannequin:any, i:number)=>{
                    mannequin.wearables = info.currentReservation.mannequins[i].wearables
                    let entity = mannequin.entity
                    let click = mannequin.click
                    updateMannequin({entity, click, ...shop.currentReservation.mannequins[i]})
                    updateMannequinWearablesMetaData(shop)
                })
                shop.audio = info.currentReservation.audio

            }else{
                engine.removeEntity(shop.mannequin)
                // addGalleryReservation(info.shopId)//

                // resetGalleryImages(shop)
                shopImages.forEach((shopImage:any, id:number)=>{
                    updateImage(shopImage.parent, shopImage.ent, {src:"", v:false, b:22, t:0, a:'1:1'})
                })

                shop.audio = {
                    e:false,
                    playlist:"",
                    volume:0.5
                }

                updateAudio(shop)
            }

            if(info.userReservation && info.userReservation.ethAddress === localUserId){
                setUserShopReservation({...info.userReservation, shopId:info.shopId})
                showLogo(true)
                setUserImages(info)
            }
            break;
    }
}

async function updateMannequinWearablesMetaData(shop:any){
    for(let i = 0; i < shop.mannequins.length; i ++){
        let mannequin = shop.mannequins[i]
        console.log('fetching mannequin', mannequin)
        for(let j = 0; j < mannequin.wearables.length; j++){
            let wearable = mannequin.wearables[j]
            console.log('fetching wearable data', wearable)
            if(!wearable.data){
                if(resources.DEBUG){
                    wearable.data = {
                        "id": "0xcfa57c24b5188db2e45f2ef78590198e5013db54-21",
                        "name": "Classic Tuxedo Tee",
                        "thumbnail": "https://peer.decentraland.org/lambdas/collections/contents/urn:decentraland:matic:collections-v2:0xcfa57c24b5188db2e45f2ef78590198e5013db54:21/thumbnail",
                        "url": "/contracts/0xcfa57c24b5188db2e45f2ef78590198e5013db54/items/21",
                        "category": "wearable",
                        "contractAddress": "0xcfa57c24b5188db2e45f2ef78590198e5013db54",
                        "itemId": "21",
                        "rarity": "common",
                        "price": "1000000000000000000",
                        "available": "79779",
                        "isOnSale": true,
                        "creator": "0x71c99d7e593e4e2b07d17feba2d080cbffe832cb",
                        "tradeId": null,
                        "beneficiary": "0x71c99d7e593e4e2b07d17feba2d080cbffe832cb",
                        "createdAt": "1635349441",
                        "updatedAt": "1738177768",
                        "reviewedAt": "1635464913",
                        "soldAt": "1738177768",
                        "data": {
                          "wearable": {
                            "bodyShapes": [
                              "BaseMale",
                              "BaseFemale"
                            ],
                            "category": "upper_body",
                            "description": "",
                            "rarity": "common",
                            "isSmart": false
                          }
                        },
                        "network": "MATIC",
                        "chainId": 137,
                        "urn": "urn:decentraland:matic:collections-v2:0xcfa57c24b5188db2e45f2ef78590198e5013db54:21",
                        "firstListedAt": 1635470776000,
                        "picks": {
                          "itemId": "0xcfa57c24b5188db2e45f2ef78590198e5013db54-21",
                          "count": 0
                        },
                        "utility": null
                      }
                }
                else{
                    try {
                        const res = await fetch(
                          "https://marketplace-api.decentraland.org/v1/items?contractAddress=" +
                          wearable.id.split(":")[0] +
                            "&itemId=" +
                            wearable.id.split(":")[1]
                        );
                        const json = await res.json();
                  
                        if (json.total > 0) {
                            console.log('res is', json.data)
                          const foundItem = json.data.find(
                            (res: any) => res.id === wearable.id.replace(/:/g, "-")
                          );
                          if (foundItem) {
                            console.log('found item', foundItem)
                            wearable.data = foundItem
                          } else {
                            console.log('didnt find item')
                          }
                        } else {
                          console.log("no items")
                        }
                      } catch (e) {
                        console.error("Error fetching wearable data", e);
                      }
                }
            }
        }
    }
}

function updateMannequin(config:any){
    if(!config.v){
        AvatarShape.deleteFrom(config.entity)
        MeshCollider.deleteFrom(config.click)
        return
    }

    MeshCollider.setBox(config.click)
    pointerEventsSystem.onPointerDown({entity:config.click, opts:{
        button:InputAction.IA_SECONDARY, hoverText:"View Items", maxDistance:4
    }}, ()=>{
        console.log('showing mannequin items', )
        displayMannequinPanel(true, config)
    })

    let wearables:any[]= []
    config.wearables.forEach((item:any)=>{
        if(item.id.substring(0,3) === "urn"){
            wearables.push(item)
        }
        else{
            wearables.push("urn:decentraland:matic:collections-v2:" + item.id)
        }
    })

    let {skinColor, hairColor, eyeColor} = config
    AvatarShape.createOrReplace(config.entity, {
        id:config.name,
        name:config.name,
        bodyShape: config.b === "F" ? "urn:decentraland:off-chain:base-avatars:BaseFemale" : "urn:decentraland:off-chain:base-avatars:BaseMale",
        wearables:wearables,
        emotes:[],
        skinColor:Color4.create(skinColor.r / 255, skinColor.g / 255, skinColor.b / 255),//
        hairColor: Color4.create(hairColor.r / 255, hairColor.g / 255, hairColor.b / 255),
        eyeColor: Color4.create(eyeColor.r / 255, eyeColor.g / 255, eyeColor.b / 255)
    })
}

function setUserImages(info:any){
    let shop:any = shops.get(info.shopId)
    if(!shop){
        return
    }

    info.userReservation.images.forEach((config:any)=>{
        let location:any = shop.editImages.get(config.id)
        if(!location){
            console.log('couldnt update edit location', config.id)
            return
        }

        location = {
            ...location,
            ...config
        }

        shop.editImages.set(location.id, location)

        VisibilityComponent.createOrReplace(location.parent, {visible:false})
        VisibilityComponent.createOrReplace(location.ent, {visible:false})
    })
}

function clearShop(id:number){
    let shop = shops.get(id)
    if(!shop){
        console.log('no shop config for', id)
        return
    }

    shop.elevator = true

    resetGalleryImages(shop)
    resetMannequins(shop)
}

function resetMannequins(shop:any){
    shop.mannequins.forEach((mannequin:any, i:number)=>{
        updateMannequin({click:mannequin.click, entity:mannequin.entity, b:"F", id:(i), v:false, name:"Mannequin " + (i+1), wearables:[], emotes:[],skinColor:{r:0.6, g:0.3, b:0.2}, eyeColor:{r:0.6, g:0.3, b:0.2}, hairColor:{r:0.6, g:0.3, b:0.2}})
    })
}

function resetGalleryImages(shop:any){
    shop.images.forEach((image:any)=>{
        updateLocationMaterial({src:"", parent:image.parent, ent:image.ent, b:16, t:0})
        VisibilityComponent.createOrReplace(image.parent, {visible:true})
        VisibilityComponent.createOrReplace(image.ent, {visible:true}) 
    })
    resetEditImages(shop)
}

function resetEditImages(shop:any){
    shop.editImages.forEach((image:any)=>{
        updateLocationMaterial({src:"", parent:image.parent, ent:image.ent, b:16, t:0})
        VisibilityComponent.createOrReplace(image.parent, {visible:false})
        VisibilityComponent.createOrReplace(image.ent, {visible:false}) 
    })
}

function updateImage(parent:Entity, ent:Entity, config:any){
    config.parent = parent
    config.ent = ent

    updateLocationMaterial(config)
    updateImageAspect(config)
    VisibilityComponent.createOrReplace(parent, {visible:config.v})
    VisibilityComponent.createOrReplace(ent, {visible:config.v})
}

export function updateImageAspect(location:any){
    // Ensure the aspect ratio is valid (fallback to "1:1" if missing)
    const aspectRatioKey = location.a || "1:1";
    console.log('aspect key is', aspectRatioKey)

     // Determine scale based on aspect ratio
     const { width, height } =
     location.label === "Main Banner"
         ? MainBannerSizes[aspectRatioKey] || MainBannerSizes["1:1"]
         : AspectRatioSizes[aspectRatioKey] || AspectRatioSizes["1:1"];

    console.log('aspect is', width, height)

    // Update transform with new scale
    Transform.getMutable(location.parent).scale = Vector3.create(width, height, 1);
}

export function addGalleryReservation(id:number){
    let shop = shops.get(id)
    if(!shop){
        return
    }

    shop.box = engine.addEntity()
    GltfContainer.create(shop.box, {src:"assets/d46fc18a-9b6d-4bc3-8dd3-ff38a3a39dd2.glb"})
    Transform.create(shop.box, {position:Vector3.create(0,1,1.5), scale:Vector3.create(2,2,2), parent:shop.parent})
    pointerEventsSystem.onPointerDown({entity:shop.box, opts:{
        hoverText:"Reserve Shop", maxDistance:5, button:InputAction.IA_POINTER
    }}, ()=>{
        // showReservationPopup(true, id)
    })
}

export function moveShopElevator(info:any){
    let shop = shops.get(info.id)
    if(!shop){
        return
    }

    if(shop.currentReservation && !shop.currentReservation.elevator){
        return
    }

    let start = Vector3.create(0,0.3,-4.8)
    let end = Vector3.create(0,7.5,-4.8)
    if(info.direction === 0){
        start = end
        end = Vector3.create(0,0.3,-4.8)
    }

    engine.removeEntity(elevator)

    elevator = engine.addEntity()
    GltfContainer.create(elevator, {src:models.galleryElevator})
    Transform.create(elevator, {parent:shop.parent, position:start})

    Tween.createOrReplace(elevator, {
        mode: Tween.Mode.Move({
            start: start,
            end: end,
        }),
        duration: 1000 * 2,
        easingFunction: EasingFunction.EF_LINEAR,
    })
}