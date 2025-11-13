import ReactEcs, {Input, UiEntity} from '@dcl/sdk/react-ecs'
import {
    calculateImageDimensions,
    calculateSquareImageDimensions,
    getImageAtlasMapping,
    sizeFont
} from './helpers';
import resources, { dclColors } from '../helpers/resources';
import { uiSizes } from './uiConfig';
import { Color4 } from '@dcl/sdk/math';
import { selectedItem, EDIT_MODES } from '../dcl-builder-hud';
import { SERVER_MESSAGE_TYPES, COMPONENT_TYPES, NOTIFICATION_TYPES } from '../helpers/types';
import { sendServerMessage } from '../server';
import { updateStoreView, showStoreUI } from './createStoreUI';
import { CustomButton } from './CustomButton';
import { showEditChance, updateEditChanceview } from './editChance';
import { showNotification } from './NotificationPanel';

let show = false

export let chanceName:string = ""
export let cost:number = 0
export let win:number = 10
export let cooldown:number = 0
export let cooldownType:number = 0
export let winType:number = 0
export let creatorName:string = ""

export function showCreateChanceUI(value:boolean){
    show = value

    if(!value){
        resetNewChance()
    }
}

export function resetNewChance(){
    chanceName = ""
    cost = 0
    win = 10 
    cooldown = 0 
    cooldownType = 0
    winType = 0 
    creatorName = ""
}

export function createNewChance(){
    return(
     <UiEntity
                key={resources.slug + "create::chance-ui"}
                uiTransform={{
                    display: show ? 'flex' : 'none',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '35%',
                    height: '65%',
                    positionType: 'absolute',
                    position: {right: '32%', bottom: '12%'}
                }}
            >
                <UiEntity
                    uiTransform={{
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
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
                        alignItems: 'flex-start',
                        justifyContent: 'flex-start',
                        width: '85%',
                        height: '85%',
                    }}
                >

                <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '7%',
                }}
                uiText={{value:"Create CHANCE", textAlign:'middle-left', textWrap:'nowrap', fontSize:sizeFont(35,25)}}
                />


{/* chance name row */}
<UiEntity
uiTransform={{
flexDirection: 'row',
alignItems: 'center',
justifyContent: 'center',
width: '100%',
height: '10%',
margin:{top:"5%"}
}}
>
<UiEntity
uiTransform={{
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '65%',
    height: '100%',
}}
uiText={{value:"Chance Name: " + chanceName, textAlign:'middle-left', textWrap:'nowrap', fontSize:sizeFont(30,20)}}
/>

<Input
                    uiTransform={{
                        width:'35%',
                        height:"100%"
                    }}
                    onChange={(e)=>{
                        chanceName = e.trim()
                    }}
                        onSubmit={(e) =>{ 
                            chanceName = e.trim()
                        }}
                        fontSize={sizeFont(20,15)}
                        color={Color4.White()}
                        placeholder={"Enter Name"}
                        placeholderColor={Color4.White()}
                        />
</UiEntity>


{/* creator name row */}
<UiEntity
uiTransform={{
flexDirection: 'row',
alignItems: 'center',
justifyContent: 'center',
width: '100%',
height: '10%',
margin:{top:"5%"}
}}
>
<UiEntity
uiTransform={{
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '65%',
    height: '100%',
}}
uiText={{value:"Creator Name: " + chanceName, textAlign:'middle-left', textWrap:'nowrap', fontSize:sizeFont(30,20)}}
/>

<Input
                    uiTransform={{
                        width:'35%',
                        height:"100%"
                    }}
                    onChange={(e)=>{
                        creatorName = e.trim()
                    }}
                        onSubmit={(e) =>{ 
                            creatorName = e.trim()
                        }}
                        fontSize={sizeFont(20,15)}
                        color={Color4.White()}
                        placeholder={"Enter Name"}
                        placeholderColor={Color4.White()}
                        />
</UiEntity>

