import { AvatarShape, EasingFunction, engine, MeshRenderer, Transform, Tween } from "@dcl/sdk/ecs";
import { Vector3 } from "@dcl/sdk/math";
import { colyseusRoom } from "./server";
import { utils } from "./helpers/libraries";

let xOffset = -16
let yOffset = -48

export function createNPC(npc:any){
    if(npc.c){
        console.log('custom npc model')
    }else{
        npc.entity = engine.addEntity()
        Transform.create(npc.entity, {position:Vector3.add(Vector3.create(npc.x, 0.1, npc.y), Vector3.create(xOffset, 0, yOffset))})

        let wearables:any[] = [
            'urn:decentraland:off-chain:base-avatars:f_eyes_00',
            'urn:decentraland:off-chain:base-avatars:f_eyebrows_00',
            'urn:decentraland:off-chain:base-avatars:f_mouth_00',
          ]

        if(npc.hs){
            wearables.push(npc.hs)
        }

        npc.wearables.forEach((item:any)=>{
            if(item.substring(0,3) === "urn"){
                wearables.push(item)
            }//
            else{
                wearables.push("urn:decentraland:matic:collections-v2:" + item)
            }
        })
    
        AvatarShape.create(npc.entity,{
            id:npc.id,
            name:npc.n,
            wearables: wearables,
            emotes:[]
        })
    
        utils.timers.setInterval(()=>{
            moveNPC(npc.id)
        }, 1000)
    }
}

export function moveNPC(id:any){
    console.log('moving npc', id)
    let npc = colyseusRoom.state.npcs.get(id)
    if(!npc){
        console.log('no npc found')
        return
    }

    Tween.createOrReplace(npc.entity, {
        mode: Tween.Mode.Move({
            start: Transform.get(npc.entity).position,
            end: Vector3.add(Vector3.create(npc.x, 0.1, npc.y), Vector3.create(xOffset, 0, yOffset)),
        }),
        duration: 1 * 1000,
        easingFunction: EasingFunction.EF_LINEAR,
    })
}

