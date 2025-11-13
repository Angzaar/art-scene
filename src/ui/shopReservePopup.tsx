import { Color4 } from '@dcl/sdk/math'
import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position,UiBackgroundProps, Dropdown } from '@dcl/sdk/react-ecs'
import resources, { storeConfigs } from '../helpers/resources'
import { CustomButton } from './CustomButton'
import { calculateImageDimensions, getAspect, dimensions, getImageAtlasMapping, sizeFont, addLineBreak } from './helpers'
import { uiSizes } from './uiConfig'
import { showReservationPopup } from './calendar'
import { shops } from '../shops'

let show:boolean = false
let storeIndex:number = 0

export function displayShopReservePopup(value:boolean){
    show = value

    if(!value){
        storeIndex = 0
    }
}

export function createShowReservePopup(){
    return(
        <UiEntity
        key={"" + resources.slug + "shop::reserve::popup::ui"}
        uiTransform={{
            display: show ? 'flex' : 'none',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: calculateImageDimensions(25, getAspect(uiSizes.vertRectangle)).width,
            height: calculateImageDimensions(25,  getAspect(uiSizes.vertRectangle)).height,
            positionType: 'absolute',
            position: { left: (dimensions.width - calculateImageDimensions(25, getAspect(uiSizes.vertRectangle)).width) / 2, top: (dimensions.height - calculateImageDimensions(25,  getAspect(uiSizes.vertRectangle)).height) / 2 }
        }}
    >
        <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            height: '100%',
            justifyContent:'flex-start',
        }}
        uiBackground={{
            textureMode: 'stretch',
            texture: {
                src: resources.textures.atlas2
            },
            uvs: getImageAtlasMapping(uiSizes.vertRectangle)
        }}
        onMouseDown={()=>{
        }}
        onMouseUp={()=>{
        }}
    >            
        {/* header label */}
        <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '90%',
                height: '15%',
                display:'flex',
                margin:{top:'10%', left:'2%', right:'2%'}
            }}
        uiText={{value:"Reserve Shoppes", fontSize: sizeFont(45,30), color: Color4.White()}}
        />

                {/* variabl text label */}
                {/* <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '10%',
                display: variableText !== undefined ? "flex" : "none",
            }}
        uiText={{value:"" + variableText, fontSize: sizeFont(30,25), color: Color4.Red()}}
        /> */}

        {/* text detail */}
        <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '25%',
            }}
            uiText={{fontSize:sizeFont(25,20), color:Color4.White(), value:"Choose a Shoppe to Reserve"}}
        />


<Dropdown
    options={[...shops.values()]
        .sort((a, b) => a.id - b.id)
        .map(item => "Shoppe " + item.id)}
    selectedIndex={0}
    onChange={(index:number)=>{
        storeIndex = index
    }}
    uiTransform={{
        width: '50%',
        height: '10%',
        margin:{bottom:'5%'}
    }}
    // uiBackground={{color:Color4.Purple()}}
    color={Color4.White()}
    fontSize={sizeFont(25, 15)}
/>

         <CustomButton
                margin={'1%'}
                label={"Continue"}
                func={()=>{
                    showReservationPopup(true, [...shops.values()]
                        .sort((a, b) => a.id - b.id)[storeIndex].id)

                    displayShopReservePopup(false)
                }}
                />

         <CustomButton
                margin={'1%'}
                label={"Cancel"}
                func={()=>{
                    displayShopReservePopup(false)
                }}
                />

        </UiEntity>
    </UiEntity>
    )
}