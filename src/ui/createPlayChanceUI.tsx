import ReactEcs, {UiEntity} from '@dcl/sdk/react-ecs'
import {
    calculateImageDimensions,
    calculateSquareImageDimensions,
    getAspect,
    getImageAtlasMapping,
    sizeFont
} from './helpers';
import resources, { dclColors } from '../helpers/resources';
import { uiSizes } from './uiConfig';
import { CustomButton } from './CustomButton';
import { Color4 } from '@dcl/sdk/math';
import { lotteries, sendMana } from '../lottery';
import { displaySkinnyVerticalPanel } from './confirmMana';
import { getView } from './uiViews';
import { colyseusLottery, sendServerMessage } from '../server';
import { paginateArray } from '../helpers/functions';
import { playSound } from '@dcl-sdk/utils';

let show = false
let chances:any[] = []
let visibleItems:any[] = []
let visibleIndex:number = 1

export async function showPlayChance(value:boolean){
    show = value

    if(show){
        visibleIndex = 1
        visibleItems.length = 0
        chances = lotteries.filter((lottery:any) => lottery.status === "active")
        chances.forEach((chance:any)=>{
            chance.visibleItems = []
            chance.visibleItemIndex = 1
        })
        updateVisibleItems()
    }
}

function updateVisibleItems(){
    visibleItems = paginateArray([...chances], visibleIndex, 3)
    visibleItems.forEach((chance:any)=>{
        updateChanceVisibleItems(chance)
    })
}

function updateChanceVisibleItems(chance:any){
    chance.visibleItems = paginateArray([...chance.items], chance.visibleItemIndex, 3)
}

export function createPlayChanceUI() {
    return (
        <UiEntity
            key={resources.slug + "play::chance::ui"}
            uiTransform={{
                display: show ? 'flex' : 'none',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '50%',
                height: '75%',
                positionType: 'absolute',
                position: {right: '25%', bottom: '12%'}
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

<CustomButton
            margin={'1%'}
            positionType='absolute'
            position={{left:'5%', bottom:'5%'}}
            label={"Cancel"}
            func={()=>{
                showPlayChance(false)
            }}
            />

<UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '90%',
                height: '90%',
            }}
            // uiBackground={{color:Color4.Green()}}
        >

             <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '7%',
                    margin:{top:"2%"}
                }}
                uiText={{value:"DecentCHANCES!", textAlign:'middle-left', textWrap:'nowrap', fontSize:sizeFont(35,25)}}
            />

            {generateYourChances()}

            {/* paginate buttons column */}
            <UiEntity
                        uiTransform={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'flex-start',
                            justifyContent: 'center',
                            width: '30%',
                            height: '10%',
                            positionType:'absolute',
                            position:{bottom:'1%', right:'1%'}
                        }}
                        >
            
                                            {/* scroll up button */}
                                            <UiEntity
                                uiTransform={{
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: calculateImageDimensions(2, getAspect(uiSizes.leftArrowBlack)).width,
                                    height: calculateImageDimensions(2, getAspect(uiSizes.leftArrowBlack)).height,
                                    margin: {left: "5%"},
                                }}
                                // uiBackground={{color:Color4.White()}}
                                uiBackground={{
                                    textureMode: 'stretch',
                                    texture: {
                                        src: resources.textures.atlas2
                                    },
                                    uvs: getImageAtlasMapping(uiSizes.leftArrowBlack)
                                }}
                                onMouseDown={() => {
                                    if(visibleIndex -1 >= 1){
                                        visibleIndex = 1
                                        updateVisibleItems()
                                    }
                                }}
                            />
            
                            {/* scroll down button */}
                            <UiEntity
                                uiTransform={{
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: calculateImageDimensions(2, getAspect(uiSizes.rightArrowBlack)).width,
                                    height: calculateImageDimensions(2, getAspect(uiSizes.rightArrowBlack)).height,
                                    margin: {right: "1%"},
                                }}
                                uiBackground={{
                                    textureMode: 'stretch',
                                    texture: {
                                        src: resources.textures.atlas2
                                    },
                                    uvs: getImageAtlasMapping(uiSizes.rightArrowBlack)
                                }}
                                onMouseDown={() => {
                                    visibleIndex++
                                    updateVisibleItems()
                                }}
                            />
            
            
            </UiEntity>
    </UiEntity>
        </UiEntity>
        </UiEntity>
    )
}

