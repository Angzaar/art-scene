import ReactEcs, {Input, UiEntity} from '@dcl/sdk/react-ecs'
import resources from '../../helpers/resources'
import { CustomButton } from '../CustomButton'
import { calculateImageDimensions, getAspect, getImageAtlasMapping, sizeFont } from '../helpers'
import { uiSizes } from '../uiConfig'
import { createElizaAgent, creationPage, newAgent, paginateAgentCreation, totalSteps, updateNewAgent } from '../../eliza'
import { Color4 } from '@dcl/sdk/math'
import { showAgentCreatorUI } from '../createElizaCreator'

let show = false
let bio = ""

export function showAgentConfirmCreate(value:boolean){
    show = value
}

export function createAgentUIConfirm() {
    return (
        <UiEntity
            key={resources.slug + "eliza::confirm-ui"}
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
uiText={{value:"Angzaar A.I. Creator", fontSize:sizeFont(35,30)}}
/>

{/* <UiEntity
uiTransform={{
    display: show ? 'flex' : 'none',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '65%',
    height: '5%',
    margin:{bottom:'1%'}
}}
uiText={{value:"Step " + creationPage + "/ " + totalSteps, fontSize:sizeFont(20,15)}}
/> */}

<UiEntity
uiTransform={{
    display: show ? 'flex' : 'none',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '65%',
    height: '5%',
    margin:{bottom:'15%', top:'5%'}
}}
uiText={{value:"You're about to create a new A.I. Agent! Are you ready??", fontSize:sizeFont(20,15)}}
/>

<CustomButton
        margin={'1%'}
        label={"Create"}
        width={10}
        height={6}
        func={()=>{
            createElizaAgent()
        }}
    />

<CustomButton
        margin={'1%'}
        label={"Go Back"}
        width={10}
        height={6}
        func={()=>{
            showAgentConfirmCreate(false)
            showAgentCreatorUI(true)
        }}
    />

        </UiEntity>
    )
}