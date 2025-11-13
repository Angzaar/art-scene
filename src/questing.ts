import { engine, Entity, GltfContainer, InputAction, Material, MeshRenderer, pointerEventsSystem, TextAlignMode, TextShape, Transform, TransformType, TweenSequence, Tween, TweenLoop, EasingFunction, MeshCollider, ColliderLayer } from "@dcl/sdk/ecs"
import { Color4, Quaternion } from "@dcl/sdk/math"
import { Vector3 } from "@dcl/sdk/math"
import { getPlayer } from "@dcl/sdk/players"
import resources from "./helpers/resources"
import { LSCQuestAction, LSCQuestConnect, LSCQuestLeaderboard, LSCQuestStart, createQuestUI } from "lsc-questing-dcl"
import { openExternalUrl } from "~system/RestrictedActions"

let questId = "KsyZNX"
let stepId = "SksNfB"

let eggs:any= [
    {model:'assets/egg.glb', transform:{position: Vector3.create(74,0,16), rotation: Quaternion.fromEulerDegrees(0,0,0), scale: Vector3.create(1,1,1)}, questId: 'zz397S', stepId: 'SqCULa', taskId: 'OLQI1'},
    {model:'assets/egg.glb', transform:{position: Vector3.create(26,15.4,-18), rotation: Quaternion.fromEulerDegrees(0,0,0), scale: Vector3.create(1,1,1)}, questId: 'zz397S', stepId: '3N8LsP', taskId: 'HEPZb'},
    {model:'assets/egg.glb', transform:{position: Vector3.create(36.5,1,55), rotation: Quaternion.fromEulerDegrees(0,0,0), scale: Vector3.create(1,1,1)}, questId: 'zz397S', stepId: 'SqCULa', taskId: 'Tm8t7'},
    
    {model:'assets/egg.glb', transform:{position: Vector3.create(42,46,-29), rotation: Quaternion.fromEulerDegrees(0,0,0), scale: Vector3.create(1,1,1)}, questId: 'zz397S', stepId: '3N8LsP', taskId: 'QH8Rr'},
    {model:'assets/egg.glb', transform:{position: Vector3.create(118,16,56), rotation: Quaternion.fromEulerDegrees(0,0,0), scale: Vector3.create(1,1,1)}, questId: 'zz397S', stepId: '3N8LsP', taskId: 'iZLWI'},
    {model:'assets/egg.glb', transform:{position: Vector3.create(88,.5,-22.5), rotation: Quaternion.fromEulerDegrees(0,0,0), scale: Vector3.create(1,1,1)}, questId: 'zz397S', stepId: '3N8LsP', taskId: 'qNSUP'},
    {model:'assets/egg.glb', transform:{position: Vector3.create(22,.5,-24), rotation: Quaternion.fromEulerDegrees(0,0,0), scale: Vector3.create(1,1,1)}, questId: 'zz397S', stepId: '3N8LsP', taskId: 'mGrfX'},
]


export function addQuest(){
    //sponsors
    let sponsors = engine.addEntity()
    Transform.create(sponsors, {position: Vector3.create(86,-1,5), rotation: Quaternion.fromEulerDegrees(0,0,0), scale: Vector3.create(4,3,1)})
    GltfContainer.create(sponsors, {src: "assets/chinese_flag.glb"})

    let header = engine.addEntity()
    Transform.create(header, {position: Vector3.create(86,4.5,5.02), rotation: Quaternion.fromEulerDegrees(0,180,0), scale: Vector3.create(1,1,1)})
    TextShape.create(header, {text: "Egg Hunt Sponsors", fontSize: 2})

    fetchSponsors()

    //map
    let map = engine.addEntity()
    Transform.create(map, {position: Vector3.create(90,1.5, 5.5), rotation: Quaternion.fromEulerDegrees(0,180,0), scale: Vector3.create(4,3,1)})
    MeshRenderer.setPlane(map)
    Material.setPbrMaterial(map, {texture: Material.Texture.Common({
      src: 'https://dclstreams.com/media/images/02493afa-5af8-46ee-be6f-ee3485230fb8.png',
    }),
    })


    //bunny
    let bunny = engine.addEntity()
    Transform.create(bunny, {position: Vector3.create(84,1, 8.5), rotation: Quaternion.fromEulerDegrees(0,0,0), scale: Vector3.create(1,1,1)})
    GltfContainer.create(bunny, {src: "assets/bunny.glb", visibleMeshesCollisionMask:ColliderLayer.CL_POINTER})
    pointerEventsSystem.onPointerDown({entity:bunny, opts:{button:InputAction.IA_PRIMARY, hoverText:'Start Egg Quest!', maxDistance:10}},()=>{
      LSCQuestStart(questId)
      })

    //leaderboard
    let flag = engine.addEntity()
    Transform.create(flag, {position: Vector3.create(82,-1,5), rotation: Quaternion.fromEulerDegrees(0,0,0), scale: Vector3.create(4,3,1)})
    GltfContainer.create(flag, {src: "assets/chinese_flag.glb"})

LSCQuestLeaderboard(
    questId, // questId
    {position: Vector3.create(82,4.3,5.02), rotation: Quaternion.fromEulerDegrees(0,180,0), scale: Vector3.create(0.5,0.5,0.5)}, // position in Vector3
    5, // updateInterval in seconds
    10, // limit of users to show
    'desc', // order 'asc' or 'desc'
    'progress', // sortBy 'elapsedTime' or other quest field
    false, // completed users only
    true, // showBackground
    "Egg Hunt 2025" // title
  )

  let click = engine.addEntity()
  Transform.create(click, {position: Vector3.create(82,3.3,5.02), rotation: Quaternion.fromEulerDegrees(0,0,0), scale: Vector3.create(2,4,1)})
  // MeshRenderer.setBox(click)
  MeshCollider.setBox(click)
  pointerEventsSystem.onPointerDown({entity:click, opts:{button:InputAction.IA_POINTER, hoverText:'View Leaderboard', maxDistance:10}},()=>{
    openExternalUrl({url:resources.DEBUG ? 
        `http://localhost:5353/api/quests/${questId}/users?format=html` :
         `https://angzaar-plaza.dcl-iwb.co/ws/api/quests/${questId}/users?limit=100&orderBy=desc&sortBy=progress&format=html`
    })
  })

  createEggs()
  createQuestUI()
}

