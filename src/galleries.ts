import { EasingFunction, engine, GltfContainer, InputAction, MeshCollider, MeshRenderer, NftFrameType, NftShape, pointerEventsSystem, Transform, Tween } from "@dcl/sdk/ecs";
import { Quaternion, Vector3 } from "@dcl/sdk/math"
import { sendServerMessage } from "./server";
import { utils } from "./helpers/libraries";
import { LAYER_1, NO_LAYERS } from "@dcl-sdk/utils";

let galleryModel = "assets/gallery.glb"
let galleryElevatorModel = "assets/gallery-elevator.glb"

export let galleries:Map<string,any> = new Map()

export function initGalleries(){
    galleryConfigs.forEach((config:any) => {
        let parent = engine.addEntity()
        Transform.create(parent, {position:config.position, rotation:config.rotation})

        let gallery = engine.addEntity()
        GltfContainer.create(gallery, {src:galleryModel})
        Transform.create(gallery, {parent:parent})

        let elevator = engine.addEntity()
        GltfContainer.create(elevator, {src:galleryElevatorModel})
        Transform.create(elevator, {parent:gallery, position:Vector3.create(0,0.3,-4.8)})

        let trigger = engine.addEntity()
        Transform.create(trigger, {parent:gallery, position:Vector3.create(0,0.3,-4.8)})
        utils.triggers.addTrigger(trigger, NO_LAYERS, LAYER_1, [{type:'box', scale: Vector3.create(1,3,1)}],
            ()=>{
                console.log('entered elevator')
                sendServerMessage("gallery-elevator", {id:config.id, action:"move"})//
            },
            ()=>{}
        )

        let artworks:any[] = []
        placementConfigs.forEach((lower:any, index:number)=>{
            let parent = engine.addEntity()

            Transform.create(parent, {parent:gallery, position:lower.position, rotation:lower.rotation, scale:lower.scale})
             NftShape.create(parent, {
                urn: 'urn:decentraland:ethereum:erc721:0x06012c8cf97bead5deae237070f9587f8e7a266d:558536',
                style: NftFrameType.NFT_GOLD_EDGES
            })

            let img:any
            img = engine.addEntity()
            MeshRenderer.setPlane(img)
            Transform.create(img, {parent:parent, scale:Vector3.create(0.5,0.5,0.5), position:Vector3.create(0,0,-.02)})

            artworks.push({parent, img: img ? img : undefined, id:"l" + (index+1)})
        })

        placementConfigs.forEach((lower:any, index:number)=>{
            let parent = engine.addEntity()

            Transform.create(parent, {parent:gallery, position:Vector3.add(lower.position, Vector3.create(0,8,0)), rotation:lower.rotation, scale:lower.scale})
             NftShape.create(parent, {
                urn: 'urn:decentraland:ethereum:erc721:0x06012c8cf97bead5deae237070f9587f8e7a266d:558536',
                style: NftFrameType.NFT_GOLD_EDGES
            })

            let img:any
            img = engine.addEntity()
            MeshRenderer.setPlane(img)
            Transform.create(img, {parent:parent, scale:Vector3.create(0.5,0.5,0.5), position:Vector3.create(0,0,-.02)})

            artworks.push({parent, img: img ? img : undefined, id:"u" + (index+1)})
        })

        let banner = engine.addEntity()
        Transform.create(banner, {parent:gallery, scale:Vector3.create(8.3,4.5,1), position:Vector3.create(0,10.9,7), rotation:Quaternion.fromEulerDegrees(0,0,0)})
        MeshRenderer.setPlane(banner)
        artworks.push({parent:banner, img: undefined, id:"banner"})

        galleries.set(config.id, {parent, gallery, elevator, artworks})
    });
}

export function addGalleryReservation(id:string){
    let gallery = galleries.get(id)
    if(!gallery){
        return
    }

    gallery.box = engine.addEntity()
    GltfContainer.create(gallery.box, {src:"assets/d46fc18a-9b6d-4bc3-8dd3-ff38a3a39dd2.glb"})
    Transform.create(gallery.box, {position:Vector3.create(0,1,1.5), scale:Vector3.create(2,2,2), parent:gallery.parent})
    pointerEventsSystem.onPointerDown({entity:gallery.box, opts:{
        hoverText:"Reserve Gallery", maxDistance:5, button:InputAction.IA_POINTER
    }}, ()=>{
        sendServerMessage("reserve", {
            startDate:"2024-11-25T01:21:26.955Z",//
            length:7,
            id:id
           })
    })
}

