import ReactEcs, {Input, UiEntity} from '@dcl/sdk/react-ecs'
import { paginateAgentCreation, hideAllCreationPages, newAgent } from '../eliza'
import resources from '../helpers/resources'
import { CustomButton } from './CustomButton'
import { calculateImageDimensions, getAspect, getImageAtlasMapping, sizeFont } from './helpers'
import { uiSizes } from './uiConfig'
import { Color4 } from '@dcl/sdk/math'
import { AgentNamePage } from './agent-creation/agentName'
import { AgentBioPage, updateBioPage } from './agent-creation/agentBio'
import { AgentLorePage, updateLorePage } from './agent-creation/agentLore'
import { AgentKnowledgePage, updateKnowledgeePage } from './agent-creation/agentKnowledge'
import { AgentAdjectivesPage } from './agent-creation/agentAdjectives'
import { AgentTopicsPage } from './agent-creation/agentTopics'
import { AgentPositionPage } from './agent-creation/agentPosition'
import { showAgentConfirmCreate } from './agent-creation/confirmCreate'

let show = false
export let view = "Name"

let butons:any[] = [
    "Name",
    "Bio",
    "Lore",
    "Knowledge",
    "Adjectives",
    "Topics",
    "Position",
]

export function showAgentCreatorUI(value:boolean){
    show = value
}

export function createAgentCreatorUI() {
    return (
        <UiEntity
            key={resources.slug + "eliza::creator-ui"}
            uiTransform={{
                display: show ? 'flex' : 'none',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: calculateImageDimensions(60, getAspect(uiSizes.vertRectangle)).width,
                height: calculateImageDimensions(40, getAspect(uiSizes.vertRectangle)).height,
                positionType: 'absolute',
                position: {right: '20%', bottom: '10%'}
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

{/* left menu */}
<UiEntity
uiTransform={{
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '25%',
    height: '95%',
}}
// uiBackground={{color:Color4.Green()}}
>

<UiEntity
uiTransform={{
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '90%',
    height: '10%',
}}
uiText={{value: "A.I. Agent Creator", fontSize:sizeFont(35,25)}}
/>

{generateButtons()}

<CustomButton
        margin={{top:'5%', left:'1%', right:'1%', bottom:'1%'}}
        label={"Create"}
        width={10}
        height={6}
        func={()=>{
            if(!isNaN(newAgent.position.x)){
                showAgentCreatorUI(false)
                showAgentConfirmCreate(true)
            }
        }}
    />

<CustomButton
        margin={'1%'}
        label={"Close"}
        width={10}
        height={6}
        func={()=>{
            hideAllCreationPages()
            showAgentCreatorUI(false)
        }}
    />

</UiEntity>


{/* right details */}
<UiEntity
uiTransform={{
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '65%',
    height: '95%',
}}
// uiBackground={{color:Color4.Blue()}}
>

    <AgentNamePage/>
    <AgentBioPage/>
    <AgentLorePage/>
    <AgentKnowledgePage/>
    <AgentAdjectivesPage/>
    <AgentTopicsPage/>
    <AgentPositionPage/>
    
</UiEntity>

        </UiEntity>
    )
}

function generateButtons(){
    let arr:any[] = []
    butons.forEach((button:string)=>{
        arr.push(
            <UiEntity
            key={resources.slug + "ai::creator::menu::item::" + button}
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '90%',
                    height: '8%',
                    margin:{top:'1%'}
                }}
                uiBackground={{color:view === button ? Color4.create(129/255, 181/255, 235/255) :Color4.Black()}}
                uiText={{value: "" + button, fontSize:sizeFont(35,25)}}
                onMouseDown={()=>{
                    view = button
                    initView(button)
                }}
                />
        )
    })
    return arr
}

function initView(view:string){
    switch(view){
        case 'Bio':
            updateBioPage()
            break;

        case 'Lore':
            updateLorePage()
            break;

        case 'Knowledge':
            updateKnowledgeePage()
            break;
            
    }
}