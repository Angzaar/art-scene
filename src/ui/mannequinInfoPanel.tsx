import ReactEcs, {Dropdown, Input, UiEntity} from '@dcl/sdk/react-ecs'
import {
    calculateImageDimensions,
    calculateSquareImageDimensions,
    getAspect,
    getImageAtlasMapping,
    sizeFont
} from './helpers';
import resources, { dclColors } from '../helpers/resources';
import { uiSizes } from './uiConfig';
import { Color4 } from '@dcl/sdk/math';
import { openExternalUrl } from '~system/RestrictedActions';

let show = false
let info:any

export function displayMannequinPanel(value:boolean, data?:any){
    show = value

    if(data){
        info = data
        console.log('data is',data)
    }
}

export function createMannequinInfoPanel() {
    return (
        <UiEntity
            key={resources.slug + "mannequin::info::panel"}
            uiTransform={{
                display: show ? 'flex' : 'none',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: calculateImageDimensions(25, 446 / 431).width,
                height: calculateImageDimensions(35, 446 / 431).height,
                positionType: 'absolute',
                position: {right: '3%', bottom: '3%'}
            }}
            uiBackground={{
                textureMode: 'stretch',
                texture: {
                    src: 'images/atlas2.png',
                },
                uvs: getImageAtlasMapping(uiSizes.vertRectangle)
            }}
        >

             <UiEntity
                    uiTransform={{
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                        width: '90%',
                        height: '90%',
                    }}
                >
            <UiEntity
                    uiTransform={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '90%',
                        height: '7%',
                        margin:{top:'1%'}
                    }}
                    uiText={{value:(info && info.name) + " Items", textWrap:'nowrap', textAlign:'middle-center', fontSize:sizeFont(35,25)}}
                />

<UiEntity
    uiTransform={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: '90%',
        height: '75%',
        margin:{top:'1%'}
    }}
>

    { show &&
        info && 
        generateRows()
    }

</UiEntity>

<UiEntity
      uiTransform={{
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '25%',
          height: calculateImageDimensions( 7,getAspect(uiSizes.buttonPillBlue)).height,
          margin: {bottom:'1%'},
      }}
      uiBackground={{
          textureMode: 'stretch',
          texture: {
              src: 'images/atlas2.png'
          },
          uvs: getImageAtlasMapping(uiSizes.buttonPillBlue)
      }}
      onMouseDown={() => {
        displayMannequinPanel(false)
      }}
      uiText={{textWrap:'nowrap',  value: "Close", color:Color4.White(), fontSize:sizeFont(25,15)}}
      />


                </UiEntity>
  

        </UiEntity>
    )
}

function generateRows(){
    let arr:any[] = []
    info.wearables.forEach((wearable:any, i:number)=>{
        arr.push(
             <UiEntity
                key={resources.slug + "man::item::row::" + i}
                            uiTransform={{
                                flexDirection: 'row',
                                justifyContent: 'center',
                                width: '100%',
                                height: '15%',
                                margin:{top:'1%'}
                            }}
                            uiBackground={{
                                textureMode: 'stretch',
                                texture: {
                                    src: 'images/atlas2.png'
                                },
                                uvs: getImageAtlasMapping(uiSizes.buttonPillBlack)
                            }}

                        >
            
            <UiEntity
                uiTransform={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    width: '30%',
                    height: '100%',
                    alignContent:'center',
                    alignItems:"center",
                }}
            >
            
            <UiEntity
                uiTransform={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignContent:'center',
                    alignItems:"center",
                     width: calculateSquareImageDimensions(6).width,
                  height: calculateSquareImageDimensions(6).height
                }}
                uiBackground={{color:wearable.data ? dclColors[wearable.data.data.wearable.rarity] : Color4.Black()}}
            >
            <UiEntity
                uiTransform={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                     width: '95%',
                  height: '95%'
                }}
                uiBackground={{
                    textureMode: 'stretch',
                    texture: {
                        src: wearable.data ? wearable.data.thumbnail : ""
                    },
                }}
            />
            </UiEntity>
            
            </UiEntity>
            
            <UiEntity
                uiTransform={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    width: '60%',
                    height: '100%',
                }}
                uiText={{value:"" + wearable.data ? wearable.data.name : "", fontSize:sizeFont(20,15), textAlign:'top-left'}}
            >
                
            </UiEntity>
            
            <UiEntity
                uiTransform={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    width: '10%',
                    height: '100%',
                    alignContent:'center',
                    alignItems:"center",
                    margin:{right:'1%'}
                }}
                // uiBackground={{color:Color4.Green()}}
            >
                <UiEntity
                    uiTransform={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignContent:'center',
                        alignItems:"center",
                         width: calculateSquareImageDimensions(3).width,
                      height: calculateSquareImageDimensions(3).height
                    }}
                    uiBackground={{
                        textureMode: 'stretch',
                        texture: {
                            src: 'images/atlas1.png'
                        },
                        uvs: getImageAtlasMapping(uiSizes.scaleButton)
                    }}
                    onMouseDown={()=>{
                        openExternalUrl({url:"https://decentraland.org/marketplace/contracts/" + wearable.id.split(":")[0] + "/items/" + wearable.id.split(":")[1]})
                    }}
                    />
            </UiEntity>
            
            
                        </UiEntity>
        )
    })
    return arr
}