import { AvatarShape, engine, Entity, GltfContainer, InputAction, Material, MeshCollider, MeshRenderer, pointerEventsSystem, Transform } from "@dcl/sdk/ecs";
import { Vector3, Quaternion, Color4 } from "@dcl/sdk/math";
import { addBuilderHUDAsset } from "./dcl-builder-hud";
import { utils } from "./helpers/libraries";
import resources from "./helpers/resources";
import { getRandomIntInclusive, randomImage } from "./helpers/functions";
import { createWearableStore } from "./wearableStore";
import { colyseusRoom } from "./server";
import { Room } from "colyseus.js";

let galleryModel = "assets/gallery.glb"

export function initStores(){
    createWearableStore()
    createEmoteStore()
    // createLandNamesStore()
    // createLSCStore()
    // createNeurolinkStore()
}

function createLSCStore(){
    let parent = engine.addEntity()
    Transform.create(parent,{
        position:Vector3.create(120,0,-40),
        rotation:Quaternion.fromEulerDegrees(0,-90,0)
    },
    )

    let gallery = engine.addEntity()
    GltfContainer.create(gallery, {src:galleryModel})
    Transform.create(gallery, {parent:parent})

    let logo = engine.addEntity()
    Transform.create(logo, {parent:parent, position:Vector3.create(0, 10.7, 7.2), rotation:Quaternion.fromEulerDegrees(0,180,0), scale:Vector3.create(6,6,1)})
    MeshRenderer.setPlane(logo)
    Material.setBasicMaterial(logo, {texture:Material.Texture.Common({
		src: 'images/lsc-logo.png',
	})})


    let showcase = engine.addEntity()
    Transform.create(showcase, {parent:parent, position:Vector3.create(0,.4,1.5), rotation:Quaternion.fromEulerDegrees(0,-90,0)})
    AvatarShape.create(showcase, {
        id:"lsc",
        name:"Last Slice Collective",
        wearables:[
            "urn:decentraland:matic:collections-v2:0xf87a8372437c40ef9176c1b224cbe9307a617a25:0",
            "urn:decentraland:matic:collections-v2:0xf87a8372437c40ef9176c1b224cbe9307a617a25:1",
            "urn:decentraland:matic:collections-v2:0xf87a8372437c40ef9176c1b224cbe9307a617a25:2"
        ],
        emotes:[]
    })

    lscConfigs.forEach((config:any, i:number)=>{
        console.log(config.title)
        let ent = engine.addEntity()
        Transform.create(ent, {parent:parent, position:config.position, rotation:Quaternion.fromEulerDegrees(config.rotation.x, config.rotation.y, config.rotation.z), scale: Vector3.create(config.scale.x, config.scale.y, config.scale.z)})
        MeshRenderer.setPlane(ent)
        MeshCollider.setPlane(ent)
        addBuilderHUDAsset(ent, "item-1" + i)
        Material.setPbrMaterial(ent, {
            texture:Material.Texture.Common({
            src: '' + config.images[0]}),
            emissiveColor:Color4.White(),
            emissiveIntensity:1,
            emissiveTexture:Material.Texture.Common({
                src: '' + config.images[0]})
        })
        pointerEventsSystem.onPointerDown({entity:ent, opts:{
            button:InputAction.IA_SECONDARY, hoverText:"" + config.title, maxDistance:7
        }},()=>{
        })
    })
}

function createNeurolinkStore(){
    let parent = engine.addEntity()
    Transform.create(parent, {
            position:Vector3.create(120,0,-24),
            rotation:Quaternion.fromEulerDegrees(0,-90,0),
        },
    )

    let gallery = engine.addEntity()
    GltfContainer.create(gallery, {src:galleryModel})
    Transform.create(gallery, {parent:parent})

    let logo = engine.addEntity()
    Transform.create(logo, {parent:parent, position:Vector3.create(0, 10.7, 7.2), rotation:Quaternion.fromEulerDegrees(0,180,0), scale:Vector3.create(10,10,1)})
    MeshRenderer.setPlane(logo)
    Material.setBasicMaterial(logo, {texture:Material.Texture.Common({
		src: 'images/neurolink-logo.png',
	})})

    linkGLBConfigs.forEach((config:any, i:number)=>{
        let ent = engine.addEntity()
        Transform.create(ent, {parent:parent, position:config.position, rotation:Quaternion.fromEulerDegrees(config.rotation.x, config.rotation.y, config.rotation.z), scale: Vector3.create(config.scale.x, config.scale.y, config.scale.z)})
        GltfContainer.create(ent, {src:'assets/neurolink.glb'})
        addBuilderHUDAsset(ent, "neurolink-" + i)//
    })
}

function createLandNamesStore(){
    let parent = engine.addEntity()
    Transform.create(parent,  {
        position:Vector3.create(120,0,-8),
        rotation:Quaternion.fromEulerDegrees(0,-90,0),
    })

    let gallery = engine.addEntity()
    GltfContainer.create(gallery, {src:galleryModel})
    Transform.create(gallery, {parent:parent})
}

