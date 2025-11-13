import ReactEcs, {UiEntity} from '@dcl/sdk/react-ecs'
import {
    calculateImageDimensions,
    getAspect,
    getImageAtlasMapping,
    sizeFont
} from './helpers';
import resources, { dclColors } from '../helpers/resources';
import { uiSizes } from './uiConfig';
import { CustomButton } from './CustomButton';
import { Color4 } from '@dcl/sdk/math';
import { showStoreUI } from './createStoreUI';
import { addAnimator, paginateArray } from '../helpers/functions';
import { lotteries } from '../lottery';
import { colyseusLottery, localUserId, sendServerMessage } from '../server';
import { showEditChance, updateEditChanceview } from './editChance';
import { displaySkinnyVerticalPanel } from './confirmMana';
import { getView } from './uiViews';
import { showCreateChanceUI } from './createNewChance';
import { showSendChancItemsUI } from './sendChanceItems';

let show = false
export let loading = true

export let yourChances:any[] = []
let visibleItems:any[] = []
export let yourChancesPage:number = 1

export async function showCreateChance(value:boolean){
    show = value
    yourChancesPage = 1
    visibleItems.length = 0
    yourChances.length = 0
    loading = true
    colyseusLottery?.send('get-creator-chances', {})
}

export function updateUserChances(chances:any[]){
    yourChances = chances
    loading = false
    updateVisibleItems()
}

function updateVisibleItems(){
    visibleItems = paginateArray([...lotteries.filter((lottery:any)=> lottery.owner === localUserId)], yourChancesPage, 4)
}

export function creatorChanceUI() {
    return (
        <UiEntity
            key={resources.slug + "create::chance::ui"}
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

{/* loading chances */}
<UiEntity
            uiTransform={{
                display:loading ? "flex": "none",
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
            uiText={{value:"LOADING...",fontSize:sizeFont(40,25)}}
        ></UiEntity>

{/* your chances screen */}
<UiEntity
            uiTransform={{
                display: !loading ? "flex": "none",
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
            position={{right:'5%', top:'5%'}}
            label={"Create"}
            func={()=>{
                showCreateChance(false)
                showCreateChanceUI(true)
            }}
            />

<CustomButton
            margin={'1%'}
            positionType='absolute'
            position={{left:'5%', bottom:'5%'}}
            label={"Close"}
            func={()=>{
                showCreateChance(false)
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
                    margin:{top:"10%"}
                }}
                uiText={{value:"Your Chances", textAlign:'middle-left', textWrap:'nowrap', fontSize:sizeFont(35,25)}}
            />

<UiEntity
                uiTransform={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '7%',
                    margin:{top:"2%"}
                }}
                uiBackground={{color:Color4.Black()}}
            >
                <UiEntity
                uiTransform={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '30%',
                    height: '15%',
                }}
                uiText={{value: "Name", textAlign:'middle-left', textWrap:'nowrap', fontSize:sizeFont(25,20)}}
                />

<UiEntity
                uiTransform={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '10%',
                    height: '15%',

                }}
                uiText={{value: "Items", textAlign:'middle-center', textWrap:'nowrap', fontSize:sizeFont(25,20)}}
                />

<UiEntity
                uiTransform={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '10%',
                    height: '15%',

                }}
                uiText={{value: "Cost", textAlign:'middle-center', textWrap:'nowrap', fontSize:sizeFont(25,20)}}
                />

<UiEntity
                uiTransform={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '10%',
                    height: '15%',
                }}
                uiText={{value: "Win %", textAlign:'middle-center', textWrap:'nowrap', fontSize:sizeFont(25,20)}}
                />
<UiEntity
                uiTransform={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '10%',
                    height: '15%',
                }}
                uiText={{value: "Delay", textAlign:'middle-center', textWrap:'nowrap', fontSize:sizeFont(25,20)}}
                />

<UiEntity
                uiTransform={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '10%',
                    height: '15%',
                }}
                uiText={{value: "Chances", textAlign:'middle-center', textWrap:'nowrap', fontSize:sizeFont(25,20)}}
                />

<UiEntity
                uiTransform={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '20%',
                    height: '15%',
                }}
                uiText={{value: 'Status', textAlign:'middle-center', textWrap:'nowrap', fontSize:sizeFont(25,20)}}
                >
</UiEntity>

            </UiEntity>

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
                        if(yourChancesPage -1 >= 1){
                            yourChancesPage = 1
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
                        yourChancesPage++
                        updateVisibleItems()
                    }}
                />


</UiEntity>

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
                    height: '10%',
                    margin:{top:"2%"}
                }}
                uiBackground={{color:Color4.create(0,0,0,.5)}}
            >
                <UiEntity
                uiTransform={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '30%',
                    height: '15%',
                }}
                uiText={{value: "" + chance.name, textAlign:'middle-left', textWrap:'nowrap', fontSize:sizeFont(25,20)}}
                />

<UiEntity
                uiTransform={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '10%',
                    height: '15%',

                }}
                uiText={{value: "" + chance.items.length, textAlign:'middle-center', textWrap:'nowrap', fontSize:sizeFont(25,20)}}
                />

<UiEntity
                uiTransform={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '10%',
                    height: '15%',

                }}
                uiText={{value: "" + chance.costToPlay, textAlign:'middle-center', textWrap:'nowrap', fontSize:sizeFont(25,20)}}
                />

<UiEntity
                uiTransform={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '10%',
                    height: '15%',
                }}
                uiText={{value: "" + chance.chanceToWin + "%", textAlign:'middle-center', textWrap:'nowrap', fontSize:sizeFont(25,20)}}
                />

<UiEntity
                uiTransform={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '10%',
                    height: '15%',
                }}
                uiText={{value: "" + (chance.cooldown + " " + (chance.cooldownType == 0 ? "min" : "hrs")), textAlign:'middle-center', textWrap:'nowrap', fontSize:sizeFont(25,20)}}
                />

<UiEntity
                uiTransform={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '10%',
                    height: '15%',
                }}
                uiText={{value: "" + chance.chances.length, textAlign:'middle-center', textWrap:'nowrap', fontSize:sizeFont(25,20)}}
                />

<UiEntity
                uiTransform={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '20%',
                    height: '15%',
                }}
                >

                {chance.status === "pending" ?

                    <CustomButton
                    label={"Send NFTs"}
                    func={()=>{
                        showCreateChance(false)
                        // showEditChance(true)
                        showSendChancItemsUI(true, chance, true)
                        // updateEditChanceview('sending', chance)
                    }}
                    />
                    : 

                    chance.status === "active" ? 

                    <CustomButton
                    margin={'1%'}
                    positionType='absolute'
                    position={{right:'5%', top:'5%'}}
                    label={"Cancel"}
                    func={()=>{
                        showCreateChance(false)
                        displaySkinnyVerticalPanel(true, getView("Cancel_Lottery"), chance.name, ()=>{
                            sendServerMessage('cancel-lottery', {id:chance.id}, colyseusLottery)
                        },)
                    }}
                    />

                    : 

                    <UiEntity
                uiTransform={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '10%',
                    height: '15%',
                }}
                uiText={{value: 'FINISHED', textAlign:'middle-center', textWrap:'nowrap', fontSize:sizeFont(25,20)}}
                />
            }
                </UiEntity>

            </UiEntity>
        )
    })
    return arr
}