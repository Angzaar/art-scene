import { AvatarShape, EasingFunction, engine, MeshRenderer, Transform, Tween } from "@dcl/sdk/ecs";
import { Quaternion, Vector3 } from "@dcl/sdk/math";
import { colyseusRoom } from "./server";
import { utils } from "./helpers/libraries";

let xOffset = -16
let yOffset = -48

export function removeNPC(npc:any){
    utils.timers.clearInterval(npc.dclInterval)
    engine.removeEntity(npc.entity)
}

export function createNPC(npc:any){
    if(npc.c){
        console.log('custom npc model')
    }else{
        npc.entity = engine.addEntity()
        let position = Vector3.create(npc.x, npc.y, npc.z)
        if(npc.canWalk){
            position = Vector3.add(position, Vector3.create(xOffset, 0, yOffset))
        }
        Transform.createOrReplace(npc.entity, {position:position, rotation:Quaternion.fromEulerDegrees(npc.rx, npc.ry, npc.rz), scale:Vector3.create(npc.sx, npc.sy, npc.sz)})

        if(npc.canWalk){
            startWalkingNPC(npc)
        }

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
            }
            else{
                wearables.push("urn:decentraland:matic:collections-v2:" + item)
            }
        })
    
        AvatarShape.create(npc.entity,{
            id: npc.id,
            name: npc.dn ? npc.n : "",//
            wearables: wearables,
            emotes: []
        })
    }
}

export function startWalkingNPC(npc:any){
    npc.dclInterval = utils.timers.setInterval(()=>{
        moveNPC(npc.id)
    }, 1000)
}

export function stopWalkingNPC(info:any){
    let npc = colyseusRoom.state.npcs.get(info.id)
    if(!npc){
        return
    }

    utils.timers.clearInterval(npc.dclInterval)
    let position = Vector3.create(info.pos[0], 0.1, info.pos[2])
    Transform.createOrReplace(npc.entity, {position:position, rotation:Quaternion.fromEulerDegrees(npc.rx, npc.ry, npc.rz), scale:Vector3.create(npc.sx, npc.sy, npc.sz)})

}

export function moveNPC(id:any){
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

export function updateNPC(info:any){
    let npc = colyseusRoom.state.npcs.get(info.id)//
    if(!npc){
        return
    }

    switch(info.action){
        case 'display-name':
            let avatarShape = AvatarShape.getMutableOrNull(npc.entity)
            if(!avatarShape){
                return
            }
            avatarShape.name = info.value ? npc.n : ""
            break;

        case 'transform':
            let transform:any = Transform.getMutable(npc.entity)
            let axis = ["x", "y", "z"][info.axis]
            switch(info.field){
                case 'p':
                    transform.position[axis] += (info.direction * info.modifier)
                    break;

                case 'r':
                    let rotation:any = Quaternion.toEulerAngles(transform.rotation)
                    rotation[axis] += (info.direction * info.modifier)
                    transform.rotation = Quaternion.fromEulerDegrees(rotation.x, rotation.y, rotation.z)
                    break;

                case 's':
                    transform.scale[axis] += (info.direction * info.modifier)
                    break;
            }
            break;
    }
}