{/* cost row */}
<UiEntity
    uiTransform={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '10%',
        margin:{top:"5%"}
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

        <UiEntity
    uiTransform={{
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '20%',
    }}
    uiText={{textWrap:'nowrap', value:"Cost: " + cost + " MANA", fontSize:sizeFont(30,20), textAlign:'middle-left', color:Color4.White()}}
    />

<UiEntity
    uiTransform={{
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '50%',
        margin:{top:"5%"}
    }}
    uiText={{value:"MANA, no decimals (eg 100)", fontSize:sizeFont(20,15), textAlign:'middle-left'}}
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
            <Input
    uiTransform={{
        width:'100%',
        height:"100%"
    }}
        onChange={(e)=>{
            cost = parseInt(e.trim())
        }}
        onSubmit={(e) =>{ 
            cost = parseInt(e.trim())
        }}
        fontSize={sizeFont(20,15)}
        color={Color4.White()}
        placeholder={"Enter Cost"}
        placeholderColor={Color4.White()}
        />
    </UiEntity>

    </UiEntity>


{/* win percentage row */}
<UiEntity
                        uiTransform={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'flex-start',
                            width: '100%',
                            height: '10%',
                            margin:{top:"5%"}
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
    uiText={{textWrap:'nowrap', value:"Win %: " + win, fontSize:sizeFont(30,20), textAlign:'middle-left', color:Color4.White()}}
    /> 

                    <UiEntity
                        uiTransform={{
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '20%',
                            height: '100%',

                        }}
                    >
                    <Input
                    uiTransform={{
                        width:'100%',
                        height:"100%"
                    }}
                    onChange={(e)=>{
                        win = parseFloat(e.trim())
                    }}
                    onSubmit={(e) =>{ 
                        win = parseFloat(e.trim())
                    }}
                        fontSize={sizeFont(20,15)}
                        color={Color4.White()}
                        placeholder={"Enter 1 - 100"}
                        placeholderColor={Color4.White()}
                        />

                    </UiEntity>

</UiEntity>


{/* win type */}
<UiEntity
    uiTransform={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: '100%',
        height: '10%',
        margin:{top:"3%"}
    }}
>

<UiEntity
    uiTransform={{
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '90%',
        height: '100%',
    }}
    uiText={{textWrap:'nowrap', value:"Win Type: " + (winType === 0 ? "All Items" : "1 Random Item"), fontSize:sizeFont(30,20), textAlign:'middle-left', color:Color4.White()}}
    /> 

                    <UiEntity
                        uiTransform={{
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '20%',
                            height: '100%',

                        }}
                    >
                        <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: calculateSquareImageDimensions(4).width,
            height: calculateSquareImageDimensions(4).height,
            margin:{top:"1%", bottom:'1%'},
        }}
        uiBackground={{
            textureMode: 'stretch',
            texture: {
                src: resources.textures.atlas2
            },
            uvs: winType === 0 ? 
            getImageAtlasMapping(uiSizes.toggleOnTrans) : 
            getImageAtlasMapping(uiSizes.toggleOffTrans)
        }}
        onMouseDown={() => {
            winType = winType === 0 ? 1 : 0
        }}
        />
 </UiEntity>

</UiEntity>

{/* cooldown row */}
<UiEntity
uiTransform={{
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '10%',
    margin:{top:"2%"}
}}
>

<UiEntity
                        uiTransform={{
                            flexDirection: 'row',
                            alignItems: 'flex-start',
                            justifyContent: 'flex-start',
                            width: '70%',
                            height: '100%',
                        }}
                    >

<UiEntity
    uiTransform={{
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '60%',
        height: '100%',
    }}
    uiText={{textWrap:'nowrap', value:"Cooldown: " + cooldown + (cooldownType === 0 ? " Minutes" : " Hours"), fontSize:sizeFont(30,20), textAlign:'middle-left', color:Color4.White()}}
    /> 

                    <UiEntity
                        uiTransform={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '70%',
                            height: '100%',

                        }}
                    >
                    <Input
                    uiTransform={{
                        width:'70%',
                        height:"100%"
                    }}
                    onChange={(e)=>{
                        cooldown = parseFloat(e.trim())
                    }}
                    onSubmit={(e) =>{ 
                        cooldown = parseFloat(e.trim())
                    }}
                        fontSize={sizeFont(20,15)}
                        color={Color4.White()}
                        placeholder={"Enter Number"}
                        placeholderColor={Color4.White()}
                        />

                    </UiEntity>

</UiEntity>

<UiEntity
    uiTransform={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: '30%',
        height: '100%',
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
    uiText={{textWrap:'nowrap', value:"Type: ", fontSize:sizeFont(30,20), textAlign:'middle-left', color:Color4.White()}}
    /> 

                    <UiEntity
                        uiTransform={{
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '20%',
                            height: '100%',

                        }}
                    >
                        <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: calculateSquareImageDimensions(4).width,
            height: calculateSquareImageDimensions(4).height,
            margin:{top:"1%", bottom:'1%'},
        }}
        uiBackground={{
            textureMode: 'stretch',
            texture: {
                src: resources.textures.atlas2
            },
            uvs: cooldownType === 0 ? 
            getImageAtlasMapping(uiSizes.toggleOnTrans) : 
            getImageAtlasMapping(uiSizes.toggleOffTrans)
        }}
        onMouseDown={() => {
            cooldownType = cooldownType === 0 ? 1 : 0
        }}
        />
 </UiEntity>

</UiEntity>

</UiEntity>



<UiEntity
    uiTransform={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '20%',
    }}
    >

<CustomButton
        margin={'1%'}
        label={"Cancel"}
        func={()=>{
            showEditChance(false)
            updateStoreView("main")
            showStoreUI(false)
            showCreateChanceUI(false)
        }}
    />

<CustomButton
        margin={'1%'}
        label={"Create"}
        func={()=>{
            if(validateChance()){
                showCreateChanceUI(false)
                updateEditChanceview("edit")
                showEditChance(true)
            }else{
                console.log("error, not valid chance")
                showNotification({type:NOTIFICATION_TYPES.MESSAGE, message:"Error Creating CHANCE. Please check all inputs and try again.", animate:{enabled:true, return:true, time:5}})
            }
        }}
            />
    </UiEntity>

</UiEntity>
    </UiEntity>
</UiEntity>
    )
}

function validateChance(){
    return chanceName !== "" && win >=0 && win <=100 && cost >=0 && cooldown >=0 
}