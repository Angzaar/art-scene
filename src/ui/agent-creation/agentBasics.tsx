import ReactEcs, {Input, UiEntity} from '@dcl/sdk/react-ecs'
import resources from '../../helpers/resources'
import { CustomButton } from '../CustomButton'
import { calculateImageDimensions, getAspect, getImageAtlasMapping, sizeFont } from '../helpers'
import { uiSizes } from '../uiConfig'
import { hideAllCreationPages, paginateAgentCreation } from '../../eliza'
import { showAgentCreatorUI } from '../createElizaCreator'

let show = false

export function showAgentBasics(value:boolean){
    show = value
}

export function createAgentBasicsUI() {
    return (
        <UiEntity
            key={resources.slug + "eliza::basics-ui"}
            uiTransform={{
                display: show ? 'flex' : 'none',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: calculateImageDimensions(40, getAspect(uiSizes.vertRectangle)).width,
                height: calculateImageDimensions(40, getAspect(uiSizes.vertRectangle)).height,
                positionType: 'absolute',
                position: {right: '30%', bottom: '10%'}
            }}
            uiBackground={{
                textureMode: 'stretch',
                texture: {
                    src: resources.textures.atlas2
                },
                uvs: getImageAtlasMapping(uiSizes.horizRectangle)
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
uiText={{value:"Angzaar A.I. Creation Basics", fontSize:sizeFont(35,30)}}
/>

<UiEntity
uiTransform={{
    display: show ? 'flex' : 'none',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '55%',
    height: '10%',
    margin:{top:"1%", bottom:'1%'}
}}
uiText={{value:"An A.I Agent Character consists of many different inputs which help create a true identity to your A.I. Agent clone. Over the next several steps, we will be creating the identity of your A.I. clone and then release them into the wild!", fontSize:sizeFont(20,15)}}
/>

<UiEntity
uiTransform={{
    display: show ? 'flex' : 'none',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '50%',
    height: '5%',
    margin:{top:'1%'}
}}
uiText={{value:"- Bio", fontSize:sizeFont(20,15)}}
/>

<UiEntity
uiTransform={{
    display: show ? 'flex' : 'none',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '50%',
    height: '5%',
    margin:{top:'1%'}
}}
uiText={{value:"- Lore", fontSize:sizeFont(20,15)}}
/>


<UiEntity
uiTransform={{
    display: show ? 'flex' : 'none',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '50%',
    height: '5%',
    margin:{top:'1%'}
}}
uiText={{value:"- Knowledge", fontSize:sizeFont(20,15)}}
/>

<UiEntity
uiTransform={{
    display: show ? 'flex' : 'none',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '50%',
    height: '5%',
    margin:{top:'1%'}
}}
uiText={{value:"- Adjectives", fontSize:sizeFont(20,15)}}
/>

<UiEntity
uiTransform={{
    display: show ? 'flex' : 'none',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '50%',
    height: '5%',
    margin:{top:'1%'}
}}
uiText={{value:"- Topics", fontSize:sizeFont(20,15)}}
/>


{/* <UiEntity
uiTransform={{
    display: show ? 'flex' : 'none',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '50%',
    height: '5%',
    margin:{top:'1%'}
}}
uiText={{value:"- Styles", fontSize:sizeFont(20,15)}}
/> */}


{/* 
<UiEntity
uiTransform={{
    display: show ? 'flex' : 'none',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '50%',
    height: '5%',
    margin:{top:'1%'}
}}
uiText={{value:"- Post Examples", fontSize:sizeFont(20,15)}}
/> */}



<CustomButton
        margin={'1%'}
        label={"Continue"}
        width={10}
        height={6}
        func={()=>{
            // paginateAgentCreation(1)
            hideAllCreationPages()
            showAgentCreatorUI(true)
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