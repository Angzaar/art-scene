import { EasingFunction, engine, Entity, GltfContainer, InputAction, MeshRenderer, pointerEventsSystem, Transform, Tween, VisibilityComponent } from "@dcl/sdk/ecs"
import resources, { models, storeConfigs, storeImageLocations } from "./helpers/resources"
import { Quaternion, Vector3 } from "@dcl/sdk/math"
import { LAYER_1, NO_LAYERS } from "@dcl-sdk/utils"
import { utils } from "./helpers/libraries"
import { localUserId, sendServerMessage } from "./server"
import { showReservationPopup } from "./ui/calendar"
import { showLogo } from "./ui/logo"
import { NOTIFICATION_TYPES } from "./helpers/types"
import { showNotification } from "./ui/NotificationPanel"
import { updateLocationMaterial } from "./mainGallery"

export let shops:Map<number,any> = new Map()
export let editEntities:Map<number, any> = new Map()
export let userReservation:any

export function initShops(){
    storeConfigs.forEach((config:any) => {
        let parent = engine.addEntity()
        Transform.create(parent, {position:config.position, rotation:config.rotation})

        let gallery = engine.addEntity()
        GltfContainer.create(gallery, {src:models.gallery})
        Transform.create(gallery, {parent:parent})

        let elevator = engine.addEntity()
        GltfContainer.create(elevator, {src:models.galleryElevator})
        Transform.create(elevator, {parent:gallery, position:Vector3.create(0,0.3,-4.8)})

        let trigger = engine.addEntity()
        Transform.create(trigger, {parent:gallery, position:Vector3.create(0,0.3,-4.8)})
        utils.triggers.addTrigger(trigger, NO_LAYERS, LAYER_1, [{type:'box', scale: Vector3.create(1,3,1)}],
            ()=>{
                console.log('entered elevator')
                sendServerMessage("gallery-elevator", {id:config.id, action:"move"})
            },
            ()=>{}
        )

        let images:Map<number, any> = new Map()
        let imageId:number = 0

        //add outside image
        parent = engine.addEntity()
        let ent = engine.addEntity()
        let image:any = {
            ent:ent,
            parent:parent,
            v:true
        }

        Transform.create(ent, {parent:gallery, scale:Vector3.create(8.3,4.5,1), position:Vector3.create(0,10.9,7), rotation:Quaternion.fromEulerDegrees(0,0,0)})
        VisibilityComponent.create(ent, {visible:false})
        MeshRenderer.setPlane(ent)

        images.set(imageId, image)

        // storeImageLocations.forEach((lower:any, index:number)=>{
        //     let parent = engine.addEntity()
        //     let ent = engine.addEntity()
        //     let image:any = {
        //         ent:ent,
        //         parent:parent,
        //         v:true
        //     }

        //     VisibilityComponent.create(parent, {visible:true})
        //     VisibilityComponent.create(ent, {visible:true})

        //     Transform.create(parent, {position: lower.position, rotation:lower.rotation, scale:lower.scale})
        //     Transform.create(ent, {parent:parent})

        //     images.set(imageId, image)
        //     imageId++
        // })

        // storeImageLocations.forEach((lower:any, index:number)=>{
        //     let parent = engine.addEntity()
        //     let ent = engine.addEntity()
        //     let image:any = {
        //         ent:ent,
        //         parent:parent,
        //         v:true
        //     }

        //     VisibilityComponent.create(parent, {visible:true})
        //     VisibilityComponent.create(ent, {visible:true})

        //     Transform.create(parent, {position:Vector3.add(lower.position, Vector3.create(0,8,0)), rotation:lower.rotation, scale:lower.scale})
        //     Transform.create(ent, {parent:parent})

        //     images.set(imageId, image)
        //     imageId++
        // })

        shops.set(config.id, {parent, gallery, elevator, images})
    })
}

export function addShopReservation(info:any){
    if(!info){
        return
    }

    let shop = shops.get(info.locationId)
    if(!shop){
        return
    }

    if(info.newReservation.ethAddress === localUserId){
        console.log('local user now has a reservation')
        showLogo(true)
        showNotification({type:NOTIFICATION_TYPES.MESSAGE, message: "Your reservation has been confirmed! Edit your images, video, and audio from the Angzaar icon in the top right.", animate:{enabled:true, return:true, time:10}})
    }
}

export function refreshStore(info:any){
    // if(info.current){
    //     galleryReservation = info.current
    //     info.current.images.forEach((config:any)=>{
    //         let location:any = entities.get(config.id)//
    //         if(!location){
    //             console.log('couldnt update location', config.id)
    //             return
    //         }

    //         location = {
    //             ...location,
    //             ...config
    //         }

    //         entities.set(location.id, location)

    //         // if(config.v){
    //             updateLocationMaterial(location)
    //             VisibilityComponent.createOrReplace(location.parent, {visible:config.v})
    //             VisibilityComponent.createOrReplace(location.ent, {visible:config.v})    
    //         // }
    //     })
    // }

    // if(info.user && info.user.ethAddress === localUserId){
    //     setUserReservation(info.user)
    //     showLogo(true)
    //     setUserImages(info)
    // }else{
    //     showLogo(false)
    // }
}


export function updateShops(info:any){
    info.forEach.forEach((shop:any) => {
        updateShops(shop)
    });
}

export function updateShop(info:any){
    switch(info.action){
        case 'image':
            break;

        case 'mannequin':
            break;

        case 'refresh':
            userReservation = info.userReservation
            
            let shop = shops.get(info.shopId)
            if(!shop){
                console.log('no shop to refresh')
                return
            }

            let shopImages = shop.images

            if(info.currentReservation){
                info.currentReservation.images.forEach((imageConfig:any)=>{
                    let shopImage = shopImages.get(imageConfig.id)
                    if(shopImage){
                        updateImage(shopImage.parent, shopImage.ent, {...imageConfig})
                    }
                })
            }else{
                addGalleryReservation(info.id)
                resetGalleryImages(info.shopId)
                shopImages.forEach((shopImage:any, id:number)=>{
                    updateImage(shopImage.parent, shopImage.ent, {src:"", v:true, b:16, t:0})
                })
            }
            break;
    }
}

function resetGalleryImages(shopId:number){
    let shop = shops.get(shopId)
    if(!shop){
        console.log('no shop config for', shopId)
        return
    }
    shop.images.forEach((image:any)=>{
        updateLocationMaterial({src:"", parent:image.parent, ent:image.ent, b:16, t:0})
        VisibilityComponent.createOrReplace(image.parent, {visible:true})
        VisibilityComponent.createOrReplace(image.ent, {visible:true}) 
    })
}

function updateImage(parent:Entity, ent:Entity, config:any){
    config.parent = parent
    config.ent = ent

    updateLocationMaterial(config)
    VisibilityComponent.createOrReplace(parent, {visible:config.v})
    VisibilityComponent.createOrReplace(ent, {visible:config.v}) 
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
        showReservationPopup(true)
    })
}

export function moveGalleryElevator(id:number, delta:number){
    let shop = shops.get(id)
    if(!shop){
        return
    }

    let elevator = shop.elevator

    if(Tween.has(elevator)){
        Tween.deleteFrom(elevator)
    }

    let tranform = Transform.getMutable(elevator).position
    tranform.y = delta

    Tween.createOrReplace(elevator, {
        mode: Tween.Mode.Move({
            start: tranform,
            end: Vector3.add(tranform, Vector3.create(0,0.1, 0)),
        }),
        duration: 100,
        easingFunction: EasingFunction.EF_LINEAR,
    })
}

function TweenMoveSystem(dt:number){

}