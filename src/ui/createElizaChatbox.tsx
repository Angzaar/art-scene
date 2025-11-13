

import ReactEcs, {Input, UiEntity} from '@dcl/sdk/react-ecs'
import {
    calculateImageDimensions,
    getAspect,
    getImageAtlasMapping,
    sizeFont
} from './helpers';
import resources, { dclColors } from '../helpers/resources';
import { uiSizes } from './uiConfig';
import { sendElizaChat } from '../eliza';
import { Color4 } from '@dcl/sdk/math';

let show = false
let selectedAgent:any

export let loading = true

let message = ""

export async function showElizaChat(value:boolean, data?:any){
    show = value
    if(data){
        selectedAgent = data
    }

    if(!value){
        message = ""
    }
}

export function createElizaChat() {
    return (
        <UiEntity
            key={resources.slug + "create::eliza::ui"}
            uiTransform={{
                display: show ? 'flex' : 'none',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '25%',
                height: '25%',
                positionType: 'absolute',
                position: {right: '2%', bottom: '2%'}
            }}
        >
<UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '100%',
                height: '100%',
            }}
            uiBackground={{
                textureMode: 'stretch',
                texture: {
                    src: 'images/atlas2.png',
                },
                uvs: getImageAtlasMapping(uiSizes.horizRectangle)
            }}
        >

<UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '20%',
                margin:'5%'
            }}
            uiText={{value:"Chat with " + (selectedAgent && selectedAgent.name), fontSize:sizeFont(30,25)}}
            />

            <Input
            uiTransform={{
                width:'90%',
                height:"40%",
            }}
            onChange={(e)=>{
                message = e.trim()
            }}
                onSubmit={(e) =>{ 
                    sendElizaChat(message.trim(), selectedAgent)
                    showElizaChat(false)
                }}
                fontSize={sizeFont(20,15)}
                color={Color4.White()}
                placeholder={"Enter message"}
                placeholderColor={Color4.White()}
                />

<UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '30%',
                height: '20%',
                margin:'5%'
            }}
            uiBackground={{
                textureMode: 'stretch',
                texture: {
                    src: 'images/atlas2.png',
                },
                uvs: getImageAtlasMapping(uiSizes.buttonPillBlue)
            }}
            uiText={{value:"Send", fontSize:sizeFont(30,25)}}
            onMouseDown={()=>{
                sendElizaChat(message.trim(), selectedAgent.id)
                showElizaChat(false)
            }}
            />
            </UiEntity>
    </UiEntity>
    )
}