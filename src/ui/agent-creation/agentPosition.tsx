import ReactEcs, {Input, UiEntity} from '@dcl/sdk/react-ecs'
import resources from '../../helpers/resources'
import { CustomButton } from '../CustomButton'
import { calculateImageDimensions, calculateSquareImageDimensions, getAspect, getImageAtlasMapping, sizeFont } from '../helpers'
import { uiSizes } from '../uiConfig'
import { creationPage, newAgent, paginateAgentCreation, totalSteps, updateNewAgent } from '../../eliza'
import { Color4, Quaternion } from '@dcl/sdk/math'
import { view } from '../createElizaCreator'
import { paginateArray } from '../../helpers/functions'
import { engine, Transform } from '@dcl/sdk/ecs'

let show = false
let bio = ""
let visibleItems:any[] = []
let visibleIndex:number = 1

export function showAgentBio(value:boolean){
    show = value
}

export function updateBioPage(){
    visibleIndex = 1
    visibleItems.length = 0
    visibleItems = paginateArray([...newAgent.bio], visibleIndex, 10)
}

export function AgentPositionPage() {
    return (
        <UiEntity
            key={resources.slug + "eliza::position-ui"}
            uiTransform={{
                display: view === "Position" ? 'flex' : 'none',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '100%',
                height:'100%'
            }}
        >

<UiEntity
uiTransform={{
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '65%',
    height: '5%',
    margin:{bottom:'1%', top:'5%'}
}}
uiText={{value:"A.I. Position", fontSize:sizeFont(35,25)}}
/>

<UiEntity
uiTransform={{
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '85%',
    height: '5%',
    margin:{bottom:'1%', top:'2%'}
}}
uiText={{value:"Position your A.I. Agent around Angzaar. Walk to your desired spot, including your avatar rotation, and click record position.", fontSize:sizeFont(30,20)}}
/>

<CustomButton
        margin={{top:'5%', left:'1%', right:'1%', bottom:'1%'}}
        label={"Record"}
        width={10}
        height={6}
        func={()=>{
            let transform = Transform.get(engine.PlayerEntity)
            let rotation = Quaternion.toEulerAngles(transform.rotation)
            updateNewAgent({position:transform.position, rotation:rotation})
        }}
    />

    {
        newAgent.position &&

<UiEntity
uiTransform={{
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '85%',
    height: '5%',
    margin:{bottom:'1%', top:'2%'}
}}
uiText={{value: newAgent.position ? "Saved Position: {x:" + parseFloat(newAgent.position.x).toFixed(2) + ", y:" +   parseFloat(newAgent.position.y).toFixed(2) + ", z:" +   parseFloat(newAgent.position.z).toFixed(2) + "}" : "", fontSize:sizeFont(30,20)}}
/>
}


        </UiEntity>
    )
}