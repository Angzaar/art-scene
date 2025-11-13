import { Color4, Quaternion, Vector3 } from "@dcl/sdk/math";
import * as npc from 'dcl-npc-toolkit'
import { showElizaChat } from "./ui/createElizaChatbox";
import { Animator, AvatarShape, Billboard, BillboardMode, ColliderLayer, engine, Entity, GltfContainer, InputAction, Material, MeshRenderer, pointerEventsSystem, TextAlignMode, TextShape, Transform, VisibilityComponent } from "@dcl/sdk/ecs";
import resources from "./helpers/resources";
import {localUser, localUserId } from "./server";
import { connect } from "./helpers/connection";
import { Room } from "colyseus.js";
import { elizaCharacterTemplate } from "./elizaCharacterTemplate";
import { showAgentCreationWelcome } from "./ui/createElizaWelcome";
import { showAgentBasics } from "./ui/agent-creation/agentBasics";
import { showAgentBio } from "./ui/agent-creation/agentBio";
import { showAgentConfirmCreate } from "./ui/agent-creation/confirmCreate";
import { showNotification } from "./ui/NotificationPanel";
import { NOTIFICATION_TYPES } from "./helpers/types";
import { getRealm } from "~system/Runtime";

export let agentRoom:string = 'agent_room'
export let colyseusAgentsRoom:Room | undefined

let agents:any[] = [
    {model:"assets/dtrump.glb", name:"Donald Trump", position:Vector3.create(80,0,-15)}
]

// let agentStatus = "idle"
// let agentId:string = "e0e10e6f-ff2b-0d4c-8011-1fc1eee7cb32"
// let bubble:any
// let textEntity:any = ""

let machine:Entity


function removeAgentRoom(){
    colyseusAgentsRoom = undefined
}

export function createAIAgentMachine(){
    createAgentMachine()
    // let model = engine.addEntity()
    // GltfContainer.create(model, {src:'assets/dtrump.glb', visibleMeshesCollisionMask:ColliderLayer.CL_PHYSICS})
    // Transform.create(model, {position: Vector3.create(80,0,-15)})
    // Animator.create(model, {states:[
    //     {clip:"breathe", playing:true, loop:true}
    // ]})

    // let ncp = npc.create(
    //         {position: Vector3.create(80,0,-15), rotation:Quaternion.fromEulerDegrees(0,180,0)},
    //     {
    //         type: npc.NPCType.CUSTOM,
    //         // model:'',
    //         // model: 'assets/dtrump.glb',
    //         model:'assets/DTnewrigOPTHappy.glb',
    //         coolDownDuration:2,
    //         reactDistance:3,
    //         idleAnim:'Animation',
    //         faceUser:true,
    //         // onlyETrigger:true,
    //         onActivate:()=>{
    //             console.log('activate trump')
    //             showElizaChat(true)
    //         },
    //         onWalkAway:()=>{
    //             showElizaChat(false)
    //             updateAgent("", false)
    //         }
    //     }
    //     )

    // bubble = engine.addEntity()
    // Transform.create(bubble, {parent: ncp, position:Vector3.create(0,2.5,0), scale:Vector3.create(2.5,0.5,1)})
    // MeshRenderer.setPlane(bubble)
    // Material.setPbrMaterial(bubble, {albedoColor:Color4.Black()})
    // Billboard.create(bubble, {billboardMode:BillboardMode.BM_Y})

    // textEntity = engine.addEntity()
    // Transform.create(textEntity, {parent:ncp, position:Vector3.create(0,2.5,.02), scale:Vector3.create(1,1,1)})
    // Billboard.create(textEntity, {billboardMode:BillboardMode.BM_Y})
    // TextShape.create(textEntity, {width:2.5, height:2.5, text:"", textColor:Color4.White(), fontSize:0.5,textAlign:TextAlignMode.TAM_MIDDLE_CENTER, textWrapping:true})
    // VisibilityComponent.createOrReplace(bubble, {visible:false})
    // VisibilityComponent.createOrReplace(textEntity, {visible:false})
}

