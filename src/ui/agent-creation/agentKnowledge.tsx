import ReactEcs, {Input, UiEntity} from '@dcl/sdk/react-ecs'
import resources from '../../helpers/resources'
import { CustomButton } from '../CustomButton'
import { calculateImageDimensions, calculateSquareImageDimensions, getAspect, getImageAtlasMapping, sizeFont } from '../helpers'
import { uiSizes } from '../uiConfig'
import { creationPage, newAgent, paginateAgentCreation, totalSteps, updateNewAgent } from '../../eliza'
import { Color4 } from '@dcl/sdk/math'
import { view } from '../createElizaCreator'
import { paginateArray } from '../../helpers/functions'

let show = false
let bio = ""
let visibleItems:any[] = []
let visibleIndex:number = 1

export function showAgentBio(value:boolean){
    show = value
}

export function updateKnowledgeePage(){
    visibleIndex = 1
    visibleItems.length = 0
    visibleItems = paginateArray([...newAgent.knowledge], visibleIndex, 10)
}

export function AgentKnowledgePage() {
    return (
        <UiEntity
            key={resources.slug + "eliza::knowledge-ui"}
            uiTransform={{
                display: view === "Knowledge" ? 'flex' : 'none',
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
uiText={{value:"A.I. Knowledge", fontSize:sizeFont(35,25)}}
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
uiText={{value:"List used for Retrieval Augmented Generation (RAG), containing facts or references to ground the character's responses. Helps ground the character's responses in factual information.", fontSize:sizeFont(30,20)}}
/>

{/* input row */}
<UiEntity
uiTransform={{
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '95%',
    height: '10%',
    margin:{top:"1%", bottom:'1%'}
}}
>

<UiEntity
uiTransform={{
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '80%',
    height: '100%',
}}
>
<Input
    uiTransform={{
        width:'95%',
        height:"100%",
        margin:{top:"5%"}
    }}
    onChange={(e)=>{
        bio = e.trim()
    }}
        onSubmit={(e) =>{ 
            if(bio === ""){
                return
            }
            updateNewAgent({knowledge: bio}, true)
            bio = ""
            updateKnowledgeePage()
        }}
        fontSize={sizeFont(25,20)}
        uiBackground={{color:Color4.Black()}}
        color={Color4.White()}
        placeholder={"Enter new knowledge statement"}
        placeholderColor={Color4.White()}
        />
</UiEntity>

<UiEntity
uiTransform={{
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '20%',
    height: '100%',
}}
>
<CustomButton
        label={"Add"}
        width={5}
        height={5}
        func={()=>{
            if(bio === ""){
                return
            }
            updateNewAgent({knowledge: bio}, true)
            bio = ""
            updateKnowledgeePage()
        }}
    />
</UiEntity>


</UiEntity>


{/* details rows */}
<UiEntity
uiTransform={{
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '95%',
    height: '60%',
}}
>
{generateRows()}
</UiEntity>


        </UiEntity>
    )
}


function generateRows(){
    let arr:any[] = []
    visibleItems.forEach((item:any, i:number)=>{
        arr.push(
            <UiEntity
            uiTransform={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '10%',
                margin:{top:"0.1%", bottom:"0.1%"}
            }}
            uiBackground={{color:Color4.create(129/255, 181/255, 235/255)}}
            >

<UiEntity
    uiTransform={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '90%',
        height: '100%',
        margin:{left:'1%'}
    }}
    uiText={{value:item, fontSize:sizeFont(25,15), textAlign:'middle-left'}}
    />

<UiEntity
    uiTransform={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '10%',
        height: '100%',
        margin:{right:'1%'}
    }}
    >
          <UiEntity
                  uiTransform={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: calculateSquareImageDimensions(3.5).width,
                      height: calculateSquareImageDimensions(3.5).height
                  }}
                  uiBackground={{
                      textureMode: 'stretch',
                      texture: {
                          src: resources.textures.atlas1
                      },
                      uvs: getImageAtlasMapping(uiSizes.trashButton)
                  }}
                  onMouseDown={()=>{
                      newAgent.knowledge.splice(i, 1)
                      updateKnowledgeePage()
                  }}
                  />
    </UiEntity>

            </UiEntity>
        )
    })
    return arr
}