import ReactEcs, {Input, UiEntity} from '@dcl/sdk/react-ecs'
import resources from '../../helpers/resources'
import { CustomButton } from '../CustomButton'
import { calculateImageDimensions, getAspect, getImageAtlasMapping, sizeFont } from '../helpers'
import { uiSizes } from '../uiConfig'
import { creationPage, newAgent, paginateAgentCreation, totalSteps, updateNewAgent } from '../../eliza'
import { Color4 } from '@dcl/sdk/math'
import { view } from '../createElizaCreator'

export function AgentNamePage() {
    return (
        <UiEntity
            key={resources.slug + "eliza::name-ui"}
            uiTransform={{
                display: view === "Name" ? 'flex' : 'none',
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
    margin:{bottom:'1%', top:"5%"}
}}
uiText={{value:"Give your A.I. Agent a name", fontSize:sizeFont(35,25)}}
/>

<UiEntity
uiTransform={{
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '65%',
    height: '10%',
    margin:{top:"2%", bottom:'1%'}
}}
uiText={{value:"" + newAgent.name, fontSize:sizeFont(25,20)}}
/>

<Input
    uiTransform={{
        width:'65%',
        height:"10%",
        margin:{bottom:'5%'}
    }}
    onChange={(e)=>{
        updateNewAgent({name: e.trim()})
    }}
        onSubmit={(e) =>{ 
            updateNewAgent({name: e.trim()})
        }}
        fontSize={sizeFont(20,15)}
        uiBackground={{color:Color4.Black()}}
        color={Color4.White()}
        placeholder={"Enter Agent Name"}
        placeholderColor={Color4.White()}
        />
        </UiEntity>
    )
}