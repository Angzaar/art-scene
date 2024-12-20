import ReactEcs, {UiEntity} from '@dcl/sdk/react-ecs'
import {
    calculateSquareImageDimensions,
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

let show = false

export async function showPlayChance(value:boolean){
    show = value
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
    </UiEntity>
        </UiEntity>
        </UiEntity>
    )
}

function generateYourChances(){
    let arr:any[] = []
    lotteries.filter((lottery:any) => lottery.status === "active").forEach((chance:any)=>{
        arr.push(
            <UiEntity
                uiTransform={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '17%',
                    margin:{top:"2%"}
                }}
                uiBackground={{color:Color4.create(0,0,0,.5)}}
            >
<UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '20%',
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
                        height: '20%',
                    }}
                    uiText={{value: "Chance: " + chance.chanceToWin + "%", textAlign:'middle-left', textWrap:'nowrap', fontSize:sizeFont(25,15)}}
                    />

<UiEntity
uiTransform={{
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '20%',

}}
uiText={{value: "Cost: " + chance.costToPlay, textAlign:'middle-left', textWrap:'nowrap', fontSize:sizeFont(25,15)}}
/>
</UiEntity>

<UiEntity
uiTransform={{
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    width: '60%',
    height: '100%',
    margin:{left:'2%', top:"1%"}
}}
>
    {generateLotteryImages(chance.items)}
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
}
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