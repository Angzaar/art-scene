import ReactEcs, {Dropdown, UiEntity} from '@dcl/sdk/react-ecs'
import {
    getImageAtlasMapping,
    sizeFont
} from './helpers';
import resources, { colors, dclColors } from '../helpers/resources';
import { uiSizes } from './uiConfig';
import { BigBackground } from './BigBackground';
import { Color4 } from '@dcl/sdk/math';
import { convertETHNumber } from '../helpers/functions';
import { selectedItems, updateStoreView } from './createStoreUI';
import { editChanceView } from './editChance';

let show = true

export function ItemCard(info:any) {
    let item = info.item
    let props:any

    if(item.nft){
        props = item.nft
    }else if(item.item){
        props = item.item
    }else{
        props = item
    }
    return (
        <UiEntity
        key={resources.slug + "item::card::" + props.id}
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '33%',
            height: '33%',
            margin:{top:"1%"}
        }}
        uiBackground={getBackground(props)}
        >

<UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '80%',
            height: '80%',
        }}
        uiBackground={{color: props.data ? dclColors[props.data[props.category].rarity] : Color4.Black()}}
        >
        <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                width: '100%',
                height: '100%',
            }}
            uiBackground={{
                textureMode: 'stretch',
                texture: {
                    src: props.thumbnail ? props.thumbnail : props.image ? props.image : ""
                },
            }}
            onMouseDown={()=>{
                info.func(props)
            }}
            />
        </UiEntity>



<UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: props.chanceStatus ? '80%' : '20%',
            height: '10%',
            positionType:'absolute',
            position:{right:props.chanceStatus ? '10%' : '7%', top:'10%'},
            display: props.chanceStatus ? "flex" : "none",
        }}
        uiBackground={{color:props.chanceStatus ? props.chanceStatus === "PENDING" ? Color4.Red() : props.chanceStatus === "DONE" ? Color4.Green() : Color4.Yellow() : Color4.Black()}}
        uiText={{textWrap:'nowrap', value:"" + (props.chanceStatus ? props.chanceStatus : ""), fontSize:sizeFont(30,20), textAlign:'middle-center',color:props.chanceStatus ? props.chanceStatus === "SENDING" ? Color4.Black() : Color4.Black() : Color4.White()}}
        />

<UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '85%',
            height: '15%',
            positionType:'absolute',
            position:{bottom:'8%'}
        }}
        uiBackground={{color:Color4.create(0,0,0,1)}}
        >

<UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '95%',
            height: '15%',
        }}
        uiText={{value:"" + (props.name ? props.name : ""), fontSize:sizeFont(25,15), textAlign:'middle-left', color:Color4.White()}}
        />

        </UiEntity>
    </UiEntity>
    )
}

function getBackground(item:any):any{
    if(selectedItems.findIndex((it:any)=> it.id === item.id) >= 0){
        if(editChanceView === "edit"){
            return {color:Color4.Yellow()}
        }else{
            return {
                textureMode: 'stretch',
                texture: {
                    src: 'images/atlas2.png',
                },
                uvs: getImageAtlasMapping(uiSizes.vertRectangle)
            }
        }
        
    }else{
        return {
            textureMode: 'stretch',
            texture: {
                src: 'images/atlas2.png',
            },
            uvs: getImageAtlasMapping(uiSizes.vertRectangle)
        }
    }
}