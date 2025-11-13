import ReactEcs, {Input, UiEntity} from '@dcl/sdk/react-ecs'
import {
    calculateImageDimensions,
    getAspect,
    getImageAtlasMapping,
    sizeFont
} from './helpers';
import resources, { dclColors } from '../helpers/resources';
import { uiSizes } from './uiConfig';
import { CustomButton } from './CustomButton';
import { hideAllCreationPages, paginateAgentCreation, resetNewAgent } from '../eliza';
import { showAgentCreatorUI } from './createElizaCreator';

let show = false

export function showAgentCreationWelcome(value:boolean){
    show = value

    if(value){
        resetNewAgent()
    }
}

export function createElizaWelcomeUI() {
    return (
        <UiEntity
            key={resources.slug + "eliza::welcome-ui"}
            uiTransform={{
                display: show ? 'flex' : 'none',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: calculateImageDimensions(30, getAspect(uiSizes.vertRectangle)).width,
                height: calculateImageDimensions(30, getAspect(uiSizes.vertRectangle)).height,
                positionType: 'absolute',
                position: {right: '35%', bottom: '25%'}
            }}
            uiBackground={{
                textureMode: 'stretch',
                texture: {
                    src: resources.textures.atlas2
                },
                uvs: getImageAtlasMapping(uiSizes.vertRectangle)
            }}
            onMouseDown={()=>{}}
            onMouseUp={()=>{}}
        >

<UiEntity
uiTransform={{
    display: show ? 'flex' : 'none',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '15%',
    margin:{top:"5%"}
}}
uiText={{value:"Angzaar A.I.", fontSize:sizeFont(35,30)}}
/>

<UiEntity
uiTransform={{
    display: show ? 'flex' : 'none',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '65%',
    height: '15%',
    margin:{top:"5%", bottom:'15%'}
}}
uiText={{value:"Welcome to the Angzaar A.I. network. This A.I. machine allows you to create an A.I Agent clone of yourself. These will live (for now) inside Angzaar and Decentraland. But soon, you will be able to take them anywhere!", fontSize:sizeFont(20,15)}}
/>

<CustomButton
        margin={'1%'}
        label={"Create Agent"}
        width={10}
        height={6}
        func={()=>{
            paginateAgentCreation(1)
        }}
    />

<CustomButton
        margin={'1%'}
        label={"Close"}
        width={10}
        height={6}
        func={()=>{
            hideAllCreationPages()
        }}
    />

        </UiEntity>
    )
}