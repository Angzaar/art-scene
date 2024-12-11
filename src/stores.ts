import { engine, GltfContainer, Transform } from "@dcl/sdk/ecs";
import { Vector3, Quaternion } from "@dcl/sdk/math";


let galleryModel = "assets/gallery.glb"

export function initStores(){
    galleryConfigs.forEach((config:any) => {
        let parent = engine.addEntity()
        Transform.create(parent, {position:config.position, rotation:config.rotation})

        let gallery = engine.addEntity()
        GltfContainer.create(gallery, {src:galleryModel})
        Transform.create(gallery, {parent:parent})
    })
}

let galleryConfigs:any = [
    {
        position:Vector3.create(72,0,-40),
        rotation:Quaternion.fromEulerDegrees(0,0,0)
    },

    {
        position:Vector3.create(88,0,-40),
        rotation:Quaternion.fromEulerDegrees(0,0,0)
    },
]