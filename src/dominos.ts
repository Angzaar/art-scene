import { AvatarShape, engine, GltfContainer, Transform } from "@dcl/sdk/ecs";
import { Quaternion, Vector3 } from "@dcl/sdk/math";
import { connectDominos } from "./dominos/index";

export function initDominos(){
    let entity = engine.addEntity()
    Transform.create(entity, {position: Vector3.create(97, 0, -4.75), rotation:Quaternion.fromEulerDegrees(0,-90,0)})
    GltfContainer.create(entity, {src:"assets/dominos.glb"})

    let avatar = engine.addEntity()
	Transform.create(avatar, {position: Vector3.create(94,.1,-5.9), rotation:Quaternion.fromEulerDegrees(0,180,0)})
	AvatarShape.create(avatar, {
		id:'SR',
		name:"Pizzaiolo",
		wearables:["urn:decentraland:matic:collections-v2:0x828ab5dbef764e1844c9689b824d1bfd78a2b46c:1"],
		emotes:[]
	})
}