export async function sendElizaChat(message:string, agent:any){
    console.log('sending eliza chat to agent', agent.name, message)
    if(agent.status !== "idle"){
        return
    }

    agent.status = "thinking"
    updateAgent("thinking...", agent, true)
    console.log(resources.endpoints.elizaLocal + agent.id + "/" + "message")

    try{
        let res = await fetch((resources.DEBUG ? resources.endpoints.elizaLocal : resources.endpoints.elizaProd) + agent.id + "/" + "message", {
            // let res = await fetch((resources.endpoints.elizaLocal) + agentId + "/" + "message", {
            headers:{
                "Content-type": "application/json",
            },
            method:"POST",
            body:JSON.stringify({user:localUser.name, text:message})
        })
        let resJson = await res.json()
        console.log('response was', resJson)
        agent.status = "speaking"
        updateAgent(resJson[0].text, agent, true)
        agent.status = "idle"
         showElizaChat(true)
    }
    catch(e:any){
        console.log('error sending eliza chat', e)
        agent.status = "speaking"
        updateAgent("Error connecting", agent, true)
        agent.status = "idle"
    }
}

function updateAgent(message:string, agent:any, visible:boolean){
    VisibilityComponent.createOrReplace(agent.chatBubbleEntity, {visible:visible})
    VisibilityComponent.createOrReplace(agent.chatBubbleTextEntity, {visible:visible})
    TextShape.getMutable(agent.chatBubbleTextEntity).text = message
}

async function create3DAgent(id:string, agent:any){
    agent.status = "idle"

    let wearables:any[] = []
    let bodyShape:any = "urn:decentraland:off-chain:base-avatars:BaseMale"
    if(resources.DEBUG){
        wearables = localUser.wearables
    }else{
        try{
            const { realmInfo } = await getRealm({})
            const url = `${realmInfo?.baseUrl}/lambdas/profiles/${agent.userId}`
            console.log('using URL: ', url)

            let res = await fetch(url)
            let json = await res.json()

            console.log('full response: ', json)
            console.log('player is wearing :',json.avatars[0].avatar.wearables)
            console.log('player owns :', json.avatars[0].inventory)

            wearables = json.avatars[0].avatar.wearables
            bodyShape = json.avatars[0].avatar.bodyShape
        }
        catch(e:any){
            console.log('error fetching user wearables', e)
        }
    }
    
    agent.entity =  npc.create(
        {position: agent.position, rotation:Quaternion.fromEulerDegrees(agent.rotation.x, agent.rotation.y, agent.rotation.z)},
    {
        type: npc.NPCType.CUSTOM,
        model:'',
        // model:{
        //     wearables:wearables,
        //     emotes:[],
        //     id:agent.id,
        //     name:agent.name
        // },
        coolDownDuration:2,
        reactDistance:3,
        idleAnim:'Animation',
        faceUser:true,
        // onlyETrigger:true,
        onActivate:()=>{
            if(agent.status === "idle"){
                showElizaChat(true, agent)
            }
        },
        onWalkAway:()=>{
            showElizaChat(false)
            updateAgent("", agent, false)
        }
    }
    )

    agent.chatBubbleEntity = engine.addEntity()
    Transform.create(agent.chatBubbleEntity, {parent: agent.entity, position:Vector3.create(0,2.5,0), scale:Vector3.create(2.5,0.5,1)})
    MeshRenderer.setPlane(agent.chatBubbleEntity)
    Material.setPbrMaterial(agent.chatBubbleEntity, {albedoColor:Color4.Black()})
    Billboard.create(agent.chatBubbleEntity, {billboardMode:BillboardMode.BM_Y})

    agent.chatBubbleTextEntity = engine.addEntity()
    Transform.create(agent.chatBubbleTextEntity, {parent:agent.entity, position:Vector3.create(0,2.5,.02), scale:Vector3.create(1,1,1)})
    Billboard.create(agent.chatBubbleTextEntity, {billboardMode:BillboardMode.BM_Y})
    TextShape.create(agent.chatBubbleTextEntity, {width:2.5, height:2.5, text:"", textColor:Color4.White(), fontSize:0.5,textAlign:TextAlignMode.TAM_MIDDLE_CENTER, textWrapping:true})
    VisibilityComponent.createOrReplace(agent.chatBubbleEntity, {visible:false})
    VisibilityComponent.createOrReplace(agent.chatBubbleTextEntity, {visible:false})

    let avatar = engine.addEntity()
    Transform.create(avatar, {parent:agent.entity})
    AvatarShape.createOrReplace(avatar, {
        id:agent.id,
        name:agent.name,
        bodyShape:bodyShape,
        wearables:wearables,
        emotes:[]
    })
}

