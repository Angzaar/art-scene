import { Animator, AvatarShape, ColliderLayer, EasingFunction, engine, GltfContainer, MeshCollider, MeshRenderer, pointerEventsSystem, Transform, Tween, TweenLoop, TweenSequence } from "@dcl/sdk/ecs"
import { Vector3, Quaternion } from "@dcl/sdk/math"
import { Room } from "colyseus.js"
import { colyseusLottery, localUserId, sendServerMessage } from "./server"
import * as npc from 'dcl-npc-toolkit'
import { showDialogPanel } from "./ui/DialogPanel"
import { showStoreUI } from "./ui/createStoreUI"
import { showCreateChance, updateUserChances } from "./ui/createChanceUI"
import { showNotification } from "./ui/NotificationPanel"
import { NOTIFICATION_TYPES } from "./helpers/types"
import { createComponents } from "./helpers/blockchain"
import { displaySkinnyVerticalPanel } from "./ui/confirmMana"
import { showPlayChance } from "./ui/createPlayChanceUI"
import { utils } from "./helpers/libraries"
import { playSound } from "@dcl-sdk/utils"
import { pendingChance, showSendChancItemsUI } from "./ui/sendChanceItems"
import resources from "./helpers/resources"

export let lotteries:any[] = []
export let lotteryWallet:string = "0xA3FD0758DEE5F999bb52FFFD0325BF489F372156"
let spinWheel:any

export function createLotteryListeners(room:Room){
    sendServerMessage("get-lotteries", {} , colyseusLottery)
    room.onMessage('get-lotteries', async (info:any)=>{
        console.log('get-lotteries' + ' received', info)
        lotteries = info
        createLottery()
    })

    room.onMessage('lotto-beam', async (info:any)=>{
        tweenLottoBeam(info)
    })

    room.onMessage('play-chance', async (info:any)=>{
        console.log('play-chance' + ' received', info)
    })

    room.onMessage('lottery-active', async (info:any)=>{
        console.log('lottery-active' + ' received', info)
        let lottery = lotteries.find((lottery:any)=> lottery.id === info)
        if(!lottery){
            return
        }
        lottery.status = "active"
    })

    room.onMessage('new-lottery', async (info:any)=>{
        console.log('new-lottery' + ' received', info)
        lotteries.push(info)
        showSendChancItemsUI(true, info)
    })

    room.onMessage('lottery-finished', async (info:any)=>{
        console.log('lottery-finished' + ' received', info)
        let lottery = lotteries.find((lottery:any)=> lottery.id === info)
        if(!lottery){
            return
        }
        lottery.status = "finished"
    })

    room.onMessage('lottery-won', async (info:any)=>{
        console.log('lottery-won' + ' received', info)
        spinChance(true, info)
    })

    room.onMessage('lottery-lost', async (info:any)=>{
        console.log('lottery-lost' + ' received', info)
        spinChance(false, info)
    })

    room.onMessage('get-creator-chances', async (info:any)=>{
        console.log('get-creator-chances' + ' received', info)
        updateUserChances(info)
    })

    room.onMessage('lottery-no-exist', async (info:any)=>{
        console.log('lottery-no-exist' + ' received', info)
    })

    room.onMessage('lottery-cooldown', async (info:any)=>{
        console.log('lottery-cooldown' + ' received', info)
        showNotification({type:NOTIFICATION_TYPES.MESSAGE, message:"Please wait another " + info.wait + " seconds before trying this CHANCE again", animate:{enabled:true, return:true, time:5}})
    })
}

function createLottery(){
    // let avatar = engine.addEntity()
    // Transform.create(avatar, {position: Vector3.create(93,.1,-13), rotation:Quaternion.fromEulerDegrees(0,-110,0)})
    // AvatarShape.create(avatar, {
    //     id:'chance',
    //     name:"DecentCHANCE",
    //     wearables:["urn:decentraland:matic:collections-v2:0xef821786cdafc77294198c6ed70eac29e13d1b4e:1"],
    //     emotes:[]
    // })


    let building = engine.addEntity()
    Transform.create(building, {position:Vector3.create(70,0,-3), scale:Vector3.create(0.3,0.3,0.3), rotation:Quaternion.fromEulerDegrees(0,180,0)})
    GltfContainer.create(building, {src:'assets/stage.glb', visibleMeshesCollisionMask:ColliderLayer.CL_PHYSICS})

    spinWheel = engine.addEntity()
    Transform.create(spinWheel, {position: Vector3.create(70,2,-1.5), rotation:Quaternion.fromEulerDegrees(90,180,0), scale:Vector3.create(1.5,1.5,1.5)})
    // Transform.create(spinWheel, {position: Vector3.create(70,1,-3.5), rotation:Quaternion.fromEulerDegrees(0,0,0), scale:Vector3.create(1.5,1.5,1.5)})
    GltfContainer.create(spinWheel, {src: 'assets/spinner.glb', visibleMeshesCollisionMask:ColliderLayer.CL_POINTER})

    Animator.create(spinWheel, {states:[
        {clip:"MainWheelModelAction", playing:false, loop:false},
        {clip:"PointerAction", playing:false, loop:false},
    ]})
    npc.create(
        {position: Vector3.create(67,.9,-3), rotation:Quaternion.fromEulerDegrees(0,180,0)},
    {
        type: npc.NPCType.CUSTOM,
        model: 'assets/f4f22714-d03f-40b3-9263-3574d3ce7db1.glb',
        coolDownDuration:2,
        reactDistance:3,
        idleAnim:'idle.002',
        faceUser:true,
        onlyETrigger:true,
        onActivate:()=>{
            showDialogPanel(true, {dialogs:lotteryDialog})
            playSound('assets/Checkpoint.mp3', false)
        },
        onWalkAway:()=>{
            showDialogPanel(false)
        }
    }
    )

    // utils.timers.setTimeout(()=>{
    //     spinChance(true, {user:""})
    // }, 5000)
}

