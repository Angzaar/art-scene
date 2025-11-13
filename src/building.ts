import { NO_LAYERS, LAYER_1 } from "@dcl-sdk/utils";
import { Billboard, BillboardMode, engine, Entity, GltfContainer, MeshRenderer, TextShape, Transform, VideoPlayer } from "@dcl/sdk/ecs";
import { Color4, Quaternion, Vector3 } from "@dcl/sdk/math";
import { addBuilderHUDAsset } from "./dcl-builder-hud";
import { utils } from "./helpers/libraries";
import { mallConfig } from "./shopsConfig";
import { addShop } from "./shops";
import { movePlayerTo } from "~system/RestrictedActions";

export let building:Entity
export let inside:boolean = false

export function initBuilding(){
    building = engine.addEntity()
    // GltfContainer.create(building, {src: "assets/building.glb"})
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


        createMall()
}

function createMall(){
    for(let aid in mallConfig.IWB){
        let item = mallConfig.IWB[aid]
        switch(item.type){
            case '3D':
                let entity = engine.addEntity()
                let transform = mallConfig.Transform[aid]
                Transform.create(entity, {position: Vector3.create(transform.p.x - 16, transform.p.y, transform.p.z - 48), rotation:Quaternion.fromEulerDegrees(transform.r.x, transform.r.y, transform.r.z), scale:transform.s})
                GltfContainer.create(entity, {src:'assets/' + item.id + ".glb"})

                addShop(item, mallConfig.Name[aid].value, transform, entity)

                if(mallConfig.Name[aid].value.toLowerCase().includes("indicator")){
                    Billboard.create(entity, {billboardMode:BillboardMode.BM_Y})
                    addBuilderHUDAsset(entity, mallConfig.Name[aid].value)
                }
                break;
        }
    }

    addTeleporters()
}

function addTeleporters(){
    // utils.triggers.enableDebugDraw(true)
    let tele1 = engine.addEntity()
    Transform.create(tele1, {position:Vector3.create(116, 1, 11.79)})
    utils.triggers.addTrigger(tele1, NO_LAYERS, LAYER_1, [{type:'box', scale:Vector3.create(2,4,2)}],()=>{
        movePlayerTo({newRelativePosition:{x:109, y:18, z:11.79}})
    })

    let tele2 = engine.addEntity()
    Transform.create(tele2, {position:Vector3.create(32, 1, 4.1)})
    utils.triggers.addTrigger(tele2, NO_LAYERS, LAYER_1, [{type:'box', scale:Vector3.create(2,4,2)}],()=>{
        movePlayerTo({newRelativePosition:{x:32, y:18, z:-5}})
    })

    let tele3 = engine.addEntity()
    Transform.create(tele3, {position:Vector3.create(43, 17, -6.92)})
    utils.triggers.addTrigger(tele3, NO_LAYERS, LAYER_1, [{type:'box', scale:Vector3.create(2,4,2)}],()=>{
        movePlayerTo({newRelativePosition:{x:32, y:50, z:-28}})
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
    // {position:Vector3.create(-8,0,-8)},
    {position:Vector3.create(-8,0,24)},
    {position:Vector3.create(-8,0,40)},
    {position:Vector3.create(-8,0,56)},

    // {position:Vector3.create(24,0,-24)},
    // {position:Vector3.create(40,0,-24)},
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
    // {position:Vector3.create(120,0,-8)},
]