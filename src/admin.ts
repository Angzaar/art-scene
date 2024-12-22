import { Entity, engine, MeshRenderer, pointerEventsSystem, Transform, Material, InputAction, MeshCollider, ColliderLayer } from "@dcl/sdk/ecs"
import { Vector3, Color4 } from "@dcl/sdk/math"
import { sendServerMessage } from "./server"
import { showNotification } from "./ui/NotificationPanel"
import { NOTIFICATION_TYPES } from "./helpers/types"
import { utils } from "./helpers/libraries"

export let gridEntities:any[] = []
let creatingGrid:boolean = false

export function toggleGridItem(info:any){
    let gridData = gridEntities.find((grid:any)=> grid.x === info.x && grid.y === info.y)
    console.log('found grid entity is', gridData)
    if(!gridData){
        return
    }

    if(info.enabled){
        Material.setPbrMaterial(gridData.entity, {albedoColor:Color4.create(0,1,0,.5)})
    }else{
        Material.setPbrMaterial(gridData.entity, {albedoColor:Color4.create(1,0,0,.5)})
    }
}

export function handleNPCTabSelection(info:any){
    if(info.selection === "npcs"){
        showNotification({type:NOTIFICATION_TYPES.MESSAGE, message:"Removing grid...please wait.", animate:{enabled:true, return:true, time:7}})
        utils.timers.setTimeout(()=>{
            creatingGrid = false
            gridEntities.forEach((grid:any)=>{
                engine.removeEntity(grid.entity)
            })
            gridEntities.length = 0
        }, 2000)
    }else{
        showNotification({type:NOTIFICATION_TYPES.MESSAGE, message:"Loading grid...please wait for all sqaures to load and colorize.", animate:{enabled:true, return:true, time:7}})
        utils.timers.setTimeout(()=>{
            let xOffset = -16
            let yOffset = -48
            creatingGrid = true
            for(let x = 0; x <= 144; x++){
                for(let y = 0; y<= 112; y++){
                    if(!creatingGrid){
                        return
                    }
                    let ent = engine.addEntity()
                    Transform.create(ent, {position:Vector3.create(x + xOffset + 0.5, 0.5, y + yOffset + 0.5), scale: Vector3.create(.9,.9,.9)})
                    MeshRenderer.setBox(ent)
                    MeshCollider.setBox(ent, ColliderLayer.CL_POINTER)
                    gridEntities.push({entity:ent, x:x, y:y})
    
                    pointerEventsSystem.onPointerDown({entity:ent, opts:{
                        button:InputAction.IA_SECONDARY, maxDistance:5, hoverText:"Toggle Obstacle"
                    }}, ()=>{
                        sendServerMessage('toggle-npc-obstacle', {x,y})
                    })
                }
            }
            info.grid.forEach((gridItem:any, index:number)=>{
                if(gridItem.enabled){
                    Material.setPbrMaterial(gridEntities[index].entity, {albedoColor:Color4.create(0,1,0,.5)})
                }else{
                    Material.setPbrMaterial(gridEntities[index].entity, {albedoColor:Color4.create(1,0,0,.5)})
                }
            })
        }, 2000)
    }
}