export function removeGalleryReservationObject(id:string){
    let gallery = galleries.get(id)
    if(!gallery){
        return
    }
    engine.removeEntity(gallery.box)
}

export function moveGalleryElevator(id:string, delta:number){
    let gallery = galleries.get(id)
    if(!gallery){
        return
    }

    let elevator = gallery.elevator

    if(Tween.has(elevator)){
        Tween.deleteFrom(elevator)
    }

    let tranform = Transform.getMutable(elevator).position
    tranform.y = delta

    // Tween.createOrReplace(elevator, {
    //     mode: Tween.Mode.Move({
    //         start: tranform,
    //         end: Vector3.add(tranform, Vector3.create(0,0.1, 0)),
    //     }),
    //     duration: 100,
    //     easingFunction: EasingFunction.EF_LINEAR,
    // })
}

let galleryConfigs:any = [
    {
        position:Vector3.create(-8,0,8),
        rotation:Quaternion.fromEulerDegrees(0,90,0),
        id:"gal1",
    },
    {
        position:Vector3.create(-8,0,-24),
        rotation:Quaternion.fromEulerDegrees(0,90,0),
        id:"gal2"
    },
    {
        position:Vector3.create(-8,0,-40),
        rotation:Quaternion.fromEulerDegrees(0,90,0),
        id:"gal3"
    },

    {
        position:Vector3.create(40,0,-8),
        rotation:Quaternion.fromEulerDegrees(0,180,0),
        id:"gal4"
    },
    {
        position:Vector3.create(24,0,-8),
        rotation:Quaternion.fromEulerDegrees(0,180,0),
        id:"gal5"
    },
    {
        position:Vector3.create(24,0,-40),
        rotation:Quaternion.fromEulerDegrees(0,0,0),
        id:"gal6"
    },
    {
        position:Vector3.create(40,0,-40),
        rotation:Quaternion.fromEulerDegrees(0,0,0),
        id:"gal7"
    },

    {
        position:Vector3.create(120,0,-40),
        rotation:Quaternion.fromEulerDegrees(0,-90,0),
        id:"gal8"
    },

    {
        position:Vector3.create(120,0,-24),
        rotation:Quaternion.fromEulerDegrees(0,-90,0),
        id:"gal9"
    },


    // //upper deck

    // {
    //     position:Vector3.create(40,15,-40),
    //     rotation:Quaternion.fromEulerDegrees(0,0,0)
    // },
    // {
    //     position:Vector3.create(24,15,-40),
    //     rotation:Quaternion.fromEulerDegrees(0,0,0)
    // },

    // {
    //     position:Vector3.create(40,30,-40),
    //     rotation:Quaternion.fromEulerDegrees(0,0,0)
    // },
    // {
    //     position:Vector3.create(24,30,-40),
    //     rotation:Quaternion.fromEulerDegrees(0,0,0)
    // }
]

let placementConfigs:any = [
    {scale:Vector3.create(3,3,1), position:Vector3.create(6.85,2,4.3), rotation:Quaternion.fromEulerDegrees(0,90,0)},
    {scale:Vector3.create(3,3,1), position:Vector3.create(6.85,2,-4.3), rotation:Quaternion.fromEulerDegrees(0,90,0)},
    {scale:Vector3.create(3,3,1), position:Vector3.create(4.4,2,-6.8), rotation:Quaternion.fromEulerDegrees(0,180,0)},
    {scale:Vector3.create(3,3,1), position:Vector3.create(-4.4,2,-6.8), rotation:Quaternion.fromEulerDegrees(0,180,0)},
    {scale:Vector3.create(3,3,1), position:Vector3.create(-6.85,2,-4.3), rotation:Quaternion.fromEulerDegrees(0,270,0)},
    {scale:Vector3.create(3,3,1), position:Vector3.create(-6.85,2,4.3), rotation:Quaternion.fromEulerDegrees(0,270,0)},
]