function createEmoteStore(){
    let parent = engine.addEntity()
    Transform.create(parent, {
        position:Vector3.create(88,0,-24),
        rotation:Quaternion.fromEulerDegrees(0,0,0)
    },)

    let gallery = engine.addEntity()
    GltfContainer.create(gallery, {src:galleryModel})
    Transform.create(gallery, {parent:parent})

    // let logo = engine.addEntity()
    // Transform.create(logo, {parent:parent, position:Vector3.create(0, 10.7, 7.2), rotation:Quaternion.fromEulerDegrees(0,180,0), scale:Vector3.create(6,6,1)})
    // MeshRenderer.setPlane(logo)
    // Material.setBasicMaterial(logo, {texture:Material.Texture.Common({
	// 	src: '',
	// })})

    // randomImage(logo, "emotes")
    // utils.timers.setTimeout(()=>{
    //     randomImage(logo, "emotes")
    // }, 1000 * 10)
}

let lscConfigs:any[] = [
    {images:["https://dclstreams.com/media/images/cc1d0063-2aef-4d27-8ebd-84100ffc4ed7.png"], position:{x:6.8, y:2, z:5.2}, rotation:{x:0, y:90, z:0}, scale:{x:1.5, y:1.5, z:1},
        popup:{enabled:true, type:1, link:""}, title:"Samsung", text:"Samsung 837x launched in 2022 at the CES show. Their Decentraland event is the largest single day event in history, with over 34,000 unique visitors in a single day."},
    {images:["https://dclstreams.com/media/images/04a61fca-e4b1-47a2-b0b9-26abfd2a1253.png"], position:{x:6.8, y:2, z:3.2}, rotation:{x:0, y:90, z:0}, scale:{x:1.5, y:1.5, z:1},
        popup:{enabled:true, type:1, link:""}, title:"Netflix", text:"Netflix promoted the Gray Man movie in Decentraland with a maze from the movie! Race to the finish line and gain access to the secret room with wearables."},
    {images:["https://dclstreams.com/media/images/16cb0ed8-91b1-4415-b332-7c0c9399abf9.png"], position:{x:6.8, y:2, z:-3.2}, rotation:{x:0, y:90, z:0}, scale:{x:1.5, y:1.5, z:1},
        popup:{enabled:true, type:1, link:""}, title:"McCormicks"},
    {images:["https://dclstreams.com/media/images/bed84f57-6a90-4cb4-9bc4-25c066912dc1.png"], position:{x:6.8, y:2, z:-5.2}, rotation:{x:0, y:90, z:0}, scale:{x:1.5, y:1.5, z:1},
        popup:{enabled:true, type:1, link:""}, title:"SteakUmm"},


    {images:["https://dclstreams.com/media/images/22ab6cb5-4532-4e08-869d-0493e51156a0.png"], position:{x:-6.8, y:2, z:5.2}, rotation:{x:0, y:270, z:0}, scale:{x:1.5, y:1.5, z:1},
        popup:{enabled:true, type:1, link:""}, title:"Snapple"},
    {images:["https://dclstreams.com/media/images/ab1e6ba4-1a33-4ca8-9bf5-35bbb26554e9.png"], position:{x:-6.8, y:2, z:3.2}, rotation:{x:0, y:270, z:0}, scale:{x:1.5, y:1.5, z:1},
        popup:{enabled:true, type:1, link:""}, title:"Playboy"},
    {images:["https://dclstreams.com/media/images/a4852e42-dd29-4c51-876c-35185b41ecdb.png"], position:{x:-6.8, y:2, z:-3.2}, rotation:{x:0, y:270, z:0}, scale:{x:1.5, y:1.5, z:1},
        popup:{enabled:true, type:1, link:""}, title:"Wall Street Bets"},
    {images:["https://dclstreams.com/media/images/da363aa9-0a92-4d1b-a07c-c2032dc281f1.png"], position:{x:-6.8, y:2, z:-5.2}, rotation:{x:0, y:270, z:0}, scale:{x:1.5, y:1.5, z:1},
        popup:{enabled:true, type:1, link:""}, title:"PixelMind"},



    // {images:["images/lsc-logo.png"], position:{x:6.8, y:2, z:5.2}, rotation:{x:0, y:90, z:0}, scale:{x:1.5, y:1.5, z:1,
    //     popup:{enabled:true, type:1, link:"", title:"Samsung"}
    // }},
    // {images:["images/lsc-logo.png"], position:{x:6.8, y:2, z:5.2}, rotation:{x:0, y:90, z:0}, scale:{x:1.5, y:1.5, z:1,
    //     popup:{enabled:true, type:1, link:"", title:"Samsung"}
    // }},
]

let linkGLBConfigs:any[] = [
    {position:{x:7.2, y:-16, z:0.2}, rotation:{x:0, y:0, z:0}, scale:{x:10, y:10, z:10,
    }},
    {position:{x:7.2, y:-16, z:-0.8}, rotation:{x:0, y:0, z:0}, scale:{x:10, y:10, z:10,
    }},
    {position:{x:7.2, y:-16, z:-2}, rotation:{x:0, y:0, z:0}, scale:{x:10, y:10, z:10,
    }},
]