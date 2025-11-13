import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity } from '@dcl/sdk/react-ecs'
import { playSound } from '@dcl-sdk/utils'
import { Color4 } from '@dcl/sdk/math'
import { calculateImageDimensions, getAspect, getImageAtlasMapping, sizeFont } from './helpers'
import { uiSizes } from './uiConfig'
import resources from '../helpers/resources'
import { generateButtons } from './calendar'
import { tweenLottoBeam } from '../lottery'
import { engine, Transform } from '@dcl/sdk/ecs'

let buttons:any[] = [
    {label:"Lotto Beam", pressed:false, func:()=>{
        tweenLottoBeam(Transform.get(engine.PlayerEntity).position)
    },
}
]

export function createDebugPanel(){
    return(
        <UiEntity
      key={resources.slug + "::debug::panel"}
      uiTransform={{
          flexDirection: 'row',
          alignItems: 'flex-start',
          justifyContent: 'flex-start',
          width:'80%',
          height:'10%',
          margin:{top:"2%"},
          positionType: 'absolute',
          position:{top:'2%', right:"5%"},
        //   display: resources.DEBUG ? 'flex' :'none'
        display:'none'
      }}
      uiBackground={{color:Color4.Green()}}
      onMouseDown={() => {
      }}
      onMouseUp={()=>{
      }}
      >
        {resources.DEBUG && 
           generateButtons(buttons)
           }
      </UiEntity>
    )
}