function createEggs(){
    LSCQuestConnect(questId)

    for(let egg of eggs){
        let eggEntity = engine.addEntity()
        Transform.create(eggEntity, egg.transform)
        GltfContainer.create(eggEntity, {src: egg.model})
        pointerEventsSystem.onPointerDown({entity:eggEntity, opts:{button:InputAction.IA_PRIMARY, hoverText:'Collect Egg', maxDistance:3}},()=>{
            LSCQuestAction(questId, stepId, egg.taskId)
            engine.removeEntity(eggEntity)
        })

        Tween.create(eggEntity, {
            mode: Tween.Mode.Rotate({
                start: Quaternion.fromEulerDegrees(0, 0, 0),
                end: Quaternion.fromEulerDegrees(0, 180, 0),
            }),
            duration: 700,
            easingFunction: EasingFunction.EF_LINEAR,
        })
        TweenSequence.create(eggEntity, {
            loop: TweenLoop.TL_RESTART,
            sequence: [
                {
                    mode: Tween.Mode.Rotate({
                        start: Quaternion.fromEulerDegrees(0, 180, 0),
                        end: Quaternion.fromEulerDegrees(0, 360, 0),
                    }),
                    duration: 700,
                    easingFunction: EasingFunction.EF_LINEAR,
                },
            ],
        })
    }
}

async function fetchSponsors(){
  try {
    const response = await fetch(`https://angzaar-plaza.dcl-iwb.co/ws/admin/quests/1b66919c-4f7b-4401-b867-0290ae2daf68`)
    const data = await response.json()
    console.log(data)
    if(data.valid){
      let quest = data.quests.find((quest:any)=>quest.questId === questId)
      if(quest){
        let step =quest.steps[0]
        let sponsors = getUniqueBaseNames(step.tasks)
        console.log(sponsors)
        let yOffset = 0
        let column = 0
        const totalSponsors = sponsors.length
        const sponsorsPerColumn = Math.ceil(totalSponsors / 2)
        
        for(let i = 0; i < sponsors.length; i++){
            const sponsor = sponsors[i]
            // Switch to second column after half the sponsors
            if(i === sponsorsPerColumn) {
                column = 1
                yOffset = 0
            }
            
            let sponsorEntity = engine.addEntity()
            const xPos = column === 0 ? 86.5 : 85.5 // Left column at x=85, right column at x=87
            Transform.create(sponsorEntity, {position: Vector3.create(xPos, 4.3-yOffset, 5.02), rotation: Quaternion.fromEulerDegrees(0,180,0), scale: Vector3.create(0.5,0.5,0.5)})
            TextShape.create(sponsorEntity, {text: sponsor, fontSize: 2})
            yOffset += 0.2
        }
      }
    }
  } catch (error) {
    console.error('Error fetching sponsors:', error)
  }
}

// Function to get unique base names
function getUniqueBaseNames(data: { description: string }[]): string[] {
  // Extract base name by removing trailing numbers and whitespace
  const baseNames = data.map(item => item.description.replace(/\s*\d+$/, "").trim());
  // Deduplicate using Set and filter out 'Wearable Reward'
  return [...new Set(baseNames)]
    .filter(name => name !== 'Wearable Reward')
    .sort((a, b) => a.localeCompare(b));
}