let lotteryDialog:npc.Dialog[] = [
    {text:"Try your hand at DecentCHANCE! Play chances created by other Decentraland users and win NFT prizes! ** This service not available in Client 2.0, and the best browser to use is Chrome **",
        isQuestion:true,
        buttons:[
            {label:"Play", goToDialog:-1, triggeredActions:()=>{
                showDialogPanel(false)
                showPlayChance(true)
            }},
            {label:"Create", goToDialog:-1, triggeredActions:()=>{
                showDialogPanel(false)
                showCreateChance(true)
            }},
            {label:"No thanks", goToDialog:-1, triggeredActions:()=>{
                showDialogPanel(false)
            }}
        ],
    }
]

export async function sendMana(item:any){
    let {mana} = await createComponents()
    let result:any = await mana.transfer(lotteryWallet, item.costToPlay)
    console.log('result is', result)

    if(result.code || result === "error"){
        return
    }
    displaySkinnyVerticalPanel(false)
    playSound('assets/gnomon_short_hacking.mp3', false)
}

export function spinChance(won:boolean, info:any){
    // Tween.createOrReplace(spinWheel, {
    //     mode: Tween.Mode.Rotate({
    //         start: Quaternion.fromEulerDegrees(0, 90, 0),
    //         end: Quaternion.fromEulerDegrees(0, 90, 180),
    //     }),
    //     duration: 700,
    //     easingFunction: EasingFunction.EF_LINEAR,
    // })
    
    // TweenSequence.createOrReplace(spinWheel, { sequence: [], loop: TweenLoop.TL_YOYO })

    let spinClip = Animator.getClip(spinWheel, "MainWheelModelAction")
    let pointerClip = Animator.getClip(spinWheel, "PointerAction")

    spinClip.shouldReset = true
    spinClip.playing = true

    pointerClip.shouldReset = true
    pointerClip.playing = true

    utils.timers.setTimeout(()=>{
        // TweenSequence.deleteFrom(spinWheel)
        // Tween.deleteFrom(spinWheel)

        if(info.user === localUserId){
            if(won){
                showNotification({type:NOTIFICATION_TYPES.MESSAGE, message:"You won the " + info.name + " CHANCE! The item(s) are being sent to your wallet!", animate:{enabled:true, return:true, time:7}})
                playSound('assets/loot_crate_open.mp3')
                sendServerMessage('lotto-beam', Transform.get(engine.PlayerEntity).position, colyseusLottery)
            }else{
                showNotification({type:NOTIFICATION_TYPES.MESSAGE, message:"You lost the " + info.name + " CHANCE! Try again", animate:{enabled:true, return:true, time:5}})
                playSound('assets/gameover.mp3', false)
            }
        }else{
            if(won){
                showNotification({type:NOTIFICATION_TYPES.MESSAGE, message:"Someone won the " + info.name, animate:{enabled:true, return:true, time:4}})
            }else{
                showNotification({type:NOTIFICATION_TYPES.MESSAGE, message:"Someone lost the " + info.name, animate:{enabled:true, return:true, time:4}})
            }
        }

    }, 1000 * 11)//
}

export function tweenLottoBeam(position:any){
    console.log('lotto beam position is', position)
    let ent = engine.addEntity()
    GltfContainer.createOrReplace(ent, {src:'assets/lootbeam_gold.glb'})
    Transform.createOrReplace(ent, {position:Vector3.create(position.x, 0, position.z), scale:Vector3.create(5,100, 5)})

    Tween.createOrReplace(ent, {
        mode: Tween.Mode.Scale({
            start: Vector3.create(5,100,5),
            end: Vector3.create(5,0,5),
        }),
        duration: 4000,
        // currentTime:0,
        easingFunction: EasingFunction.EF_LINEAR,
        }
    )
    utils.timers.setTimeout(()=>{
        engine.removeEntity(ent)
    }, 1000 * 4)
}