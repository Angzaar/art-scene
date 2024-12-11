import { NO_LAYERS, LAYER_1 } from "@dcl-sdk/utils";
import { engine, Entity, GltfContainer, MeshRenderer, Transform, VideoPlayer } from "@dcl/sdk/ecs";
import { Quaternion, Vector3 } from "@dcl/sdk/math";
import { addBuilderHUDAsset } from "./dcl-builder-hud";
import { utils } from "./helpers/libraries";

export let building:Entity
export let inside:boolean = false

export function initBuilding(){
    building = engine.addEntity()
    GltfContainer.create(building, {src: "assets/building.glb"})
    Transform.create(building, {position: Vector3.create(128,0,64), rotation:Quaternion.fromEulerDegrees(0,180,0)})

    createEnvFlooring()

        // utils.triggers.enableDebugDraw(true)
        let insideTrigger = engine.addEntity()
        Transform.create(insideTrigger, {position: Vector3.create(49, 3, 22), scale:Vector3.create(7,6,1)})
        // MeshRenderer.setBox(insideTrigger)
        utils.triggers.addTrigger(insideTrigger, NO_LAYERS, LAYER_1, [{type:'box', scale:Transform.get(insideTrigger).scale}], ()=>{
            triggeredMovement()
        },
        ()=>{
            triggeredMovement()
        })
        addBuilderHUDAsset(insideTrigger, "inside trigger")


        insideTrigger = engine.addEntity()
        Transform.create(insideTrigger, {position: Vector3.create(49, 3, 52), scale:Vector3.create(7,6,1)})
        // MeshRenderer.setBox(insideTrigger)
        utils.triggers.addTrigger(insideTrigger, NO_LAYERS, LAYER_1, [{type:'box', scale:Transform.get(insideTrigger).scale}], ()=>{
            triggeredMovement()
        },
        ()=>{
            triggeredMovement()
        })
        addBuilderHUDAsset(insideTrigger, "inside trigger2")

        insideTrigger = engine.addEntity()
        Transform.create(insideTrigger, {position: Vector3.create(98,3,42.6), scale:Vector3.create(2,6,10)})
        // MeshRenderer.setBox(insideTrigger)
        utils.triggers.addTrigger(insideTrigger, NO_LAYERS, LAYER_1, [{type:'box', scale:Transform.get(insideTrigger).scale}], ()=>{
            triggeredMovement()
        },
        ()=>{
            triggeredMovement()
        })
}

function createEnvFlooring(){
    floorConfigs.forEach((config:any)=>{
        let floor = engine.addEntity()
        GltfContainer.create(floor, {src:"assets/b110b07c-a432-4c9b-a426-6ddaa9256588.glb"})
        Transform.create(floor, {position:config.position, scale:Vector3.create(1,1,1)})
    })
}

function triggeredMovement(){
    if(inside){
        // let videoPlayer = VideoPlayer.getMutableOrNull(videoEntity)
        // if(!videoPlayer){
        //     return
        // }
        // videoPlayer.volume = 1
        inside = false
    }else{
        inside = true
    }
}

let floorConfigs:any[] = [
    {position:Vector3.create(8,0,-40)},
    {position:Vector3.create(8,0,-24)},
    {position:Vector3.create(8,0,-8)},
    {position:Vector3.create(-8,0,-8)},
    {position:Vector3.create(-8,0,24)},
    {position:Vector3.create(-8,0,40)},
    {position:Vector3.create(-8,0,56)},

    {position:Vector3.create(24,0,-24)},
    {position:Vector3.create(40,0,-24)},
    {position:Vector3.create(56,0,-24)},
    {position:Vector3.create(72,0,-24)},
    {position:Vector3.create(88,0,-24)},

    {position:Vector3.create(56,0,-40)},
    {position:Vector3.create(56,0,-8)},
    {position:Vector3.create(72,0,-8)},
    {position:Vector3.create(88,0,-8)},

    {position:Vector3.create(104,0,-8)},
    {position:Vector3.create(104,0,-24)},
    {position:Vector3.create(104,0,-40)},
    {position:Vector3.create(120,0,-8)},
]