function generateYourChances(){
    let arr:any[] = []
    visibleItems.forEach((chance:any)=>{
        arr.push(
            <UiEntity
                uiTransform={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '23%',
                    margin:{top:"2%"}
                }}
                uiBackground={{color:Color4.create(0,0,0,1)}}
            >
            <UiEntity
                            uiTransform={{
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '30%',
                                height: '100%',
                                margin:{left:'1%'}
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
                                uiText={{value: "" + chance.name, textAlign:'middle-left', textWrap:'nowrap', fontSize:sizeFont(35,20)}}
                                />

<UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '15%',

            }}
            uiText={{value: "Creator: " + (chance.creator ? chance.creator : "Anon"), textAlign:'middle-left', textWrap:'nowrap', fontSize:sizeFont(25,15)}}
            />


                                <UiEntity
                                uiTransform={{
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: '100%',
                                    height: '15%',
                                }}
                                uiText={{value: "Chance: " + chance.chanceToWin + "%", textAlign:'middle-left', textWrap:'nowrap', fontSize:sizeFont(25,15)}}
                                />

            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '15%',

            }}
            uiText={{value: "Cost: " + chance.costToPlay, textAlign:'middle-left', textWrap:'nowrap', fontSize:sizeFont(25,15)}}
            />

<UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '15%',

            }}
            uiText={{value: "Items: " + chance.items.length, textAlign:'middle-left', textWrap:'nowrap', fontSize:sizeFont(25,15)}}
            />

<UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '15%',

            }}
            uiText={{value: "Win Type: " + (chance.type ? chance.type : "All Items"), textAlign:'middle-left', textWrap:'nowrap', fontSize:sizeFont(25,15)}}
            />
            </UiEntity>

            <UiEntity
            uiTransform={{
                flexDirection: 'row',
                alignItems: 'flex-start',
                justifyContent: 'flex-start',
                width: '50%',
                height: '100%',
                margin:{left:'5%', top:"1%"}
            }}
            >
                {show &&
                generateLotteryImages(chance.visibleItems)
                }
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
            margin={'1%'}
            label={"Chance!"}
            func={()=>{
            showPlayChance(false)
            sendServerMessage('play-chance', {id:chance.id, }, colyseusLottery)
            if(chance.costToPlay > 0){
            displaySkinnyVerticalPanel(true, getView("Confirm_Mana"), chance.costToPlay, ()=>{sendMana(chance.costToPlay)}, ()=>{showPlayChance(true)})
            }else{
                playSound('assets/gnomon_short_hacking.mp3', false)
            }
            }}
            />
            </UiEntity>



            {/* PAGE ITEM BUTTONS */}
            <UiEntity
        uiTransform={{
            display: chance.items.length > 3 ? 'flex' : 'none',
            flexDirection: 'row',
            alignItems: 'flex-start',
            justifyContent: 'center',
            width: '30%',
            height: '10%',
            positionType:'absolute',
            position:{bottom:'25%', left:'10%'}
        }}
        >

                            {/* scroll up button */}
                            <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: calculateImageDimensions(1, getAspect(uiSizes.leftArrowBlack)).width,
                    height: calculateImageDimensions(1, getAspect(uiSizes.leftArrowBlack)).height,
                    margin: {left: "5%"},
                }}
                // uiBackground={{color:Color4.White()}}
                uiBackground={{
                    textureMode: 'stretch',
                    texture: {
                        src: resources.textures.atlas2
                    },
                    uvs: getImageAtlasMapping(uiSizes.leftArrowBlack)
                }}
                onMouseDown={() => {
                    if(chance.visibleItemIndex -1 >= 1){
                        chance.visibleItemIndex = 1
                        updateVisibleItems()
                    }
                }}
            />

            {/* scroll down button */}
            <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: calculateImageDimensions(1, getAspect(uiSizes.rightArrowBlack)).width,
                    height: calculateImageDimensions(1, getAspect(uiSizes.rightArrowBlack)).height,
                    margin: {right: "1%"},
                }}
                uiBackground={{
                    textureMode: 'stretch',
                    texture: {
                        src: resources.textures.atlas2
                    },
                    uvs: getImageAtlasMapping(uiSizes.rightArrowBlack)
                }}
                onMouseDown={() => {
                    chance.visibleItemIndex++
                    updateVisibleItems()
                }}
            />


            </UiEntity>


            </UiEntity>
        )
    })
    return arr
}

function generateLotteryImages(items:any[]){
    let arr:any[] = []
    items.forEach((item:any)=>{
        let [contract, tokenId, itemId, rarity] = item.split(":")
        arr.push(

            <UiEntity
                    uiTransform={{
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: calculateSquareImageDimensions(10).width,
                height: calculateSquareImageDimensions(10).height,
                    }}
                    uiBackground={{color: dclColors[rarity]}}//
                    >
            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width:'90%',
                height:'90%',
                margin:'1%'
            }}
            uiBackground={{
                textureMode: 'stretch',
                texture: {
                    src: "https://peer.decentraland.org/lambdas/collections/contents/urn:decentraland:matic:collections-v2:" + contract + ":" + itemId + "/thumbnail"
                },
            }}
        ></UiEntity>
                    </UiEntity>
        )
    })

    return arr
}