function createAgentListeners(room:Room){


    room.onMessage("error", (info:any)=>{
        showNotification({type:NOTIFICATION_TYPES.MESSAGE, message: info, animate:{enabled:true, return:true, time:5}})
    })

    room.onMessage("can-create", (info:any)=>{
        console.log('can-create received', info)
        if(!info.create){
            showNotification({type:NOTIFICATION_TYPES.MESSAGE, message: "You do not have permissions to create an A.I. Agent", animate:{enabled:true, return:true, time:5}})
            return
        }else{
            showAgentCreationWelcome(true)
        }
    })

    room.onMessage("agent-created", (info:any)=>{
        if(!info.created){
            showNotification({type:NOTIFICATION_TYPES.MESSAGE, message: "There was an error processing your agent. Please try again.", animate:{enabled:true, return:true, time:5}})
            return
        }else{
            showNotification({type:NOTIFICATION_TYPES.MESSAGE, message: "Your A.I. Agent creation was successful! Your agent will load in " + info.time + " seconds", animate:{enabled:true, return:true, time:5}})
        }
    })

    room.state.listen("restarting", (current:any, previous:any)=>{
      if(current){
        disableAllAgents()
      }else{
        if(previous !== undefined){
            enableAllAgents()
        }
      }
    })

    room.state.agents.onAdd((agent:any, id:string)=>{
        console.log('agent added', id, agent)
        create3DAgent(id, agent)
    })
}

function createAgentMachine(){
    machine = engine.addEntity()
    GltfContainer.create(machine, {src:'assets/cpc_machine.glb'})
    Transform.create(machine, {position:Vector3.create(76, 0, 24), rotation:Quaternion.fromEulerDegrees(0,270,0)})
    pointerEventsSystem.onPointerDown({entity:machine, opts:{
        button:InputAction.IA_PRIMARY, hoverText:"AI Agent Creator", maxDistance:10
    }}, ()=>{
        console.log('begin agent creation')
        colyseusAgentsRoom?.send('can-create')
    })
}

export function connectToAgentNetwork(data:any){
    connect(agentRoom, data, undefined, 'dcl', 'all-agents', undefined, resources.DEBUG ? resources.endpoints.elizaRoomLocal : resources.endpoints.elizaRoomProd).then((room: Room) => {
        console.log("Connected to agent room");
        colyseusAgentsRoom = room

        room.onLeave((code: number) => {
            console.log('left agent room with code', code)
            removeAgentRoom()
            disableAllAgents()

            if(code === 4010){
                console.log('user was banned')
            }

            if(code === 4999){

            }
        })
        createAgentListeners(room)
    }).catch((err) => {
        console.error('colyseus connection error to agent room', err)
    });
}

function disableAllAgents(){
    colyseusAgentsRoom?.state.agents.forEach((agent:any, id:string)=>{
        agent.status = "disabled"
        updateAgent("", agent, false)
    })
}

function enableAllAgents(){
    colyseusAgentsRoom?.state.agents.forEach((agent:any, id:string)=>{
        agent.status = "idle"
        updateAgent("", agent, false)//
    })
}







///agent creation variables
export let newAgent:any = {...elizaCharacterTemplate}
resetNewAgent()

export let creationPage:number = -1
export let totalSteps:number = 7

export function createElizaAgent(){
    showAgentConfirmCreate(false)
    colyseusAgentsRoom?.send('create-agent', {...newAgent, userId:localUserId})
    showNotification({type:NOTIFICATION_TYPES.MESSAGE, message: "Your A.I. Agent is being created! Please wait...", animate:{enabled:true, return:true, time:5}})
    resetNewAgent()
}

export function updateNewAgent(data:any, array?:boolean){
    if(array){
        for(let key in data){
            newAgent[key].push(data[key])
        }
    }else{
        for(let key in data){
            if(newAgent.hasOwnProperty(key)){
                newAgent[key] = data[key]
            }
        }
    }

    console.log('new agent is', newAgent)
}

export function hideAllCreationPages(){
    showAgentCreationWelcome(false)
    showAgentBasics(false)
    showAgentBio(false)
    showAgentConfirmCreate(false)
}

export function resetNewAgent(){
    newAgent.name = "placeholder"
    newAgent.bio = []
    newAgent.lore = []
    newAgent.knowledge = []
    newAgent.messageExamples = []
    newAgent.postExamples = []
    newAgent.topics = []
    newAgent.style = {
        all:[],
        chat:[],
        post:[]
    }
    newAgent.adjectives = []
    newAgent.position = {}
    newAgent.rotation = {}
    creationPage = -1
}

export function paginateAgentCreation(page:number){
    creationPage += page
    hideAllCreationPages()

    switch(creationPage){
        case -1:
            showAgentCreationWelcome(true)
            break;

        case 0:
            showAgentBasics(true)
            break;

         case 8:
            showAgentConfirmCreate(true)
            break;
    }
}