import { AvatarShape, engine, MeshCollider, MeshRenderer, Transform } from "@dcl/sdk/ecs"
import { Vector3, Quaternion } from "@dcl/sdk/math"
import { Room } from "colyseus.js"
import { colyseusLottery, sendServerMessage } from "./server"
import * as npc from 'dcl-npc-toolkit'
import { showDialogPanel } from "./ui/DialogPanel"
import { showStoreUI } from "./ui/createStoreUI"
import { showCreateChance } from "./ui/createChanceUI"
import { showNotification } from "./ui/NotificationPanel"
import { NOTIFICATION_TYPES } from "./helpers/types"
import { createComponents } from "./helpers/blockchain"
import { displaySkinnyVerticalPanel } from "./ui/confirmMana"
import { showPlayChance } from "./ui/createPlayChanceUI"

export let lotteries:any[] = []
export let lotteryWallet:string = "0xA3FD0758DEE5F999bb52FFFD0325BF489F372156"

export function createLotteryListeners(room:Room){
    sendServerMessage("get-lotteries", {} , colyseusLottery)
    room.onMessage('get-lotteries', async (info:any)=>{
        console.log('get-lotteries' + ' received', info)
        lotteries = info
        createLottery()
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
        showNotification({type:NOTIFICATION_TYPES.MESSAGE, message:"You won the " + info.name + " CHANCE! The item(s) are being sent to your wallet!", animate:{enabled:true, return:true, time:7}})
    })

    room.onMessage('lottery-lost', async (info:any)=>{
        console.log('lottery-lost' + ' received', info)
        showNotification({type:NOTIFICATION_TYPES.MESSAGE, message:"You lost the " + info.name + " CHANCE! Try again", animate:{enabled:true, return:true, time:5}})
    })
}

function createLottery(){
    let avatar = engine.addEntity()
    Transform.create(avatar, {position: Vector3.create(93,.1,-15), rotation:Quaternion.fromEulerDegrees(0,-110,0)})
    AvatarShape.create(avatar, {
        id:'chance',
        name:"DecentCHANCE",
        wearables:["urn:decentraland:matic:collections-v2:0xef821786cdafc77294198c6ed70eac29e13d1b4e:1"],
        emotes:[]
    })

    npc.create(
        {position: Vector3.create(93,1,-15)},
    {
        type: npc.NPCType.CUSTOM,
        model: '',
        coolDownDuration:2,
        reactDistance:3,
        faceUser:true,
        onActivate:()=>{
            console.log('show lottery')
            showDialogPanel(true, {dialogs:lotteryDialog})
        },
        onWalkAway:()=>{
            showDialogPanel(false)
        }
    }
    )
}

let lotteryDialog:npc.Dialog[] = [
    {text:"Try your hand at DecentCHANCE! Play chances created by other Decentraland users and win NFT prizes!",
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

    if(result.code || result === "error"){//
        return
    }
    displaySkinnyVerticalPanel(false)
}