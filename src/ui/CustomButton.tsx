import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity } from '@dcl/sdk/react-ecs'
import { playSound } from '@dcl-sdk/utils'
import { Color4 } from '@dcl/sdk/math'
import { calculateImageDimensions, getAspect, getImageAtlasMapping, sizeFont } from './helpers'
import { uiSizes } from './uiConfig'
import resources from '../helpers/resources'
import { storeRarities } from './createStoreUI'

export function CustomButton(props:any){
    return(
        <UiEntity
      key={resources.slug + "custom::button::" + props.label}
      uiTransform={{
        display: props.customDisplay ? props.displayFunc() ? "flex" : "none" : "flex",
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: calculateImageDimensions(props.width ? props.width : 7, getAspect(uiSizes.buttonPillBlue)).width,
          height: calculateImageDimensions(props.height ? props.height : 5, getAspect(uiSizes.buttonPillBlue)).height,
          margin: props.margin ? props.margin : {top:"1%", bottom:'1%'},
          positionType: props.positionType ? props.positionType : undefined,
          position: props.position ? props.position : undefined,
      }}
      uiBackground={{
          textureMode: 'stretch',
          texture: {
              src: 'images/atlas2.png'
          },
          uvs: getImageAtlasMapping(props.rarity ? storeRarities.includes(props.label) ? uiSizes.buttonPillBlue : uiSizes.buttonPillBlack : uiSizes.buttonPillBlue)
      }}
      onMouseDown={() => {
        if(props.hasOwnProperty("func")){
            props.func()
        }
      }}
      onMouseUp={()=>{
      }}
      uiText={{textWrap: 'nowrap',  value: props.label, color:Color4.White(), fontSize:sizeFont(30, 20)}}
      />
    )
}

function getButtonState(buttons?:any[], button?:string){
    if(buttons){
        if(buttons.find((b:any)=> b.label === button).pressed){
        return getImageAtlasMapping(uiSizes.buttonPillBlue)
        }else{
            return getImageAtlasMapping(uiSizes.buttonPillBlack)
        }
    }else{
        return getImageAtlasMapping(uiSizes.buttonPillBlack)
    }
}