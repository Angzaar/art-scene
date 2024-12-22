import { engine, Entity, GltfContainer, Material, MeshRenderer, pointerEventsSystem, Rotate, Transform } from "@dcl/sdk/ecs"
import { Color4, Quaternion, Vector3 } from "@dcl/sdk/math"
import { sendServerMessage } from "../server"

export let customItemsMap:Map<string, any> = new Map()
export let customEntitiesToItemsMap:Map<Entity, any> = new Map()

export function deleteCustomItem(id:any){
    let item = customItemsMap.get(id)
    console.log('item to delete is', item)
    if(!item){
        return
    }

    engine.removeEntity(item.ent)
    customItemsMap.delete(id)
}

export function addCustomItems(items:any[]){
    items.forEach((item:any)=>{
        let ent = engine.addEntity()
        item.ent = ent
        customItemsMap.set(item.id, item)
        customEntitiesToItemsMap.set(ent, item.id)//
        if(item.enabled){
            enableItem(item)
        }
    })
}

function enableItem(item:any){
    Transform.createOrReplace(item.ent, {position: item.transform.pos, scale:item.transform.scl, rotation:Quaternion.fromEulerDegrees(item.transform.rot.x, item.transform.rot.y, item.transform.rot.z)})
    GltfContainer.createOrReplace(item.ent, {src:"assets/custom/" + item.model})//
}

function disableItem(item:any){
    Transform.deleteFrom(item.ent)
    GltfContainer.deleteFrom(item.ent)
}

export function updateCustomItem(info:any){
    let item = customItemsMap.get(info.id)
    if(!item){
        console.log('no item to update')
        return
    }

    switch(info.action){
        case 'status':
            if(info.value){
                enableItem(item)
            }else{
                disableItem(item)
            }
            break;

        case 'model':
            let gltf_container = GltfContainer.getMutableOrNull(item.ent)
            if(gltf_container){
                gltf_container.src = "assets/custom/" + info.value
            }
            break;

        case 'transform':
            let transform:any = Transform.getMutableOrNull(item.ent)
            let field:any
            
            switch(info.field){
                case 'pos':
                    field = "position"
                break;

                case 'rot':
                    field = "rotation"
                break;

                case 'scl':
                    field = "scale"
                break;
            }

            if(!transform){
                return
            }
            switch(field){
                case 'position':
                case 'scale':
                    transform[field][info.axis] += (info.direction * info.modifier)
                    break;

                case 'rotation':
                    let rotation:any = Quaternion.toEulerAngles(transform.rotation)
                    rotation[info.axis] += (info.direction * info.modifier)

                    transform.rotation = Quaternion.fromEulerDegrees(rotation.x, rotation.y, rotation.z)
                    break;

            }
            // Transform.createOrReplace(item.ent, {position: item.transform.pos, scale:item.transform.scl, rotation:Quaternion.fromEulerDegrees(item.transform.rot.x, item.transform.rot.y, item.transform.rot.z)})
            break;
      }
}